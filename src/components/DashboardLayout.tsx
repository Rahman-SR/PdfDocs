import {
  ArrowLeft,
  CircleHelp,
  CloudUpload,
  LayoutGrid,
  LogOut,
  MoreVertical,
  Plus,
  Settings,
  Share2,
  UserCircle,
  Wrench,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { supabase } from '../lib/supabase'
import { Brand } from './Brand'
import { WorkspaceFooter } from './WorkspaceFooter'

const navigation = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutGrid },
  { label: 'Tools', to: '/tools', icon: Wrench },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Profile', to: '/profile', icon: UserCircle },
]

const navClass = ({ isActive }: { isActive: boolean }) =>
  `relative flex min-h-11 items-center gap-3 rounded-r-xl px-4 text-sm font-medium transition ${
    isActive
      ? 'bg-[#e7e8e9] text-primary before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary'
      : 'text-[#333b49] hover:bg-[#f0f1f2]'
  }`

export function DashboardLayout() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = user?.email ?? 'account@example.com'
  const initials = email.slice(0, 2).toUpperCase()
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerNotice, setHeaderNotice] = useState<string | null>(null)

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    navigate('/', { replace: true })
  }

  const handleShare = async () => {
    setMenuOpen(false)

    try {
      if (!navigator.clipboard) {
        setHeaderNotice('Copy the address-bar link to share this page.')
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      setHeaderNotice('Page link copied to your clipboard.')
    } catch {
      setHeaderNotice('Copy the address-bar link to share this page.')
    }
  }

  const title = location.pathname.includes('/settings')
    ? 'Workspace Settings'
    : location.pathname.includes('/tools/')
      ? `Workspace / ${location.pathname.split('/').pop()?.replace(/^./, (value) => value.toUpperCase())} PDF`
      : 'Workspace'

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-[#f6f7f8] lg:flex">
        <div className="px-6 py-8"><Brand plan="Pro Plan" /></div>
        <nav className="mt-4 space-y-1 pr-3" aria-label="Workspace navigation">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} className={navClass} to={to} end={to === '/dashboard'}>
              <Icon className="size-5" strokeWidth={1.8} aria-hidden />{label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <LinkButton to="/tools"><Plus className="size-4" aria-hidden />New Project</LinkButton>
          <div className="mt-5 space-y-1">
            <Link className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#333b49] hover:bg-[#e7e8e9]" to="/#faq"><CircleHelp className="size-5" aria-hidden />Help</Link>
            <button onClick={() => void handleSignOut()} className="flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#333b49] hover:bg-red-50 hover:text-red-700" type="button"><LogOut className="size-5" aria-hidden />Logout</button>
          </div>
          <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-white">{initials}</span>
            <div className="min-w-0"><p className="truncate text-xs font-medium">{email.split('@')[0]}</p><p className="truncate text-[11px] text-muted">{email}</p></div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/94 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="grid size-9 place-items-center rounded-lg text-[#333b49] hover:bg-[#f0f1f2]" aria-label="Go back"><ArrowLeft className="size-5" aria-hidden /></button>
            <span className="font-display text-sm font-medium sm:text-base">{title}</span>
          </div>
          <div className="relative flex items-center gap-1">
            <button type="button" onClick={() => void handleShare()} className="grid size-9 place-items-center rounded-lg hover:bg-[#f0f1f2]" aria-label="Share"><Share2 className="size-4.5" aria-hidden /></button>
            <Link to="/tools" className="grid size-9 place-items-center rounded-lg hover:bg-[#f0f1f2]" aria-label="Upload PDF"><CloudUpload className="size-4.5" aria-hidden /></Link>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="workspace-options" className="grid size-9 place-items-center rounded-lg hover:bg-[#f0f1f2]" aria-label="More options"><MoreVertical className="size-4.5" aria-hidden /></button>
            {menuOpen && <div id="workspace-options" className="absolute right-0 top-11 z-30 w-44 rounded-xl border border-line bg-white p-2 text-sm soft-shadow"><Link onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#f0f1f2]" to="/profile">Profile</Link><Link onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#f0f1f2]" to="/settings">Settings</Link><Link onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-[#f0f1f2]" to="/tools">All tools</Link></div>}
            {headerNotice && <p aria-live="polite" className="absolute right-0 top-12 z-20 w-64 rounded-lg border border-line bg-white px-3 py-2 text-xs text-muted soft-shadow">{headerNotice}</p>}
          </div>
        </header>

        <Outlet />
        <WorkspaceFooter />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Mobile workspace navigation">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-15 flex-col items-center justify-center gap-1 text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted'}`}>
            <Icon className="size-5" aria-hidden />{label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function LinkButton({ to, children }: { to: string; children: ReactNode }) {
  return <NavLink to={to} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-strong">{children}</NavLink>
}
