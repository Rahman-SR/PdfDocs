import { Eye, EyeOff, FileText, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { buildAuthRedirect, getSafeRedirect } from '../lib/auth-redirect'
import { supabase } from '../lib/supabase'

type AuthMode = 'signin' | 'signup'
interface LocationState { from?: { pathname?: string }; message?: string }

export function LoginPage() {
  const { status } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const locationState = location.state as LocationState | null
  const returnTo = useMemo(() => getSafeRedirect(locationState?.from?.pathname), [locationState?.from?.pathname])
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(locationState?.message ?? null)

  useEffect(() => { if (status === 'authenticated') navigate(returnTo, { replace: true }) }, [navigate, returnTo, status])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(null); setNotice(null)
    if (!supabase) { setError('Supabase is not configured yet. Add the required environment variables.'); return }
    setIsSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        navigate(returnTo, { replace: true }); return
      }
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: buildAuthRedirect('/auth/callback', returnTo) } })
      if (signUpError) throw signUpError
      if (data.session) navigate(returnTo, { replace: true })
      else setNotice('Check your email to confirm your account, then return here to sign in.')
    } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : 'Authentication failed. Please try again.') }
    finally { setIsSubmitting(false) }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    if (!supabase) { setError('Supabase is not configured yet. Add the required environment variables.'); return }
    setIsSubmitting(true)
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: buildAuthRedirect('/auth/callback', returnTo) } })
    if (oauthError) { setError(oauthError.message); setIsSubmitting(false) }
  }

  const changeMode = (nextMode: AuthMode) => { setMode(nextMode); setError(null); setNotice(null) }

  return (
    <main className="grid min-h-screen bg-canvas lg:grid-cols-[1.18fr_0.82fr]">
      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mx-auto flex w-fit flex-col items-center text-center"><span className="grid size-14 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/15"><FileText className="size-7" /></span><span className="mt-4 font-display text-2xl font-semibold">PDF Toolkit</span><span className="mt-1 text-sm text-muted">Professional document management</span></Link>
          <div className="mt-9 rounded-xl border border-line bg-white p-6 soft-shadow sm:p-8">
            <div className="flex items-center justify-between gap-4"><div><h1 className="font-display text-3xl font-medium">{mode === 'signin' ? 'Welcome back' : 'Create account'}</h1><p className="mt-2 text-sm text-muted">{mode === 'signin' ? 'Enter your credentials to access your files.' : 'Create your secure PDF workspace.'}</p></div><div className="flex rounded-lg bg-[#f0f1f2] p-1"><button onClick={() => changeMode('signin')} type="button" className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium ${mode === 'signin' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}>Sign in</button><button onClick={() => changeMode('signup')} type="button" className={`rounded-md px-2.5 py-1.5 text-[10px] font-medium ${mode === 'signup' ? 'bg-white text-primary shadow-sm' : 'text-muted'}`}>Sign up</button></div></div>
            {status === 'unconfigured' && <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-800">Supabase Auth is ready but not connected. Add the project URL and publishable key to <code>.env.local</code>.</p>}
            <div aria-live="polite" className="mt-5 space-y-3">{error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>}{notice && <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{notice}</p>}</div>
            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <AuthField label="Email address" icon={Mail}><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required placeholder="name@company.com" className="auth-input" /></AuthField>
              <AuthField label="Password" icon={LockKeyhole} action={mode === 'signin' ? <Link to="/forgot-password" className="text-xs font-medium text-primary">Forgot password?</Link> : undefined}><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={8} required placeholder="At least 8 characters" className="auth-input pr-12" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute bottom-1 right-1 grid size-10 place-items-center rounded-lg text-muted hover:bg-[#f3f4f5]" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></AuthField>
              <button type="submit" disabled={isSubmitting || status === 'unconfigured'} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-base font-medium text-white shadow-md shadow-primary/15 hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting && <LoaderCircle className="size-4 animate-spin" />}{mode === 'signin' ? 'Sign In' : 'Create Account'}</button>
            </form>
            <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
            <button onClick={() => void handleGoogleSignIn()} disabled={isSubmitting || status === 'unconfigured'} type="button" className="flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-line bg-white text-sm font-medium hover:bg-[#f8f9fa] disabled:opacity-50"><span className="grid size-5 place-items-center rounded-full bg-[conic-gradient(from_-45deg,#4285f4_0_25%,#34a853_0_50%,#fbbc05_0_75%,#ea4335_0)] text-[9px] font-semibold text-white">G</span>Continue with Google</button>
          </div>
          <div className="mt-7 flex justify-center gap-6 text-xs text-muted"><span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4" />Privacy-first</span><span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-4" />Secure sessions</span></div>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden border-l border-line bg-[#f1f3f5] p-14 lg:flex lg:flex-col lg:justify-center">
        <div className="absolute -right-40 top-20 size-96 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-lg"><div className="rotate-2 rounded-2xl border border-line bg-white p-6 elevated-shadow"><div className="mb-8 flex gap-2"><span className="size-3 rounded-full bg-red-200" /><span className="size-3 rounded-full bg-amber-200" /><span className="size-3 rounded-full bg-emerald-200" /></div><div className="h-4 w-2/3 rounded bg-[#dfe3e7]" /><div className="mt-4 h-3 rounded bg-[#e8eaed]" /><div className="mt-3 h-3 w-4/5 rounded bg-[#e8eaed]" /><div className="mt-8 flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-blue-50 text-primary"><FileText className="size-6" /></span><div className="flex-1"><div className="h-3 w-2/3 rounded bg-[#dfe3e7]" /><div className="mt-2 h-2 w-1/2 rounded bg-[#e8eaed]" /></div></div></div><h2 className="mt-14 font-display text-3xl font-medium">Powerful Document Workflows</h2><p className="mt-4 text-base leading-7 text-muted">Automate PDF merging, splitting, and compression with a single focused dashboard.</p><div className="mt-8 grid grid-cols-2 gap-4"><div className="rounded-xl border border-line bg-white p-5"><p className="font-display text-2xl font-semibold text-primary">Private</p><p className="mt-1 text-xs text-muted">Browser-first processing</p></div><div className="rounded-xl border border-line bg-white p-5"><p className="font-display text-2xl font-semibold text-primary">Fast</p><p className="mt-1 text-xs text-muted">Focused workflows</p></div></div></div>
      </aside>
    </main>
  )
}

function AuthField({ label, icon: Icon, action, children }: { label: string; icon: typeof Mail; action?: ReactNode; children: ReactNode }) {
  return <label className="relative block"><span className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.08em]"><span>{label}</span>{action}</span><span className="relative block"><Icon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted" />{children}</span></label>
}
