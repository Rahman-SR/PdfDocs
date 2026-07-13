import {
  ArrowRight,
  Combine,
  FileCheck2,
  FileText,
  Languages,
  LockKeyhole,
  Minimize2,
  PenLine,
  Scissors,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'

export function DashboardPage() {
  const { user } = useAuth()
  const name = (user?.user_metadata.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'there'

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10 lg:py-14">
      <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Welcome back, {name}.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">Your workspace is ready. Start a new document workflow or continue where you left off.</p>

          <section className="mt-12">
            <div className="flex items-center justify-between"><h2 className="font-display text-2xl font-medium">Recently used tools</h2><Link className="text-xs font-medium text-primary" to="/tools">View all tools</Link></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <ToolCard to="/tools/compress" icon={Minimize2} tone="blue" title="Compress PDF" text="Reduce file size without losing quality." />
              <ToolCard to="/tools" icon={PenLine} tone="green" title="Edit Text" text="Modify content directly in your browser." />
              <ToolCard to="/tools" icon={LockKeyhole} tone="amber" title="Protect" text="Add password and encryption layers." />
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-2xl font-medium">Favorite tools</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Merge', icon: Combine, to: '/tools/merge' },
                { label: 'Split', icon: Scissors, to: '/tools/split' },
                { label: 'Translate', icon: Languages, to: '/tools' },
                { label: 'Extract', icon: FileCheck2, to: '/tools' },
              ].map(({ label, icon: Icon, to }) => (
                <Link key={label} to={to} className="flex min-h-14 items-center gap-3 rounded-xl border border-line bg-white px-4 text-sm font-medium soft-shadow hover:border-primary/35"><Icon className="size-5 text-primary" aria-hidden />{label}</Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl bg-primary p-6 text-white elevated-shadow">
            <span className="rounded-md bg-white/14 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">Pro plan</span>
            <h2 className="mt-5 font-display text-xl font-medium">Unlimited Power</h2>
            <div className="mt-7 flex justify-between text-xs"><span>Monthly usage</span><span>42%</span></div>
            <div className="mt-2 h-1.5 rounded-full bg-white/20"><div className="h-full w-[42%] rounded-full bg-white" /></div>
            <Link to="/pricing" className="mt-6 flex min-h-9 items-center justify-center rounded-lg bg-white text-xs font-medium text-primary">Manage Subscription</Link>
          </div>
          <div className="rounded-xl border border-line bg-white p-5 soft-shadow">
            <h2 className="font-display text-lg font-medium">Usage statistics</h2>
            <div className="mx-auto mt-6 grid size-36 place-items-center rounded-full bg-[conic-gradient(#0058be_0_42%,#e7e8e9_42%_100%)]"><div className="grid size-27 place-items-center rounded-full bg-white text-center"><div><p className="font-display text-2xl font-semibold">0 MB</p><p className="text-xs text-muted">Processed</p></div></div></div>
            <div className="mt-6 grid grid-cols-2 text-center"><div><p className="font-display text-xl font-medium">0</p><p className="text-xs text-muted">Files</p></div><div><p className="font-display text-xl font-medium">—</p><p className="text-xs text-muted">Avg Time</p></div></div>
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

function ToolCard({ to, icon: Icon, tone, title, text }: { to: string; icon: LucideIcon; tone: 'blue' | 'green' | 'amber'; title: string; text: string }) {
  const styles = { blue: 'bg-blue-50 text-primary', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700' }
  return <Link to={to} className="group rounded-xl border border-line bg-white p-6 soft-shadow transition hover:-translate-y-0.5 hover:border-primary/30"><span className={`grid size-11 place-items-center rounded-xl ${styles[tone]}`}><Icon className="size-5" /></span><h3 className="mt-6 font-display text-lg font-medium">{title}</h3><p className="mt-2 text-sm leading-6 text-muted">{text}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">Open tool <ArrowRight className="size-3.5" /></span></Link>
}
