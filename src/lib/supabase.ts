import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client components only
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For client components (recommended)
export const createSupabaseClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// For server components only - import this in a separate file
export const createSupabaseServerClient = () => {
  const { cookies } = require('next/headers')
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies().getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies().set(name, value, options)
        })
      },
    },
  })
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