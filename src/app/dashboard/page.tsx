'use client'
import React, { useState, useEffect } from 'react'
import { 
  Sun, 
  Moon,
  Palette,
  DollarSign,
  Target,
  Wallet,
  BarChart3,
  Calendar,
  Mic,
  Plus,
  Bell,
  X
} from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import Sidebar from '@/components/Sidebar'

// Types
interface Budget {
  id: string
  category: string
  amount: number
  userId: string
}

interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  description: string
  date: string
  isVoiceEntry: boolean
}

interface StatsCardsProps {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  budgetHealthPercentage: number
  isDark: boolean
  accentColor: string
}

interface HeaderProps {
  isDark: boolean
  accentColor: string
  toggleTheme: () => void
  setAccentColor: (color: string) => void
}

interface VoiceRecorderProps {
  isDark: boolean
  accentColor: string
}

interface ChartsProps {
  budgetVsSpent: Array<{
    category: string
    budget: number
    spent: number
    remaining: number
  }>
  pieData: Array<{
    name: string
    value: number
  }>
  isDark: boolean
  accentColor: string
}

interface RecentExpensesProps {
  expenses: Expense[]
  isDark: boolean
  accentColor: string
}

interface QuickActionsProps {
  isDark: boolean
  accentColor: string
}

// Accent color options
const accentColors = [
  { name: 'Lime', value: '#65a30d' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Indigo', value: '#6366f1' }
]

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658']

// Mock data for demonstration
const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', amount: 800, userId: '1' },
  { id: '2', category: 'Transportation', amount: 300, userId: '1' },
  { id: '3', category: 'Entertainment', amount: 200, userId: '1' },
  { id: '4', category: 'Shopping', amount: 400, userId: '1' },
  { id: '5', category: 'Bills & Utilities', amount: 600, userId: '1' }
]

const mockExpenses: Expense[] = [
  { id: '1', userId: '1', amount: 25.50, category: 'Food & Dining', description: 'Lunch at cafe', date: new Date().toISOString(), isVoiceEntry: true },
  { id: '2', userId: '1', amount: 50.00, category: 'Transportation', description: 'Gas station', date: new Date().toISOString(), isVoiceEntry: false },
  { id: '3', userId: '1', amount: 15.99, category: 'Entertainment', description: 'Movie ticket', date: new Date().toISOString(), isVoiceEntry: true },
  { id: '4', userId: '1', amount: 89.99, category: 'Shopping', description: 'Clothes', date: new Date().toISOString(), isVoiceEntry: false },
  { id: '5', userId: '1', amount: 120.00, category: 'Bills & Utilities', description: 'Electricity bill', date: new Date().toISOString(), isVoiceEntry: false }
]

const mockCategorySpending: Record<string, number> = {
  'Food & Dining': 125.50,
  'Transportation': 80.00,
  'Entertainment': 45.99,
  'Shopping': 150.99,
  'Bills & Utilities': 280.00
}

// Header Component
function Header({ isDark, accentColor, toggleTheme, setAccentColor }: HeaderProps) {
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
          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <Palette size={20} />
            </button>
            
            {showColorPicker && (
              <div className={`absolute right-0 top-12 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-lg z-10`}>
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Notifications */}
          <button className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <Bell size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

// Stats Cards Component
function StatsCards({ totalBudget, totalSpent, remainingBudget, budgetHealthPercentage, isDark, accentColor }: StatsCardsProps) {
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

// Voice Recorder Component
function VoiceRecorder({ isDark, accentColor }: VoiceRecorderProps) {
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

// Charts Component
function Charts({ budgetVsSpent, pieData, isDark, accentColor }: ChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Budget vs Spending Bar Chart */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Budget vs Spending
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={budgetVsSpent}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="category" 
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#ffffff' : '#000000'
              }}
            />
            <Legend />
            <Bar dataKey="budget" fill={accentColor} name="Budget" />
            <Bar dataKey="spent" fill="#10b981" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Spending by Category Pie Chart */}
      <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Spending by Category
        </h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#ffffff' : '#000000'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        ) : (
          <div className={`flex items-center justify-center h-[300px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            No spending data available
          </div>
        )}
      </div>
    </div>
  )
}

// Recent Expenses Component
function RecentExpenses({ expenses, isDark, accentColor }: RecentExpensesProps) {
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

// Quick Actions Component
function QuickActions({ isDark, accentColor }: QuickActionsProps) {
  const actions = [
    { icon: Plus, label: 'Add Expense', color: accentColor },
    { icon: Target, label: 'Set Budget', color: '#10b981' },
    { icon: BarChart3, label: 'View Reports', color: '#8b5cf6' },
    { icon: Calendar, label: 'Set Goals', color: '#f97316' }
  ]

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}>
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

// Main Dashboard Component
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