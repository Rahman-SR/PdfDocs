import { Check, Combine, FileText, Minimize2, Scissors, UploadCloud, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

// Decorative chart values are visual only and do not represent account data.
const chartBars = [
  { color: 'bg-blue-400', height: 38 },
  { color: 'bg-violet-400', height: 62 },
  { color: 'bg-cyan-400', height: 50 },
  { color: 'bg-rose-400', height: 82 },
  { color: 'bg-amber-400', height: 68 },
]

// Animated hero visual explains the local workflow without loading a fake document.
export function WorkflowPreview() {
  return (
    <div id="workflow-preview" className="relative mx-auto w-full max-w-2xl text-left lg:mx-0">
      <div className="hero-pulse pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-blue-300/45 via-violet-300/40 to-rose-300/45 blur-2xl" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#0b2450] p-4 shadow-2xl shadow-blue-950/25 sm:p-6">
        <div className="absolute -right-16 -top-20 size-56 rounded-full bg-violet-500/35 blur-3xl" />
        <div className="absolute -bottom-20 -left-14 size-56 rounded-full bg-cyan-400/25 blur-3xl" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <span className="grid size-8 place-items-center rounded-lg bg-white/12"><FileText className="size-4" aria-hidden /></span>
            <div><p className="text-[10px] font-semibold">PDF Toolkit</p><p className="text-[9px] text-white/55">Private browser workflow</p></div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 text-[9px] font-semibold text-emerald-200"><span className="size-1.5 rounded-full bg-emerald-300" />Secure local</span>
        </div>

        <div className="relative mt-8 min-h-[310px] sm:min-h-[350px]">
          <ToolStatusCard className="hero-float left-0 top-7 [--hero-rotate:-2deg] sm:left-2" icon={Combine} iconClass="bg-gradient-to-br from-cyan-400 to-blue-500 text-white" title="Merge" status="Files selected" />
          <ToolStatusCard className="hero-float-delayed right-0 top-16 [--hero-rotate:2deg] sm:right-2" icon={Minimize2} iconClass="bg-gradient-to-br from-orange-400 to-rose-500 text-white" title="Compress" status="Size optimized" />

          <div className="absolute inset-x-12 top-3 mx-auto max-w-[260px] sm:inset-x-24">
            <div className="absolute inset-0 translate-x-5 translate-y-4 rotate-6 rounded-2xl bg-violet-400/60" />
            <div className="absolute inset-0 -translate-x-4 translate-y-2 -rotate-6 rounded-2xl bg-cyan-400/70" />
            <div className="relative aspect-[4/5] rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-lg bg-rose-50 text-rose-600"><FileText className="size-4" aria-hidden /></span><span className="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold text-emerald-700">READY</span></div>
              <div className="mt-6 h-2 w-2/3 rounded-full bg-slate-900/80" />
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200" />
              <div className="mt-1.5 h-1.5 w-4/5 rounded-full bg-slate-200" />
              <div className="mt-6 grid h-24 grid-cols-5 items-end gap-1.5 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 p-4">
                {chartBars.map(({ color, height }) => <span key={`${color}-${height}`} className={`rounded-t-sm ${color}`} style={{ height: `${height}%` }} />)}
              </div>
              <div className="mt-5 flex items-center justify-between text-[8px] text-slate-400"><span>your-document.pdf</span><span>Local preview</span></div>
            </div>
          </div>

          <ToolStatusCard className="hero-float bottom-2 left-3 [--hero-rotate:1deg] sm:left-10" icon={Scissors} iconClass="bg-gradient-to-br from-emerald-400 to-teal-500 text-white" title="Split" status="Pages selected" />
        </div>

        <div className="relative mt-4 rounded-xl border border-white/10 bg-white/8 p-3">
          <div className="flex items-center justify-between text-[9px] font-semibold text-white"><span className="inline-flex items-center gap-2"><UploadCloud className="size-3.5 text-cyan-300" aria-hidden />Processing on your device</span><span>Ready</span></div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400" /></div>
        </div>
      </div>
    </div>
  )
}

// Small floating labels make the three core workflows easy to scan.
function ToolStatusCard({ className, icon: Icon, iconClass, status, title }: { className: string; icon: LucideIcon; iconClass: string; status: string; title: string }) {
  return (
    <div className={`absolute z-20 rounded-xl border border-white/15 bg-white/12 p-3 text-white shadow-xl backdrop-blur-md ${className}`}>
      <span className={`grid size-7 place-items-center rounded-lg shadow-lg ${iconClass}`}><Icon className="size-3.5" aria-hidden /></span>
      <p className="mt-2 text-[10px] font-semibold">{title}</p>
      <p className="mt-0.5 text-[8px] text-white/55">{status}</p>
    </div>
  )
}

// Feature cards share tone rules while allowing different grid widths.
export function FeatureCard({ icon: Icon, tone, title, text, className }: { icon: LucideIcon; tone: 'blue' | 'emerald' | 'orange'; title: string; text: string; className?: string }) {
  const colors = {
    blue: { icon: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-200/70', surface: 'bg-gradient-to-br from-blue-100/90 via-blue-50/55 to-white hover:border-blue-300 hover:shadow-blue-200/60' },
    emerald: { icon: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200/70', surface: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50/55 to-white hover:border-emerald-300 hover:shadow-emerald-200/60' },
    orange: { icon: 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-orange-200/70', surface: 'bg-gradient-to-br from-orange-100/90 via-orange-50/55 to-white hover:border-orange-300 hover:shadow-orange-200/60' },
  }
  const color = colors[tone]
  return <article className={`group rounded-xl border border-line p-6 soft-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${color.surface} ${className ?? ''}`}><span className={`grid size-10 place-items-center rounded-xl shadow-lg transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-3 ${color.icon}`}><Icon className="size-4" aria-hidden /></span><h3 className="mt-6 font-display text-lg font-medium">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{text}</p></article>
}

// Landing-page plan cards are a preview; account creation stays optional.
export function PlanCard({ title, price, features, featured = false }: { title: string; price: string; features: string[]; featured?: boolean }) {
  return <article className={`relative rounded-xl border bg-white p-6 soft-shadow ${featured ? 'border-primary ring-1 ring-primary/15' : 'border-line'}`}>{featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">Most popular</span>}<p className="text-sm font-medium">{title}</p><p className="mt-5 font-display text-3xl font-semibold">{price}<span className="text-xs font-normal text-muted">{price.startsWith('₹') ? '/month' : ''}</span></p><ul className="mt-6 space-y-3 text-xs text-muted">{features.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-primary" aria-hidden />{item}</li>)}</ul><Link to="/login" className={`mt-7 flex min-h-10 items-center justify-center rounded-lg border text-xs font-medium ${featured ? 'border-primary bg-primary text-white' : 'border-line'}`}>{price === 'Custom' ? 'View options' : 'Get Started'}</Link></article>
}
