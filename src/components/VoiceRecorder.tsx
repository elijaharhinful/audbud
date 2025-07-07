'use client'
import { useState, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { addExpense } from '@/store/expenseSlice'
import { Mic, Square, Play, Pause } from 'lucide-react'
import { VoiceRecorderProps } from '@/lib/types'

export default function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      audioChunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Process the audio for transcription
        await processAudio(audioBlob)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to access microphone. Please check permissions.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setError('')
    
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')
      
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to process audio')
      }
      
      const data = await response.json()
      
      if (data.success) {
        setTranscription(data.transcription)
        onTranscriptionComplete?.(data.transcription)
        
        // If we have expense data, automatically add it
        if (data.expense) {
          dispatch(addExpense(data.expense))
        }
      } else {
        setError(data.error || 'Failed to process audio')
      }
    } catch (err) {
      console.error('Error processing audio:', err)
      setError('Failed to process recording. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const playRecording = useCallback(() => {
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }, [audioUrl, isPlaying])

  const clearRecording = useCallback(() => {
    setAudioUrl(null)
    setTranscription('')
    setError('')
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-semibold">Voice Expense Entry</h3>
      
      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-4 rounded-full transition-colors"
            title="Start Recording"
          >
            <Mic className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-colors animate-pulse"
            title="Stop Recording"
          >
            <Square className="w-6 h-6" />
          </button>
        )}
        
        {audioUrl && (
          <>
            <button
              onClick={playRecording}
              disabled={isProcessing}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white p-3 rounded-full transition-colors"
              title={isPlaying ? "Pause" : "Play Recording"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            
            <button
              onClick={clearRecording}
              disabled={isProcessing}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">Recording...</span>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-blue-600 font-medium">Processing audio...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Transcription Display */}
      {transcription && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="font-medium text-green-800 mb-2">Transcription:</h4>
          <p className="text-green-700">{transcription}</p>
        </div>
      )}

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
      
      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center">
        <p>Click the microphone to record an expense.</p>
        <p className="text-xs mt-1">Example: &quot;I spent $12.50 on lunch at McDonald&apos;s&quot;</p>
      </div>
    </div>
  )
}