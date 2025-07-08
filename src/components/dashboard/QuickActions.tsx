import React from 'react'
import { Plus, Target, BarChart3, Calendar } from 'lucide-react'
import { QuickActionsProps } from '@/lib/types'

export default function QuickActions({ isDark, accentColor }: QuickActionsProps) {
  const actions = [
    { icon: Plus, label: 'Add Expense', color: accentColor },
    { icon: Target, label: 'Set Budget', color: '#10b981' },
    { icon: BarChart3, label: 'View Reports', color: '#8b5cf6' },
    { icon: Calendar, label: 'Set Goals', color: '#f97316' }
  ]

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} mb-6 p-6 rounded-lg shadow-sm border`}>
      <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center p-4 rounded-lg text-white hover:opacity-90 transition-colors"
            style={{ backgroundColor: action.color }}
          >
            <action.icon size={24} className="mb-2" />
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
