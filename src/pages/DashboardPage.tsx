import {
  ArrowRight,
  FileCheck2,
  FileText,
  Languages,
  LockKeyhole,
  PenLine,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { PDF_TOOLS } from '../config/pdf-tools'
import { useAuth } from '../features/auth/auth-context'

export function DashboardPage() {
  // Account context and navigation are the only state needed by this overview page.
  const { user } = useAuth()
  const navigate = useNavigate()
  const name = (user?.user_metadata.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'there'

  // Favorite entries reuse implemented tool metadata and add roadmap shortcuts locally.
  const favoriteTools = [
    { label: PDF_TOOLS.merge.workspaceTitle, icon: PDF_TOOLS.merge.icon, to: PDF_TOOLS.merge.workspacePath, iconClass: PDF_TOOLS.merge.iconClass, surfaceClass: PDF_TOOLS.merge.cardSurfaceClass },
    { label: PDF_TOOLS.split.workspaceTitle, icon: PDF_TOOLS.split.icon, to: PDF_TOOLS.split.workspacePath, iconClass: PDF_TOOLS.split.iconClass, surfaceClass: PDF_TOOLS.split.cardSurfaceClass },
    { label: 'Translate', icon: Languages, to: '/tools', iconClass: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200/70', surfaceClass: 'bg-gradient-to-br from-violet-100/90 via-violet-50/55 to-white hover:border-violet-300 hover:shadow-violet-200/60' },
    { label: 'Extract', icon: FileCheck2, to: '/tools', iconClass: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-200/70', surfaceClass: 'bg-gradient-to-br from-teal-100/90 via-teal-50/55 to-white hover:border-teal-300 hover:shadow-teal-200/60' },
  ]

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10 lg:py-14">
      <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Welcome back, {name}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">Your workspace is ready. Start a new document workflow or continue where you left off.</p>

          {/* Quick tools provide access without pretending to track recent usage. */}
          <section className="mt-12">
            <div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-medium">Quick tools</h2><button type="button" onClick={() => navigate('/tools')} className="group inline-flex min-h-10 items-center gap-2 rounded-lg border border-primary/20 bg-white px-4 text-xs font-semibold text-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-[#eef5ff] hover:shadow-md active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">View all tools<ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden /></button></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ToolCard to={PDF_TOOLS.compress.workspacePath} icon={PDF_TOOLS.compress.icon} iconClass={PDF_TOOLS.compress.iconClass} surfaceClass={PDF_TOOLS.compress.cardSurfaceClass} accentClass={PDF_TOOLS.compress.cardAccentClass} title={PDF_TOOLS.compress.title} text={PDF_TOOLS.compress.description} />
              <ToolCard to="/tools" icon={PenLine} iconClass="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200/70" surfaceClass="bg-gradient-to-br from-emerald-100/90 via-emerald-50/55 to-white hover:border-emerald-300 hover:shadow-emerald-200/60" accentClass="text-emerald-700" title="Edit Text" text="Modify content directly in your browser." />
              <ToolCard to="/tools" icon={LockKeyhole} iconClass="bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-200/70" surfaceClass="bg-gradient-to-br from-amber-100/90 via-amber-50/55 to-white hover:border-amber-300 hover:shadow-amber-200/60" accentClass="text-amber-700" title="Protect" text="Add password and encryption layers." />
            </div>
          </section>

          {/* More workflows combine implemented tools with planned directory entries. */}
          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium">More workflows</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {favoriteTools.map(({ label, icon: Icon, to, iconClass, surfaceClass }) => (
                <Link key={label} to={to} className={`group flex min-h-16 items-center gap-3 rounded-xl border border-line px-4 text-sm font-medium soft-shadow transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98] ${surfaceClass}`}>
                  <span className={`grid size-9 place-items-center rounded-lg transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}><Icon className="size-4" aria-hidden /></span>
                  <span>{label}</span>
                  <ArrowRight className="ml-auto size-3.5 opacity-45 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Privacy and activity information avoids unverified plan or usage figures. */}
        <aside className="space-y-5">
          <div className="rounded-xl bg-primary p-6 text-white elevated-shadow">
            <span className="grid size-10 place-items-center rounded-xl bg-white/14"><ShieldCheck className="size-5" aria-hidden /></span>
            <h2 className="mt-5 font-display text-xl font-medium">Private by default</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">Merge, Split, and Compress run on this device. Your document contents are not uploaded.</p>
            <Link to="/tools" className="mt-6 flex min-h-9 items-center justify-center rounded-lg bg-white text-xs font-medium text-primary">Browse tools</Link>
          </div>
          <div className="rounded-xl border border-line bg-white p-5 soft-shadow">
            <h2 className="font-display text-lg font-medium">Activity privacy</h2>
            <p className="mt-3 text-sm leading-6 text-muted">File names and processing totals are not stored unless a future activity feature is explicitly enabled.</p>
          </div>
          <div className="overflow-hidden rounded-xl border border-line bg-white soft-shadow">
            <div className="border-b border-line px-5 py-4 text-xs font-semibold uppercase tracking-wider">Recent activity</div>
            <div className="px-5 py-7 text-center"><FileText className="mx-auto size-6 text-[#a0a7b1]" /><p className="mt-3 text-sm font-medium">No activity yet</p><p className="mt-1 text-xs text-muted">Processed files will appear here.</p></div>
          </div>
        </aside>
      </div>
    </main>
  )
}

// Reusable dashboard card for quick-access tools.
function ToolCard({ to, icon: Icon, iconClass, surfaceClass, accentClass, title, text }: { to: string; icon: LucideIcon; iconClass: string; surfaceClass: string; accentClass: string; title: string; text: string }) {
  return <Link to={to} className={`group rounded-xl border border-line p-6 soft-shadow transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl active:translate-y-0 active:scale-[0.99] ${surfaceClass}`}><span className={`grid size-11 place-items-center rounded-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}><Icon className="size-5" /></span><h3 className="mt-6 font-display text-lg font-medium transition-transform duration-300 group-hover:translate-x-0.5">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p><span className={`mt-5 inline-flex translate-y-1 items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${accentClass}`}>Open tool <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" /></span></Link>
}
