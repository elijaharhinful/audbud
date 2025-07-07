'use client'
import { format } from 'date-fns'
import { Trash2, Edit3, Mic } from 'lucide-react'
import { ExpenseListProps, Expense } from '@/lib/types'

export default function ExpenseList({ 
  expenses, 
  onEdit, 
  onDelete, 
  showActions = true, 
  maxItems 
}: ExpenseListProps) {
  const displayExpenses = maxItems ? expenses.slice(0, maxItems) : expenses

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No expenses recorded yet.</p>
        <p className="text-sm mt-2">Start by adding an expense using voice or manual entry.</p>
      </div>
    )
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      food: 'bg-orange-100 text-orange-800',
      transportation: 'bg-blue-100 text-blue-800',
      entertainment: 'bg-purple-100 text-purple-800',
      utilities: 'bg-green-100 text-green-800',
      healthcare: 'bg-red-100 text-red-800',
      shopping: 'bg-pink-100 text-pink-800',
      education: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800'
    }
    return colors[category.toLowerCase()] || colors.other
  }

  return (
    <div className="space-y-3">
      {displayExpenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-lg font-semibold text-gray-900">
                ${expense.amount.toFixed(2)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
                {expense.category}
              </span>
              {expense.isVoiceEntry && (
                <span className="flex items-center text-xs text-blue-600">
                  <Mic className="w-3 h-3 mr-1" />
                  Voice
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-600 mb-1">
              {expense.description}
            </div>
            
            <div className="text-xs text-gray-500">
              {format(new Date(expense.date), 'MMM dd, yyyy • h:mm a')}
            </div>
          </div>

          {showActions && (onEdit || onDelete) && (
            <div className="flex items-center space-x-2 ml-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(expense)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Edit expense"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              
              {onDelete && (
                <button
                  onClick={() => onDelete(expense.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
      
      {maxItems && expenses.length > maxItems && (
        <div className="text-center pt-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all {expenses.length} expenses →
          </button>
        </div>
      )}
    </div>
  )
}

// Summary component for expense statistics
export function ExpenseSummary({ expenses }: { expenses: Expense[] }) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0]
  const voiceEntries = expenses.filter(e => e.isVoiceEntry).length

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">${totalAmount.toFixed(2)}</div>
        <div className="text-sm text-gray-600">Total Spent</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{expenses.length}</div>
        <div className="text-sm text-gray-600">Transactions</div>
      </div>
      
      {topCategory && (
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600 capitalize">{topCategory[0]}</div>
          <div className="text-sm text-gray-600">Top Category</div>
        </div>
      )}
      
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{voiceEntries}</div>
        <div className="text-sm text-gray-600">Voice Entries</div>
      </div>
    </div>
  )
}