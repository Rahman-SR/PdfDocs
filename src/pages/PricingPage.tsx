import { Check, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    action: 'Use free tools',
    available: true,
    features: ['5 tasks per day', '100 MB processing per day', 'Each PDF smaller than 50 MB', '100 MB maximum merge batch'],
    name: 'Guest access',
    price: 'Free',
    subtitle: 'Start immediately without creating an account.',
    to: '/#try-free-tools',
  },
  {
    action: 'Login for higher limits',
    available: true,
    features: ['10 tasks per day', '200 MB processing per day', 'One file up to 100 MB once daily', '100 MB maximum merge batch'],
    name: 'Account access',
    price: 'Free',
    subtitle: 'A verified account unlocks higher daily limits.',
    to: '/login',
  },
]

export function PricingPage() {
  return (
    <main>
      <section className="px-5 pb-16 pt-14 text-center sm:px-8 sm:pt-18">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-primary"><UserRound className="size-3.5" aria-hidden />Free access</span>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-[-0.035em] sm:text-5xl">Use PdfDocs free, with or without login.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted">PdfDocs does not currently sell subscriptions. Signing in only raises your daily task and processing limits.</p>
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 text-left md:grid-cols-2">
          {plans.map((plan) => <PriceCard key={plan.name} {...plan} />)}
        </div>
      </section>

      <section className="bg-white px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <ShieldCheck className="size-7 text-emerald-700" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">No checkout</h2>
            <p className="mt-2 text-sm leading-6 text-muted">No card details or subscription payments are collected by PdfDocs.</p>
          </article>
          <article className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <UserRound className="size-7 text-primary" aria-hidden />
            <h2 className="mt-4 font-display text-xl font-bold">Login is optional</h2>
            <p className="mt-2 text-sm leading-6 text-muted">Core tools work without login. An account provides higher daily limits and one larger-file allowance.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

function PriceCard({ action, available, features, name, price, subtitle, to }: (typeof plans)[number]) {
  return (
    <article className={`relative flex min-h-96 flex-col rounded-2xl border bg-white p-7 soft-shadow ${available ? 'border-primary ring-1 ring-primary/10' : 'border-line'}`}>
      <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${available ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'}`}>{available ? 'Available' : 'Preview only'}</span>
      <h2 className="mt-5 font-display text-xl font-bold">{name}</h2>
      <p className="mt-2 min-h-10 text-xs leading-5 text-muted">{subtitle}</p>
      <p className="mt-7 font-display text-4xl font-bold tracking-[-0.035em]">{price}</p>
      <ul className="mt-7 flex-1 space-y-3 text-xs text-muted">{features.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-primary" aria-hidden />{item}</li>)}</ul>
      {available
        ? <Link to={to} className="mt-7 flex min-h-11 items-center justify-center rounded-xl bg-[#23272f] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black">{action}</Link>
        : <button type="button" disabled className="mt-7 min-h-11 cursor-not-allowed rounded-xl border border-line bg-slate-100 text-sm font-semibold text-muted">{action}</button>}
    </article>
  )
}
