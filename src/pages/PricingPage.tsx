import { Check, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// Plan copy is isolated from billing calculations and card markup.
const plans = [
  { name: 'Free', subtitle: 'Perfect for quick, one-off tasks.', price: '₹0', action: 'Get Started', features: ['Core tools (Merge, Split & Compress)', '5 tasks per day', '50 MB max per file', 'Web-only access'] },
  { name: 'Pro', subtitle: 'For power users and professionals.', price: '₹999', action: 'Get Started', popular: true, features: ['Unlimited tools & tasks', 'Batch processing', 'Up to 2GB file size', 'OCR Text Recognition'] },
  { name: 'Business', subtitle: 'Enterprise-grade scale and control.', price: 'Custom', action: 'Contact Sales', features: ['Full API access', 'Team seat management', 'Custom security policies', 'Dedicated support'] },
]

export function PricingPage() {
  // Billing frequency controls the prices shown by every plan card.
  const [yearlyBilling, setYearlyBilling] = useState(false)

  return (
    <main>
      <section className="px-5 pb-16 pt-14 text-center sm:px-8 sm:pt-18">
        <h1 className="font-display text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Simple, transparent pricing.</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted">Choose the plan that’s right for you. Whether you process a few files or manage thousands, we have you covered.</p>
        <div className="mt-7 inline-flex items-center gap-3 text-xs"><span className={yearlyBilling ? 'text-muted' : 'font-semibold text-primary'}>Monthly</span><button type="button" role="switch" aria-label="Yearly billing" aria-checked={yearlyBilling} onClick={() => setYearlyBilling((value) => !value)} className="relative h-7 w-12 rounded-full bg-primary transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${yearlyBilling ? 'left-6' : 'left-1'}`} /></button><span className={yearlyBilling ? 'font-semibold text-primary' : 'text-muted'}>Yearly <span className="text-emerald-700">Save 20%</span></span></div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-5 text-left md:grid-cols-3">
          {plans.map((plan) => <PriceCard key={plan.name} {...plan} yearlyBilling={yearlyBilling} />)}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><h2 className="text-center font-display text-3xl font-medium">Compare all features</h2><div className="mt-10 overflow-x-auto rounded-xl border border-line bg-white soft-shadow"><table className="w-full min-w-[700px] text-left text-xs"><thead className="bg-[#f3f4f5] text-[10px] uppercase tracking-wider text-muted"><tr><th className="p-4 font-medium">Features</th><th className="p-4 text-center font-medium">Free</th><th className="p-4 text-center font-medium">Pro</th><th className="p-4 text-center font-medium">Business</th></tr></thead><tbody>{[['Daily Task Limit','5 tasks','Unlimited','Unlimited'],['Max File Size','50 MB','2 GB','No limit'],['Cloud Storage Sync','—','✓','✓'],['API Access','—','—','✓'],['OCR','—','✓','✓'],['Encryption & Protection','✓','✓','✓']].map((row) => <tr key={row[0]} className="border-t border-line"><td className="p-4">{row[0]}</td>{row.slice(1).map((value, index) => <td key={index} className={`p-4 text-center ${value === '✓' || value === 'Unlimited' || value === 'No limit' ? 'text-primary' : 'text-muted'}`}>{value}</td>)}</tr>)}</tbody></table></div></div></section>

      <section className="bg-white px-5 py-18 sm:px-8"><div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[0.85fr_1.15fr]"><div><Users className="size-8 text-primary" /><h2 className="mt-5 font-display text-3xl font-medium">Frequently Asked Questions</h2><p className="mt-3 text-sm leading-6 text-muted">Have more questions? Reach out to our team at support@pdftoolkit.com.</p><div className="mt-7 h-44 rounded-xl bg-[linear-gradient(135deg,#e2e8ef,#c4d0dc)]" /></div><div className="space-y-3">{[['Can I cancel my subscription?','Yes. You can cancel a paid plan at any time from workspace settings.'],['What file formats are supported?','PDF, DOCX, XLSX, PPTX, JPG, and PNG are planned across conversion workflows.'],['Is my data secure?','Common workflows are designed for local processing.'],['Do you offer educational discounts?','Education pricing is on the product roadmap.']].map(([q,a]) => <div key={q} className="rounded-xl border border-line bg-canvas p-5"><h3 className="font-display text-sm font-medium">{q}</h3><p className="mt-2 text-xs leading-5 text-muted">{a}</p></div>)}</div></div></section>

      <section className="px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl rounded-2xl bg-[#2774e8] px-6 py-12 text-center text-white"><h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready to optimize your workflow?</h2><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">Use the core PDF tools immediately or create an account for workspace features.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-primary">Create Account</Link><Link to="/#try-free-tools" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/35 px-5 text-sm font-medium">Use Free Tools</Link></div></div></section>
    </main>
  )
}

// Shared plan card keeps monthly and yearly pricing behavior consistent.
function PriceCard({ name, subtitle, price, action, features, popular = false, yearlyBilling }: { name: string; subtitle: string; price: string; action: string; features: string[]; popular?: boolean; yearlyBilling: boolean }) {
  const displayPrice = yearlyBilling && price === '₹999' ? '₹799.20' : price
  const billingNote = price === '₹999' ? (yearlyBilling ? 'Billed ₹9,590.40 yearly.' : 'Billed ₹999 monthly.') : null

  return <article className={`relative flex min-h-96 flex-col rounded-xl border bg-white p-7 soft-shadow ${popular ? 'border-primary ring-1 ring-primary/10' : 'border-line'}`}>{popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">Most Popular</span>}<h2 className="font-display text-lg font-medium">{name}</h2><p className="mt-2 text-xs text-muted">{subtitle}</p><p className="mt-7 font-display text-4xl font-semibold tracking-[-0.035em]">{displayPrice}{price.startsWith('₹') && <span className="ml-1 text-xs font-normal text-muted">/mo</span>}</p>{billingNote && <p className="mt-1 text-[11px] text-muted">{billingNote}</p>}<ul className="mt-7 flex-1 space-y-3 text-xs text-muted">{features.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-primary" />{item}</li>)}</ul><Link to="/login" className={`mt-7 flex min-h-10 items-center justify-center rounded-lg border text-xs font-medium ${popular ? 'border-primary bg-primary text-white' : name === 'Business' ? 'border-[#292d2e] bg-[#292d2e] text-white' : 'border-[#b8bec8]'}`}>{action}</Link></article>
}
