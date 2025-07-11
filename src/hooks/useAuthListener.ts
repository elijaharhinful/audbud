'use client'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { supabase } from '@/lib/supabase/client'
import { setUser } from '@/store/authSlice'
import { AppDispatch } from '@/store'

export const useAuthListener = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        dispatch(setUser(session.user))
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            dispatch(setUser(session.user))
          }
        } else if (event === 'SIGNED_OUT') {
          dispatch(setUser(null))
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])
}