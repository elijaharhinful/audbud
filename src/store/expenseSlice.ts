import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Expense {
  id: string
  userId: string
  budgetId?: string
  amount: number
  description: string
  category: string
  audioUrl?: string
  transcription?: string
  createdAt: string
  updatedAt: string
}

interface ExpenseState {
  expenses: Expense[]
  recentExpenses: Expense[]
  totalSpent: number
  categorySpending: Record<string, number>
  isLoading: boolean
  error: string | null
  isProcessingVoice: boolean
}

const initialState: ExpenseState = {
  expenses: [],
  recentExpenses: [],
  totalSpent: 0,
  categorySpending: {},
  isLoading: false,
  error: null,
  isProcessingVoice: false,
}

// Async thunks
export const fetchExpenses = createAsyncThunk(
  'expense/fetchExpenses',
  async (userId: string) => {
    const response = await fetch(`/api/expenses?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch expenses')
    return response.json()
  }
)

export const createExpense = createAsyncThunk(
  'expense/createExpense',
  async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    })
    if (!response.ok) throw new Error('Failed to create expense')
    return response.json()
  }
)

export const processVoiceExpense = createAsyncThunk(
  'expense/processVoiceExpense',
  async ({ audioBlob, userId }: { audioBlob: Blob; userId: string }) => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.wav')
    formData.append('userId', userId)

    const response = await fetch('/api/voice/transcribe', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Failed to process voice')
    return response.json()
  }
)

export const updateExpense = createAsyncThunk(
  'expense/updateExpense',
  async ({ id, ...expenseData }: Partial<Expense> & { id: string }) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    })
    if (!response.ok) throw new Error('Failed to update expense')
    return response.json()
  }
)

export const deleteExpense = createAsyncThunk(
  'expense/deleteExpense',
  async (id: string) => {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete expense')
    return id
  }
)

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setExpenses: (state, action: PayloadAction<Expense[]>) => {
      state.expenses = action.payload
      state.recentExpenses = action.payload
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
      
      // Calculate totals
      state.totalSpent = action.payload.reduce((sum, expense) => sum + expense.amount, 0)
      
      // Calculate category spending
      state.categorySpending = action.payload.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {} as Record<string, number>)
    },
    addExpense: (state, action: PayloadAction<Expense>) => {
      state.expenses.unshift(action.payload)
      state.recentExpenses = [action.payload, ...state.recentExpenses].slice(0, 10)
      state.totalSpent += action.payload.amount
      state.categorySpending[action.payload.category] = 
        (state.categorySpending[action.payload.category] || 0) + action.payload.amount
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false
        const expenses = action.payload
        state.expenses = expenses
        state.recentExpenses = expenses
          .sort((a: Expense, b: Expense) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
        
        state.totalSpent = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0)
        state.categorySpending = expenses.reduce((acc: Record<string, number>, expense: Expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount
          return acc
        }, {})
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch expenses'
      })
      
      // Create expense
      .addCase(createExpense.fulfilled, (state, action) => {
        const newExpense = action.payload
        state.expenses.unshift(newExpense)
        state.recentExpenses = [newExpense, ...state.recentExpenses].slice(0, 10)
        state.totalSpent += newExpense.amount
        state.categorySpending[newExpense.category] = 
          (state.categorySpending[newExpense.category] || 0) + newExpense.amount
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create expense'
      })
      
      // Process voice expense
      .addCase(processVoiceExpense.pending, (state) => {
        state.isProcessingVoice = true
        state.error = null
      })
      .addCase(processVoiceExpense.fulfilled, (state, action) => {
        state.isProcessingVoice = false
        const newExpense = action.payload
        state.expenses.unshift(newExpense)
        state.recentExpenses = [newExpense, ...state.recentExpenses].slice(0, 10)
        state.totalSpent += newExpense.amount
        state.categorySpending[newExpense.category] = 
          (state.categorySpending[newExpense.category] || 0) + newExpense.amount
      })
      .addCase(processVoiceExpense.rejected, (state, action) => {
        state.isProcessingVoice = false
        state.error = action.error.message || 'Failed to process voice expense'
      })
      
      // Update expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id)
        if (index !== -1) {
          const oldExpense = state.expenses[index]
          state.expenses[index] = action.payload
          
          // Update totals
          state.totalSpent = state.totalSpent - oldExpense.amount + action.payload.amount
          state.categorySpending[oldExpense.category] -= oldExpense.amount
          state.categorySpending[action.payload.category] = 
            (state.categorySpending[action.payload.category] || 0) + action.payload.amount
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update expense'
      })
      
      // Delete expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const expense = state.expenses.find(e => e.id === action.payload)
        if (expense) {
          state.totalSpent -= expense.amount
          state.categorySpending[expense.category] -= expense.amount
          state.expenses = state.expenses.filter(e => e.id !== action.payload)
          state.recentExpenses = state.recentExpenses.filter(e => e.id !== action.payload)
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete expense'
      })
  },
})

export const { clearError, setExpenses, addExpense } = expenseSlice.actions
export default expenseSlice.reducer