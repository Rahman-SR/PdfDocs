import { ArrowUpRight, Globe2, Share2 } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { Brand } from './Brand'

export function PublicLayout() {
  const { status } = useAuth()
  const isSignedIn = status === 'authenticated'

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-line/90 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-10">
          <Brand />
          <nav className="hidden items-center gap-7 text-xs font-medium text-[#4f5661] md:flex" aria-label="Primary navigation">
            <a className="border-b-2 border-primary py-[22px] text-primary" href="/#features">Features</a>
            <Link className="transition hover:text-primary" to="/pricing">Pricing</Link>
            <a className="transition hover:text-primary" href="/#enterprise">Enterprise</a>
            <a className="transition hover:text-primary" href="/#about">About</a>
          </nav>
          <div className="flex items-center gap-2">
            {!isSignedIn && (
              <Link className="hidden rounded-lg px-3 py-2 text-xs font-medium text-[#4f5661] hover:bg-[#f3f4f5] sm:inline-flex" to="/login">
                Log in
              </Link>
            )}
            <Link
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              to={isSignedIn ? '/dashboard' : '/login'}
            >
              {isSignedIn ? 'Dashboard' : 'Get Started'}
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <Outlet />

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
