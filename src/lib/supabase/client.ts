import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../types/db'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// // For client components only
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // For client components (hook-style)
// export const createSupabaseClient = () => {
//   return createBrowserClient(supabaseUrl, supabaseAnonKey)
// }

export const supabase = createClientComponentClient<Database>()
