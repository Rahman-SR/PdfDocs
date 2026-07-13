import type { User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export type AuthStatus =
  | 'loading'
  | 'authenticated'
  | 'anonymous'
  | 'unconfigured'

export interface AuthContextValue {
  isRecovery: boolean
  status: AuthStatus
  user: User | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
