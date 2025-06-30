import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For client components with auth
export const createSupabaseClient = () => {
  return createClientComponentClient()
}

// For server components
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
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