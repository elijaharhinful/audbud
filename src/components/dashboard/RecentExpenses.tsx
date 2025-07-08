import React from 'react'
import { Mic } from 'lucide-react'
import { RecentExpensesProps } from '@/lib/types'

export default function RecentExpenses({ expenses, isDark, accentColor }: RecentExpensesProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'food & dining': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'transportation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'entertainment': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'shopping': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bills & utilities': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  }

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Recent Expenses
        </h3>
        <button 
          className="text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {expenses.slice(0, 5).map((expense) => (
          <div
            key={expense.id}
            className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${expense.amount.toFixed(2)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                  {expense.category}
                </span>
                {expense.isVoiceEntry && (
                  <span className="flex items-center text-xs" style={{ color: accentColor }}>
                    <Mic className="w-3 h-3 mr-1" />
                    Voice
                  </span>
                )}
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {expense.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
