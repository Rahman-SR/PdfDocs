import { KeyRound, LoaderCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { supabase } from '../lib/supabase'

export function UpdatePasswordPage() {
  const { status } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (password !== confirmation) {
      setError('The passwords do not match.')
      return
    }

    if (!supabase) {
      setError('Supabase is not configured yet.')
      return
    }

    setIsSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setIsSubmitting(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="page-grid min-h-[calc(100vh-9rem)] px-5 py-12 sm:px-8 sm:py-18">
      <section className="mx-auto max-w-lg rounded-[2rem] border border-ink/10 bg-white p-6 shadow-2xl shadow-ink/10 sm:p-10 dark:border-white/10 dark:bg-slate-900">
        <span className="grid size-12 place-items-center rounded-2xl bg-emerald-100 text-leaf dark:bg-emerald-950 dark:text-emerald-300">
          <KeyRound className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-black tracking-tight dark:text-white">
          Choose a new password
        </h1>

        {status === 'loading' && (
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink/60 dark:text-slate-400">
            <LoaderCircle className="size-5 animate-spin text-leaf" aria-hidden />
            Verifying your recovery link…
          </p>
        )}

        {(status === 'anonymous' || status === 'unconfigured') && (
          <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            This recovery link is missing, invalid, or expired.{' '}
            <Link to="/forgot-password" className="font-extrabold underline">
              Request a new link
            </Link>
            .
          </div>
        )}

        {status === 'authenticated' && (
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                aria-live="polite"
              >
                {error}
              </p>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">New password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                autoFocus
                className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-leaf focus:ring-3 focus:ring-leaf/12 dark:border-white/15 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold">Confirm password</span>
              <input
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-leaf focus:ring-3 focus:ring-leaf/12 dark:border-white/15 dark:bg-slate-950 dark:text-white"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-leaf px-5 py-3 font-extrabold text-white transition hover:bg-leaf-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
              Save new password
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
