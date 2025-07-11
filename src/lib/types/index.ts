import { User } from "@supabase/supabase-js"

export interface Budget {
  id: string
  category: string
  amount: number
  spent?: number
  userId: string
}

export interface BudgetChartProps {
  budgets: Budget[]
  categorySpending: Record<string, number>
  type?: 'bar' | 'pie'
}

export interface ChartsProps {
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

export interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  isVoiceEntry?: boolean
  userId: string
  createdAt: string
  updatedAt?: string
}

export interface ExpenseListProps {
  expenses: Expense[]
  onEdit?: (expense: Expense) => void
  onDelete?: (expenseId: string) => void
  showActions?: boolean
  maxItems?: number
}

export interface VoiceRecorderProps {
  onTranscriptionComplete?: (text: string) => void
  isDark: boolean
  accentColor: string
}

export interface StatsCardsProps {
  totalBudget: number
  totalSpent: number
  remainingBudget: number
  budgetHealthPercentage: number
  isDark: boolean
  accentColor: string
}

export interface HeaderProps {
  isDark: boolean
  accentColor: string
  toggleTheme: () => void
  setAccentColor: (color: string) => void
  title: string
  subtitle: string
}

export interface FooterProps {
  isDark: boolean
}

export interface RecentExpensesProps {
  expenses: Expense[]
  isDark: boolean
  accentColor: string
}

export interface QuickActionsProps {
  isDark: boolean
  accentColor: string
}

export interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isDark: boolean
  accentColor: string
  user: User
}