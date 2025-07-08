import React from 'react'
import { Target, DollarSign, Wallet } from 'lucide-react'
import { StatsCardsProps } from '@/lib/types'

export default function StatsCards({ totalBudget, totalSpent, remainingBudget, budgetHealthPercentage, isDark, accentColor }: StatsCardsProps) {
  const stats = [
    {
      title: 'Total Budget',
      value: `$${totalBudget.toFixed(2)}`,
      icon: Target,
      color: accentColor
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: '#ef4444'
    },
    {
      title: 'Remaining',
      value: `$${remainingBudget.toFixed(2)}`,
      icon: Wallet,
      color: '#10b981',
      subtitle: `${budgetHealthPercentage}% of budget left`
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-1`}>
                  {stat.subtitle}
                </p>
              )}
            </div>
            <div
              className="p-3 rounded-full"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
