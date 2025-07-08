import React, { useState } from 'react'
import { Mic, X } from 'lucide-react'
import { VoiceRecorderProps } from '@/lib/types'

export default function VoiceRecorder({ isDark, accentColor }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Voice Expense Entry
        </h3>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`p-3 rounded-full text-white transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'hover:opacity-90'}`}
          style={!isRecording ? { backgroundColor: accentColor } : {}}
        >
          {isRecording ? <X size={20} /> : <Mic size={20} />}
        </button>
      </div>
      
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {isRecording ? 'Recording... Speak your expense' : 'Click the microphone to record an expense'}
      </p>
      
      {!isRecording && (
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
          Example: "I spent $12.50 on lunch at McDonald's"
        </p>
      )}
    </div>
  )
}