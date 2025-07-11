// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatarUrl: string | null
          salary: number | null
          location: string | null
          familySize: number | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatarUrl?: string | null
          salary?: number | null
          location?: string | null
          familySize?: number | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatarUrl?: string | null
          salary?: number | null
          location?: string | null
          familySize?: number | null
          createdAt?: string
          updatedAt?: string
        }
      }
      budgets: {
        Row: {
          id: string
          userId: string
          category: string
          amount: number
          period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          category: string
          amount: number
          period?: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          category?: string
          amount?: number
          period?: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
          createdAt?: string
          updatedAt?: string
        }
      }
      expenses: {
        Row: {
          id: string
          userId: string
          budgetId: string | null
          amount: number
          description: string
          category: string
          audioUrl: string | null
          transcription: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          userId: string
          budgetId?: string | null
          amount: number
          description: string
          category: string
          audioUrl?: string | null
          transcription?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          userId?: string
          budgetId?: string | null
          amount?: number
          description?: string
          category?: string
          audioUrl?: string | null
          transcription?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
    }
  }
}