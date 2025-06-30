import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Budget {
  id: string
  userId: string
  category: string
  amount: number
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
  createdAt: string
  updatedAt: string
}

interface BudgetState {
  budgets: Budget[]
  totalBudget: number
  isLoading: boolean
  error: string | null
}

const initialState: BudgetState = {
  budgets: [],
  totalBudget: 0,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchBudgets = createAsyncThunk(
  'budget/fetchBudgets',
  async (userId: string) => {
    const response = await fetch(`/api/budget?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch budgets')
    return response.json()
  }
)

export const createBudget = createAsyncThunk(
  'budget/createBudget',
  async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    })
    if (!response.ok) throw new Error('Failed to create budget')
    return response.json()
  }
)

export const updateBudget = createAsyncThunk(
  'budget/updateBudget',
  async ({ id, ...budgetData }: Partial<Budget> & { id: string }) => {
    const response = await fetch(`/api/budget/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(budgetData),
    })
    if (!response.ok) throw new Error('Failed to update budget')
    return response.json()
  }
)

export const deleteBudget = createAsyncThunk(
  'budget/deleteBudget',
  async (id: string) => {
    const response = await fetch(`/api/budget/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete budget')
    return id
  }
)

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setBudgets: (state, action: PayloadAction<Budget[]>) => {
      state.budgets = action.payload
      state.totalBudget = action.payload.reduce((sum, budget) => sum + budget.amount, 0)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
        state.totalBudget = action.payload.reduce((sum: number, budget: Budget) => sum + budget.amount, 0)
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch budgets'
      })
      // Create budget
      .addCase(createBudget.fulfilled, (state, action) => {
        state.budgets.push(action.payload)
        state.totalBudget += action.payload.amount
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to create budget'
      })
      // Update budget
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          const oldAmount = state.budgets[index].amount
          state.budgets[index] = action.payload
          state.totalBudget = state.totalBudget - oldAmount + action.payload.amount
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update budget'
      })
      // Delete budget
      .addCase(deleteBudget.fulfilled, (state, action) => {
        const budget = state.budgets.find(b => b.id === action.payload)
        if (budget) {
          state.totalBudget -= budget.amount
          state.budgets = state.budgets.filter(b => b.id !== action.payload)
        }
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete budget'
      })
  },
})

export const { clearError, setBudgets } = budgetSlice.actions
export default budgetSlice.reducer