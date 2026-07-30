import { Check, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

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
export function PlanCard({
  actionLabel,
  badge,
  compactPrice = false,
  disabled = false,
  featured = false,
  features,
  price,
  priceSuffix = '/month',
  title,
  to = '/login',
}: {
  actionLabel: string
  badge?: string
  compactPrice?: boolean
  disabled?: boolean
  featured?: boolean
  features: string[]
  price: string
  priceSuffix?: string
  title: string
  to?: string
}) {
  return (
    <article className={`relative rounded-xl border bg-white p-6 soft-shadow ${featured ? 'border-primary ring-1 ring-primary/15' : 'border-line'}`}>
      {featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#23272f] px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">{badge ?? 'Featured'}</span>}
      <p className="font-display text-xl font-black tracking-[-0.02em]">{title}</p>
      <p className={`mt-4 font-display ${compactPrice ? 'text-base font-semibold text-muted' : 'text-3xl font-semibold'}`}>{price}{priceSuffix && <span className="text-xs font-normal text-muted">{priceSuffix}</span>}</p>
      <ul className="mt-6 space-y-3 text-xs text-muted">{features.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-primary" aria-hidden />{item}</li>)}</ul>
      {disabled
        ? <button type="button" disabled className="mt-7 flex min-h-10 w-full cursor-not-allowed items-center justify-center rounded-lg border border-line bg-slate-100 text-xs font-semibold text-muted">{actionLabel}</button>
        : <Link to={to} className="mt-7 flex min-h-11 items-center justify-center rounded-lg border border-[#23272f] bg-[#23272f] text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">{actionLabel}</Link>}
    </article>
  )
}
