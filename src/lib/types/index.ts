export interface Budget {
  id: string
  category: string
  amount: number
  spent?: number
}

export interface BudgetChartProps {
  budgets: Budget[]
  categorySpending: Record<string, number>
  type?: 'bar' | 'pie'
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
  updatedAt: string
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
}