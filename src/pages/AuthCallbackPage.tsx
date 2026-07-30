import { CircleAlert, LoaderCircle } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { getSafeRedirect } from '../lib/auth-redirect'

export function AuthCallbackPage() {
  // Email-confirmation redirects land here while Supabase restores the session.
  const { status } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const parameters = useMemo(() => new URLSearchParams(location.search), [location.search])
  const error = parameters.get('error_description') ?? parameters.get('error')
  const nextPath = getSafeRedirect(parameters.get('next'))

  useEffect(() => {
    if (status === 'authenticated' && !error) {
      navigate(nextPath, { replace: true })
    }
  }, [error, navigate, nextPath, status])

  const hasFailed = Boolean(error) || status === 'anonymous' || status === 'unconfigured'

  return (
    <main className="page-grid min-h-[calc(100vh-9rem)] px-5 py-18 sm:px-8">
      <section className="mx-auto max-w-lg rounded-[2rem] border border-ink/10 bg-white p-8 text-center shadow-2xl shadow-ink/10 dark:border-white/10 dark:bg-slate-900">
        {hasFailed ? (
          <>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
              <CircleAlert className="size-6" aria-hidden />
            </span>
            <h1 className="mt-5 text-2xl font-black dark:text-white">
              Sign-in could not be completed
            </h1>
            <p className="mt-3 leading-7 text-ink/60 dark:text-slate-400">
              {error ?? 'The link may be invalid or expired. Please start the sign-in flow again.'}
            </p>
            <Link
              to="/login"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-leaf px-5 py-2.5 font-extrabold text-white hover:bg-leaf-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
            >
              Return to sign in
            </Link>
          </>
        ) : (
          <>
            <LoaderCircle className="mx-auto size-9 animate-spin text-leaf" aria-hidden />
            <h1 className="mt-5 text-2xl font-black dark:text-white">
              Securing your session…
            </h1>
            <p className="mt-3 text-ink/58 dark:text-slate-400">
              You’ll be redirected to your workspace in a moment.
            </p>
          </>
        )}
      </section>
    </main>
  )
}
