'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  isDark: boolean
  accentColor: string
  toggleTheme: () => void
  setAccentColor: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  accentColor: '#65a30d',
  toggleTheme: () => {},
  setAccentColor: () => {}
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false)
  const [accentColor, setAccentColor] = useState('#65a30d')

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const savedAccent = localStorage.getItem('accentColor')
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }
    
    if (savedAccent) {
      setAccentColor(savedAccent)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Save accent color
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor)
    
    // Set CSS custom property for accent color
    document.documentElement.style.setProperty('--accent-color', accentColor)
  }, [accentColor])

  const toggleTheme = () => setIsDark(!isDark)

  const value = {
    isDark,
    accentColor,
    toggleTheme,
    setAccentColor
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Accent color options
export const accentColors = [
  { name: 'Lime', value: '#65a30d', tailwind: 'lime' },
  { name: 'Blue', value: '#3b82f6', tailwind: 'blue' },
  { name: 'Purple', value: '#8b5cf6', tailwind: 'violet' },
  { name: 'Pink', value: '#ec4899', tailwind: 'pink' },
  { name: 'Orange', value: '#f97316', tailwind: 'orange' },
  { name: 'Emerald', value: '#10b981', tailwind: 'emerald' },
  { name: 'Red', value: '#ef4444', tailwind: 'red' },
  { name: 'Indigo', value: '#6366f1', tailwind: 'indigo' }
]