import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from '../types/db'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For server components and API routes (import this in server-side code only)
// export const createSupabaseServerClient = async () => {
//   const cookieStore = await cookies()
//   return createServerClient(supabaseUrl, supabaseAnonKey, {
//     cookies: cookieStore,
//   })
// }

export const createSupabaseServerClient = () => {
  // const cookieStore = cookies()
  return createServerComponentClient<Database>({cookies,})
}