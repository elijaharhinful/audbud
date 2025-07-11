'use client'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import StatsCards from '@/components/dashboard/StatsCards'
import Charts from '@/components/dashboard/Charts'
import VoiceRecorder from '@/components/dashboard/VoiceRecorder'
import RecentExpenses from '@/components/dashboard/RecentExpenses'
import QuickActions from '@/components/dashboard/QuickActions'
import { mockBudgets, mockExpenses, mockCategorySpending } from '@/lib/mockData'
import Footer from '@/components/dashboard/Footer'
import { AppDispatch, RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/store/authSlice'

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { user, loading } = useSelector((state: RootState) => state.auth)

  const [isDark, setIsDark] = useState(false)
  const [accentColor, setAccentColor] = useState('#65a30d')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    // Check authentication on component mount
  useEffect(() => {
    if (!user && !loading) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, user, loading])

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

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

    // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard if user is not authenticated
  if (!user) {
    return null
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} ${sidebarCollapsed ? 'ml-16':'ml-64'} transition-colors`}>
      <div className="flex">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={toggleSidebar}
          isDark={isDark}
          accentColor={accentColor}
          user={user}
        />
        
        <div className="flex-1 flex flex-col">
          <Header 
            isDark={isDark}
            accentColor={accentColor}
            toggleTheme={toggleTheme}
            setAccentColor={setAccentColor}
            title='Dashboard'
            subtitle="Welcome back! Here's your financial overview."
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

          <Footer 
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  )
}
