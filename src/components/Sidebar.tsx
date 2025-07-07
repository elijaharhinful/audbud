'use client'
import React from 'react'
import { 
  Home, 
  PieChart, 
  Wallet, 
  TrendingUp, 
  Settings, 
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isDark: boolean
  accentColor: string
}

interface MenuItem {
  icon: React.ComponentType<{ size?: number }>
  label: string
  active?: boolean
}

export default function Sidebar({ isCollapsed, onToggle, isDark, accentColor }: SidebarProps) {
  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: PieChart, label: 'Analytics' },
    { icon: Wallet, label: 'Budgets' },
    { icon: TrendingUp, label: 'Expenses' },
    { icon: BarChart3, label: 'Reports' },
    { icon: Calendar, label: 'Goals' },
    { icon: Settings, label: 'Settings' }
  ]

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AudBud
            </h1>
          )}
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              item.active 
                ? `text-white` 
                : `${isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
            style={item.active ? { backgroundColor: accentColor } : {}}
            title={isCollapsed ? item.label : ''}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                John Doe
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                john@example.com
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}