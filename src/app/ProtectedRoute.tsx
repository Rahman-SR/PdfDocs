import { LoaderCircle } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'

export function ProtectedRoute() {
  // Workspace routes wait for session recovery before allowing or redirecting access.
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') {
    return (
      <main
        className="grid min-h-screen place-items-center bg-paper px-6 text-ink dark:bg-slate-950 dark:text-slate-100"
        aria-live="polite"
      >
        <div className="flex items-center gap-3 text-sm font-semibold">
          <LoaderCircle className="size-5 animate-spin text-leaf" aria-hidden />
          Checking your session…
        </div>
      </main>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
