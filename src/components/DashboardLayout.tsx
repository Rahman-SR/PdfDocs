import {
  ArrowLeft,
  ChevronUp,
  CircleHelp,
  CloudUpload,
  LayoutGrid,
  LogOut,
  MoreVertical,
  Settings,
  Share2,
  UserCircle,
  Wrench,
} from 'lucide-react'
import { useRef, useState } from 'react'
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

// Desktop navigation styling is centralized so active states stay consistent.
const navClass = ({ isActive }: { isActive: boolean }) =>
  `group relative flex min-h-11 items-center gap-3 rounded-r-xl px-4 text-sm font-medium transition-all duration-300 ${
    isActive
      ? 'bg-gradient-to-r from-blue-100 via-cyan-50/80 to-transparent text-primary shadow-[0_0_24px_rgba(37,99,235,0.18)] before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-primary before:shadow-[0_0_12px_rgba(37,99,235,0.9)]'
      : 'text-[#333b49] hover:translate-x-1 hover:bg-gradient-to-r hover:from-blue-100/90 hover:via-cyan-50/70 hover:to-transparent hover:text-primary hover:shadow-[0_0_22px_rgba(37,99,235,0.2)]'
  }`

const sidebarIconClass = 'size-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_5px_rgba(37,99,235,0.65)]'
const sidebarHoverClass = 'group flex min-h-11 items-center gap-3 rounded-r-xl px-4 text-sm font-medium text-[#333b49] transition-all duration-300 hover:translate-x-1 hover:bg-gradient-to-r hover:from-blue-100/90 hover:via-cyan-50/70 hover:to-transparent hover:text-primary hover:shadow-[0_0_22px_rgba(37,99,235,0.2)]'

export function DashboardLayout() {
  // Account identity, route state, and temporary menu feedback.
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = user?.email ?? 'Not signed in'
  const displayName = (user?.user_metadata.full_name as string | undefined) ?? email.split('@')[0] ?? 'Account'
  const initials = displayName.slice(0, 2).toUpperCase()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [headerNotice, setHeaderNotice] = useState<{ message: string; pathname: string } | null>(null)
  const headerNoticeTimer = useRef<number | null>(null)

  // Header feedback remains tied to the route that triggered it.
  const showHeaderNotice = (message: string) => {
    if (headerNoticeTimer.current !== null) window.clearTimeout(headerNoticeTimer.current)
    setHeaderNotice({ message, pathname: location.pathname })
    headerNoticeTimer.current = window.setTimeout(() => {
      setHeaderNotice(null)
      headerNoticeTimer.current = null
    }, 3000)
  }

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
    navigate('/', { replace: true })
  }

  const handleShare = async () => {
    setMenuOpen(false)

    try {
      if (!navigator.clipboard) {
        showHeaderNotice('Copy the address-bar link to share this page.')
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      showHeaderNotice('Page link copied to your clipboard.')
    } catch {
      showHeaderNotice('Copy the address-bar link to share this page.')
    }
  }

  // Route-derived titles avoid duplicating a heading table for tool pages.
  const title = location.pathname.includes('/settings')
    ? 'Workspace Settings'
    : location.pathname.includes('/tools/')
      ? `Workspace / ${location.pathname.split('/').pop()?.replace(/^./, (value) => value.toUpperCase())} PDF`
      : 'Workspace'

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-[#f6f7f8] lg:flex">
        <div className="px-6 py-8"><Brand /></div>
        <nav className="mt-4 space-y-1 pr-3" aria-label="Workspace navigation">
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} className={navClass} to={to} end={to === '/dashboard'}>
              <Icon className={sidebarIconClass} strokeWidth={1.8} aria-hidden />{label}
            </NavLink>
          ))}
          <Link className={sidebarHoverClass} to="/#faq"><CircleHelp className={sidebarIconClass} strokeWidth={1.8} aria-hidden />Help</Link>
        </nav>
        <div className="mt-auto border-t border-line p-4">
          {profileMenuOpen && <div id="profile-menu" className="mb-2 rounded-xl border border-blue-100 bg-white p-2 shadow-[0_0_26px_rgba(37,99,235,0.14)]"><Link onClick={() => setProfileMenuOpen(false)} className="group flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm text-[#333b49] transition-all hover:bg-blue-50 hover:text-primary hover:shadow-[0_0_18px_rgba(37,99,235,0.18)]" to="/profile"><UserCircle className="size-5 transition group-hover:scale-110" aria-hidden />View profile</Link><button onClick={() => void handleSignOut()} className="group flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#333b49] transition-all hover:bg-red-50 hover:text-red-700 hover:shadow-[0_0_18px_rgba(239,68,68,0.16)]" type="button"><LogOut className="size-5 transition group-hover:scale-110" aria-hidden />Logout</button></div>}
          <button type="button" onClick={() => setProfileMenuOpen((value) => !value)} aria-label="Open profile menu" aria-expanded={profileMenuOpen} aria-controls="profile-menu" className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-2 py-3 text-left transition-all duration-300 hover:border-blue-200 hover:bg-blue-50/75 hover:shadow-[0_0_24px_rgba(37,99,235,0.22)]">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-semibold text-white">{initials}</span>
            <span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{displayName}</span><span className="block truncate text-[11px] text-muted">{email}</span></span>
            <ChevronUp className={`size-4 shrink-0 text-muted transition ${profileMenuOpen ? '' : 'rotate-180'}`} aria-hidden />
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-white/94 px-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => navigate(-1)} className="grid size-9 place-items-center rounded-lg text-[#333b49] hover:bg-[#f0f1f2]" aria-label="Go back"><ArrowLeft className="size-5" aria-hidden /></button>
            <span className="font-display text-sm font-medium sm:text-base">{title}</span>
          </div>
          <div className="relative flex items-center gap-1">
            <button type="button" onClick={() => void handleShare()} className={headerActionClass} aria-label="Share"><Share2 className="size-[18px] transition-transform duration-200 group-hover:scale-110" strokeWidth={1.9} aria-hidden /><ActionTooltip>Share</ActionTooltip></button>
            <Link to="/tools" className={headerActionClass} aria-label="Upload PDF"><CloudUpload className="size-[18px] transition-transform duration-200 group-hover:-translate-y-0.5" strokeWidth={1.9} aria-hidden /><ActionTooltip>Upload PDF</ActionTooltip></Link>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="workspace-options" className={`${headerActionClass} ${menuOpen ? 'bg-[#eaf2ff] text-primary shadow-sm' : ''}`} aria-label="More options"><MoreVertical className="size-[18px] transition-transform duration-200 group-hover:rotate-90" strokeWidth={1.9} aria-hidden /><ActionTooltip>More</ActionTooltip></button>
            {menuOpen && <div id="workspace-options" className="absolute right-0 top-14 z-30 w-44 rounded-xl border border-line bg-white p-2 text-sm soft-shadow"><Link onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 transition-colors hover:bg-[#f0f1f2]" to="/profile">Profile</Link><Link onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 transition-colors hover:bg-[#f0f1f2]" to="/settings">Settings</Link><Link onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2 transition-colors hover:bg-[#f0f1f2]" to="/tools">All tools</Link></div>}
            {headerNotice?.pathname === location.pathname && <p aria-live="polite" className="absolute right-0 top-14 z-20 w-64 rounded-xl border border-line bg-white px-3 py-2 text-xs text-muted soft-shadow">{headerNotice.message}</p>}
          </div>
        </header>

        <Outlet />
        <WorkspaceFooter />
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-line bg-white px-2 pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Mobile workspace navigation">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex min-h-15 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium transition-all duration-300 hover:bg-blue-50 hover:text-primary hover:shadow-[0_0_16px_rgba(37,99,235,0.18)] ${isActive ? 'text-primary' : 'text-muted'}`}>
            <Icon className="size-5" aria-hidden />{label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

// Shared styles and tooltip markup keep the three header actions visually aligned.
const headerActionClass = 'group relative grid size-10 place-items-center rounded-lg text-[#333b49] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#eaf2ff] hover:text-primary hover:shadow-sm active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

function ActionTooltip({ children }: { children: string }) {
  return <span className="pointer-events-none absolute right-1/2 top-12 z-40 translate-x-1/2 whitespace-nowrap rounded-md bg-[#20262f] px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0.5 group-hover:opacity-100 group-focus-visible:translate-y-0.5 group-focus-visible:opacity-100">{children}</span>
}
