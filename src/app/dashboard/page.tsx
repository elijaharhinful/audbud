'use client'
import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/dashboard/Header'
import StatsCards from '@/components/dashboard/StatsCards'
import Charts from '@/components/dashboard/Charts'
import VoiceRecorder from '@/components/dashboard/VoiceRecorder'
import RecentExpenses from '@/components/dashboard/RecentExpenses'
import QuickActions from '@/components/dashboard/QuickActions'
import { mockBudgets, mockExpenses, mockCategorySpending } from '@/lib/mockData'

export default function Dashboard() {
  const [isDark, setIsDark] = useState(false)
  const [accentColor, setAccentColor] = useState('#65a30d')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Mock data - replace with actual Redux state
  const budgets = mockBudgets
  const expenses = mockExpenses
  const categorySpending = mockCategorySpending
  
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0)
  const remainingBudget = Math.max(0, totalBudget - totalSpent)
  const budgetHealthPercentage = totalBudget > 0 ? Math.round((remainingBudget / totalBudget) * 100) : 0

  const budgetVsSpent = budgets.map(budget => ({
    category: budget.category,
    budget: budget.amount,
    spent: categorySpending[budget.category] || 0,
    remaining: Math.max(0, budget.amount - (categorySpending[budget.category] || 0))
  }))

  const pieData = Object.entries(categorySpending).map(([category, amount]) => ({
    name: category,
    value: amount
  }))

  const toggleTheme = () => setIsDark(!isDark)
  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors`}>
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          isDark={isDark}
          accentColor={accentColor}
        />
        
        <div className="flex-1 flex flex-col">
          <Header 
            isDark={isDark}
            accentColor={accentColor}
            toggleTheme={toggleTheme}
            setAccentColor={setAccentColor}
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <QuickActions isDark={isDark} accentColor={accentColor} />
              
              <StatsCards
                totalBudget={totalBudget}
                totalSpent={totalSpent}
                remainingBudget={remainingBudget}
                budgetHealthPercentage={budgetHealthPercentage}
                isDark={isDark}
                accentColor={accentColor}
              />
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                <div className="xl:col-span-2">
                  <Charts
                    budgetVsSpent={budgetVsSpent}
                    pieData={pieData}
                    isDark={isDark}
                    accentColor={accentColor}
                  />
                </div>
                
                <div className="space-y-6">
                  <VoiceRecorder isDark={isDark} accentColor={accentColor} />
                  <RecentExpenses expenses={expenses} isDark={isDark} accentColor={accentColor} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
