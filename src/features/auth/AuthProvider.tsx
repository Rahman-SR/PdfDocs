import type { User } from '@supabase/supabase-js'
import {
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { isSupabaseConfigured, supabase } from '../../lib/supabase'
import { AuthContext, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  // The provider owns the Supabase session lifecycle for the entire application.
  const [status, setStatus] = useState<AuthStatus>(
    isSupabaseConfigured ? 'loading' : 'unconfigured',
  )
  const [user, setUser] = useState<User | null>(null)
  const [isRecovery, setIsRecovery] = useState(false)
  const finishRecovery = useCallback(() => setIsRecovery(false), [])

  useEffect(() => {
    const client = supabase

    if (!client) {
      return
    }

    let isMounted = true

    const loadUser = async () => {
      const { data, error } = await client.auth.getUser()

      if (!isMounted) {
        return
      }

      if (error || !data.user) {
        setUser(null)
        setStatus('anonymous')
        return
      }

      setUser(data.user)
      setStatus('authenticated')
    }

    void loadUser()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return
      }

      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
      } else if (event === 'SIGNED_OUT') {
        setIsRecovery(false)
      }
      setUser(session?.user ?? null)
      setStatus(session?.user ? 'authenticated' : 'anonymous')
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({ finishRecovery, isRecovery, status, user }),
    [finishRecovery, isRecovery, status, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
