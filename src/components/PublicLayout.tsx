import { ArrowUpRight, Globe2, LayoutDashboard, Share2, Sparkles } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { Brand } from './Brand'

export function PublicLayout() {
  // Authentication state only changes the header action destination.
  const { status } = useAuth()
  const location = useLocation()
  const isSignedIn = status === 'authenticated'
  const isLandingPage = location.pathname === '/'

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Public navigation remains visible while visitors use free tools. */}
      <header className="fixed inset-x-0 top-0 z-40 px-2 pt-2 sm:px-4 sm:pt-3">
        <div className="mx-auto flex h-14 max-w-[78rem] items-center justify-between rounded-2xl border border-white/70 bg-white/62 px-3 shadow-[0_12px_40px_rgba(28,55,94,0.12),0_0_26px_rgba(59,130,246,0.08)] backdrop-blur-2xl transition-all duration-300 sm:px-5 lg:px-6">
          <div className="-ml-1.5 sm:-ml-2"><Brand premium /></div>
          <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/34 p-1 text-xs font-medium text-[#4f5661] shadow-inner shadow-white/70 md:flex" aria-label="Primary navigation">
            <a className={publicNavClass} href="/#try-free-tools">Free tools</a>
            <a className={publicNavClass} href="/#features">Features</a>
            <Link className={publicNavClass} to="/pricing">Pricing</Link>
            <a className={publicNavClass} href="/#enterprise">Enterprise</a>
            <a className={publicNavClass} href="/#about">About</a>
          </nav>
          <div className="flex items-center gap-2">
            {!isSignedIn && (
              <Link className="hidden min-h-9 items-center rounded-xl border border-white/65 bg-white/38 px-3 py-2 text-xs font-semibold text-[#4f5661] shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white/80 hover:text-primary hover:shadow-[0_0_20px_rgba(59,130,246,0.18)] sm:inline-flex" to="/login">
                Log in
              </Link>
            )}
            <Link
              className="group relative inline-flex min-h-10 items-center gap-2 overflow-hidden rounded-xl border border-white/25 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_24px_rgba(79,70,229,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(79,70,229,0.62)] active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              to={isSignedIn ? '/dashboard' : '/login'}
            >
              <span className="pointer-events-none absolute inset-y-0 -left-10 w-8 skew-x-[-18deg] bg-white/35 blur-sm transition-transform duration-700 group-hover:translate-x-40" />
              {isSignedIn ? <LayoutDashboard className="relative size-4 drop-shadow-[0_0_5px_rgba(165,243,252,0.95)] transition-transform duration-300 group-hover:scale-110" aria-hidden /> : <Sparkles className="relative size-4 text-cyan-200 drop-shadow-[0_0_5px_rgba(165,243,252,0.9)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" aria-hidden />}
              {isSignedIn ? 'Dashboard' : 'Get Started'}
              <ArrowUpRight className="relative size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Child public route content. */}
      <div className={isLandingPage ? '' : 'pt-20'}><Outlet /></div>

      {/* Shared product and legal footer. */}
      <footer id="about" className="border-t border-line bg-[#f3f4f5]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-display text-sm font-semibold">PDF Toolkit</p>
              <p className="mt-3 max-w-xs text-xs leading-5 text-muted">Modern tools for modern documents. Built with privacy and speed at its core.</p>
            </div>
            {[
              ['Product', 'Features', 'API', 'Security'],
              ['Company', 'About', 'Blog', 'Contact'],
              ['Legal', 'Privacy Policy', 'Terms of Service', 'Cookies'],
            ].map(([heading, ...items]) => (
              <div key={heading}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em]">{heading}</p>
                <div className="mt-3 flex flex-col gap-2 text-xs text-muted">
                  {items.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PDF Toolkit. Securely processing files globally.</p>
            <div className="flex items-center gap-3"><Globe2 className="size-4" aria-hidden /><Share2 className="size-4" aria-hidden /></div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Glass navigation pills share hover, glow, and keyboard focus behavior.
const publicNavClass = 'rounded-full px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/78 hover:text-primary hover:shadow-[0_0_18px_rgba(59,130,246,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70'
