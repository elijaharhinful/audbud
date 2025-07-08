import { Budget, Expense } from './types'

export const mockBudgets: Budget[] = [
  { id: '1', category: 'Food & Dining', amount: 800, userId: '1' },
  { id: '2', category: 'Transportation', amount: 300, userId: '1' },
  { id: '3', category: 'Entertainment', amount: 200, userId: '1' },
  { id: '4', category: 'Shopping', amount: 400, userId: '1' },
  { id: '5', category: 'Bills & Utilities', amount: 600, userId: '1' }
]

export const mockExpenses: Expense[] = [
  { id: '1', userId: '1', amount: 25.50, category: 'Food & Dining', description: 'Lunch at cafe', date: new Date().toISOString(), isVoiceEntry: true , createdAt: new Date().toISOString() },
  { id: '2', userId: '1', amount: 50.00, category: 'Transportation', description: 'Gas station', date: new Date().toISOString(), isVoiceEntry: false , createdAt: new Date().toISOString() },
  { id: '3', userId: '1', amount: 15.99, category: 'Entertainment', description: 'Movie ticket', date: new Date().toISOString(), isVoiceEntry: true , createdAt: new Date().toISOString()},
  { id: '4', userId: '1', amount: 89.99, category: 'Shopping', description: 'Clothes', date: new Date().toISOString(), isVoiceEntry: false , createdAt: new Date().toISOString()},
  { id: '5', userId: '1', amount: 120.00, category: 'Bills & Utilities', description: 'Electricity bill', date: new Date().toISOString(), isVoiceEntry: false , createdAt: new Date().toISOString()}
]

export const mockCategorySpending: Record<string, number> = {
  'Food & Dining': 125.50,
  'Transportation': 80.00,
  'Entertainment': 45.99,
  'Shopping': 150.99,
  'Bills & Utilities': 280.00
}