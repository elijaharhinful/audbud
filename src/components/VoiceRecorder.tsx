'use client'
import { useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Mic, MicOff, Square, Play, Pause } from 'lucide-react'
import { processVoiceExpense } from '../store/expenseSlice'
import { RootState, AppDispatch } from '../store'

interface VoiceRecorderProps {
  userId: string
  onExpenseCreated?: () => void
}

export default function VoiceRecorder({ userId, onExpenseCreated }: VoiceRecorderProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { isProcessingVoice } = useSelector((state: RootState) => state.expense)
  
  const [isRecording, setIsRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Failed to start recording. Please check microphone permissions.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

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

  const processRecording = useCallback(async () => {
    if (!audioUrl) return
    
    try {
      // Convert audio URL to blob
      const response = await fetch(audioUrl)
      const audioBlob = await response.blob()
      
      // Dispatch voice processing
      const result = await dispatch(processVoiceExpense({ audioBlob, userId }))
      
      if (processVoiceExpense.fulfilled.match(result)) {
        // Success - clear recording
        setAudioUrl(null)
        setRecordingTime(0)
        onExpenseCreated?.()
      }
    } catch (error) {
      console.error('Error processing recording:', error)
    }
  }, [audioUrl, userId, dispatch, onExpenseCreated])

  const discardRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setRecordingTime(0)
    }
  }, [audioUrl])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Voice Recording</h3>
      
      {/* Recording Status */}
      <div className="flex items-center justify-center space-x-4">
        {isRecording && (
          <div className="flex items-center space-x-2 text-red-600">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
          </div>
        )}
        
        {audioUrl && !isRecording && (
          <div className="text-gray-600">
            <span>Recording ready: {formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center space-x-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Mic className="w-5 h-5" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Square className="w-5 h-5" />
            <span>Stop Recording</span>
          </button>
        )}

        {audioUrl && (
          <>
            <button
              onClick={playRecording}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={processRecording}
              disabled={isProcessingVoice}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessingVoice ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Add Expense</span>
              )}
            </button>

            <button
              onClick={discardRecording}
              className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              <MicOff className="w-4 h-4" />
              <span>Discard</span>
            </button>
          </>
        )}
      </div>
      
      {/* Processing Status */}
      {isProcessingVoice && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Processing voice and extracting expense details...</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !audioUrl && (
        <div className="text-sm text-gray-500 text-center space-y-1">
          <p>Click &quot;Start Recording&quot; and say your expense.</p>
          <p>Example: &quot;I spent $15 on lunch at McDonald&apos;s&quot;</p>
        </div>
      )}

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}
    </div>
  )
}