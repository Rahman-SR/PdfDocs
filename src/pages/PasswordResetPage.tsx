import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { buildAuthRedirect } from '../lib/auth-redirect'
import { supabase } from '../lib/supabase'

export function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    if (!supabase) {
      setError('Supabase is not configured yet.')
      return
    }

    setIsSubmitting(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: buildAuthRedirect('/update-password') },
    )
    setIsSubmitting(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setIsSent(true)
  }

  return (
    <main className="page-grid min-h-[calc(100vh-9rem)] px-5 py-12 sm:px-8 sm:py-18">
      <section className="mx-auto max-w-lg rounded-[2rem] border border-ink/10 bg-white p-6 shadow-2xl shadow-ink/10 sm:p-10 dark:border-white/10 dark:bg-slate-900">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-ink/55 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to sign in
        </Link>

        <span className="mt-8 grid size-12 place-items-center rounded-2xl bg-emerald-100 text-leaf dark:bg-emerald-950 dark:text-emerald-300">
          <Mail className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-3xl font-black tracking-tight dark:text-white">
          Reset your password
        </h1>
        <p className="mt-3 leading-7 text-ink/58 dark:text-slate-400">
          Enter the email associated with your account. We’ll send you a secure
          link to choose a new password.
        </p>

        {isSent ? (
          <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-200">
            <p className="font-extrabold">Check your inbox</p>
            <p className="mt-1 text-sm leading-6">
              If an account exists for <strong>{email}</strong>, a recovery link is
              on its way.
            </p>
          </div>
        ) : (
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
              <span className="mb-1.5 block text-sm font-bold">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                autoFocus
                placeholder="you@example.com"
                className="min-h-12 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-ink outline-none transition placeholder:text-ink/30 focus:border-leaf focus:ring-3 focus:ring-leaf/12 dark:border-white/15 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting || !supabase}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-leaf px-5 py-3 font-extrabold text-white transition hover:bg-leaf-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
              Send recovery link
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
