'use client'
import React, { useState, useRef, useEffect } from 'react'
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
  User,
  Eye,
  Edit,
  LogOut
} from 'lucide-react'
import { SidebarProps } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { signOut } from '@/store/authSlice'

interface MenuItem {
  icon: React.ComponentType<{ size?: number }>
  label: string
  active?: boolean
  href?: string
}

interface ProfileMenuItem {
  icon: React.ComponentType<{ size?: number }>
  label: string
  action: () => void
}

export default function Sidebar({ isCollapsed, onToggle, isDark, accentColor, user }: SidebarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', active: true, href: '/dashboard' },
    { icon: PieChart, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: Wallet, label: 'Budgets', href: '/dashboard/budgets' },
    { icon: TrendingUp, label: 'Expenses', href: '/dashboard/expenses' },
    { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { icon: Calendar, label: 'Goals', href: '/dashboard/goals' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' }
  ]

  const getUserDisplayName = () => {
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  }

  const getUserEmail = () => {
    return user.email || 'User not found'
  }

  const handleViewProfile = () => {
    setShowProfileDropdown(false)
    router.push('/dashboard/profile')
  }

  const handleEditProfile = () => {
    setShowProfileDropdown(false)
    router.push('/dashboard/profile?edit=true')
  }

  // Signout function
  const handleSignOut = async () => {
    try {
      setShowProfileDropdown(false)
      await dispatch(signOut()).unwrap()
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const profileMenuItems: ProfileMenuItem[] = [
    { icon: Eye, label: 'View Profile', action: handleViewProfile },
    { icon: Edit, label: 'Edit Profile', action: handleEditProfile },
    { icon: LogOut, label: 'Logout', action: handleSignOut }
  ]

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.href) {
      router.push(item.href)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col fixed left-0 top-0 h-screen z-30`}>
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
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isDark ? 'text-gray-300' : 'text-gray-600'} cursor-pointer`}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuItemClick(item)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 relative" ref={dropdownRef}>
        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <div className={`absolute bottom-full left-4 right-4 mb-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-lg overflow-hidden z-50`}>
            {profileMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors cursor-pointer ${
                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                } ${item.label === 'Logout' ? 'border-t border-gray-200 dark:border-gray-600' : ''}`}
              >
                <item.icon size={16} />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </button>
            ))}
          </div>
        )}

        {/* Profile Button */}
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {getUserDisplayName()}
              </p>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {getUserEmail()}
              </p>
            </div>
          )}
        </button>
      </div>
    </div>
  )
}