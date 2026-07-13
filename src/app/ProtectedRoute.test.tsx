import type { User } from '@supabase/supabase-js'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'

import {
  AuthContext,
  type AuthStatus,
} from '../features/auth/auth-context'
import { ProtectedRoute } from './ProtectedRoute'

function LoginProbe() {
  const location = useLocation()
  const state = location.state as { from?: { pathname?: string } } | null

  return <p>Login from {state?.from?.pathname ?? 'unknown'}</p>
}

function renderProtectedRoute(status: AuthStatus) {
  const user = status === 'authenticated' ? ({ id: 'user-1' } as User) : null

  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AuthContext.Provider value={{ isRecovery: false, status, user }}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<h1>Private dashboard</h1>} />
          </Route>
          <Route path="/login" element={<LoginProbe />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('renders the private route for an authenticated user', () => {
    renderProtectedRoute('authenticated')

    expect(
      screen.getByRole('heading', { name: 'Private dashboard' }),
    ).toBeInTheDocument()
  })

  it('redirects an anonymous user and preserves the requested route', () => {
    renderProtectedRoute('anonymous')

    expect(screen.getByText('Login from /dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Private dashboard')).not.toBeInTheDocument()
  })

  it('shows a neutral loading state while the session is verified', () => {
    renderProtectedRoute('loading')

    expect(screen.getByText('Checking your session…')).toBeInTheDocument()
    expect(screen.queryByText('Private dashboard')).not.toBeInTheDocument()
  })
})
