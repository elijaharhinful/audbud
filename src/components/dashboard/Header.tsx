import React, { useState } from 'react'
import { Sun, Moon, Palette, Bell } from 'lucide-react'
import { HeaderProps } from '@/lib/types'
import { accentColors } from '../providers/ThemeProvider'

export default function Header({ isDark, accentColor, toggleTheme, setAccentColor }: HeaderProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)

  return (
    <header className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Dashboard
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Welcome back! Here's your financial overview.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <Palette size={20} />
            </button>
            
            {showColorPicker && (
              <div className={`w-40 absolute right-0 top-12 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-lg z-10`}>
                <p className={`text-sm font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Accent Color
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setAccentColor(color.value)
                        setShowColorPicker(false)
                      }}
                      className={`w-8 h-8 rounded-full border-2 ${
                        accentColor === color.value ? 'border-gray-400' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
