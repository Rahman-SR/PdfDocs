import {
  ArrowRight,
  BadgeCheck,
  Check,
  Combine,
  FileCheck2,
  FileImage,
  Files,
  FileText,
  LockKeyhole,
  Minimize2,
  PenLine,
  ScanText,
  Scissors,
  Sparkles,
  Stamp,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const smallTools = [
  { title: 'Edit PDF', text: 'Modify text and images directly.', icon: PenLine },
  { title: 'eSign', text: 'Legally binding signatures.', icon: FileCheck2 },
  { title: 'Protect', text: 'AES-256 encryption and permissions.', icon: LockKeyhole },
  { title: 'OCR', text: 'Optical character recognition.', icon: ScanText },
  { title: 'Delete Pages', text: 'Quick page removal.', icon: Files },
  { title: 'Watermark', text: 'Custom brand overlays.', icon: Stamp },
  { title: 'Flatten', text: 'Remove interactive layers.', icon: FileText },
  { title: 'Rearrange', text: 'Drag-and-drop ordering.', icon: Combine },
]

const faqs = [
  ['Is my data secure?', 'Absolutely. Common tools run locally in your browser, while authenticated routes use verified Supabase sessions.'],
  ['Can I cancel my subscription?', 'Yes. You can change or cancel a paid plan at any time from workspace settings.'],
  ['Do you offer educational discounts?', 'Student and educator plans are part of the product roadmap.'],
]

export function LandingPage() {
  return (
    <main>
      <section className="border-b border-line bg-[linear-gradient(180deg,#f7f9ff_0%,#f8f9fa_78%)] px-5 pb-20 pt-14 sm:px-8 sm:pt-18">
        <div className="mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd8ee] bg-white px-3 py-1.5 text-[11px] font-medium text-primary soft-shadow">
            <Sparkles className="size-3.5" aria-hidden /> Now with AI-powered summarization
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Master your PDFs with precision.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            The professional document workflow engine designed for speed, security,
            and absolute clarity. Elevate your files beyond simple reading.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-md shadow-primary/15 hover:bg-primary-strong">
              Start Processing Free <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a href="#demo" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-6 text-sm font-medium hover:border-[#b8bdc8]">Watch Demo</a>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section id="features" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">Precision Tools for Every Task</h2>
          <p className="mt-2 text-sm text-muted">Engineered for the modern workflow where speed meets accuracy.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <FeatureCard className="lg:col-span-8" icon={Combine} tone="blue" title="Seamless Merge" text="Combine hundreds of documents into a single, cohesive PDF with preserved bookmarks, transitions, and metadata." />
            <FeatureCard className="lg:col-span-4" icon={Scissors} tone="amber" title="Precision Split" text="Explode large files into individual pages or specific ranges with surgical accuracy." />
            <FeatureCard className="lg:col-span-4" icon={Minimize2} tone="green" title="Smart Compress" text="Reduce file size while maintaining visual quality." />
            <article className="relative overflow-hidden rounded-xl bg-[#292d2e] p-6 text-white lg:col-span-8">
              <span className="grid size-9 place-items-center rounded-lg bg-primary text-white"><FileImage className="size-4" aria-hidden /></span>
              <h3 className="mt-6 font-display text-lg font-medium">Universal Conversion</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/65">Convert PDF to Office, CAD, or high-res images. One-click bidirectional processing that respects original formatting.</p>
              <div className="mt-6 flex flex-wrap gap-2">{['DOCX', 'XLSX', 'PPTX', 'JPG'].map((item) => <span key={item} className="rounded-md border border-white/14 bg-white/8 px-3 py-2 text-[10px]">{item}</span>)}</div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#eef0f2] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div><h2 className="font-display text-2xl font-medium tracking-[-0.02em]">The Complete Toolkit</h2><p className="mt-2 text-sm text-muted">A library of specialized tools to handle any document scenario.</p></div>
            <Link className="hidden items-center gap-1 text-xs font-medium text-primary sm:inline-flex" to="/tools">View all tools <ArrowRight className="size-3.5" /></Link>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {smallTools.map(({ title, text, icon: Icon }) => (
              <article key={title} className="rounded-xl border border-line bg-white p-5 soft-shadow transition hover:-translate-y-0.5">
                <Icon className="size-4 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-sm font-medium">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Simple, Transparent Pricing.</h2>
          <p className="mt-2 text-sm text-muted">Choose the plan that fits your volume.</p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            <PlanCard title="Starter" price="$0" features={['5 tasks per day', '100 MB max file size', 'Web-only access']} />
            <PlanCard featured title="Professional" price="$12" features={['Unlimited tasks', '2 GB max file size', 'Desktop & mobile apps', 'AI summarization']} />
            <PlanCard title="Enterprise" price="Custom" features={['SSO & team management', 'Custom API integration', '99.9% SLA guarantee']} />
          </div>
          <Link to="/pricing" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">Compare all plan features <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-[#f1f2f3] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-medium">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {faqs.map(([question, answer], index) => (
              <details key={question} open={index === 0} className="group rounded-xl border border-line bg-white p-5 soft-shadow">
                <summary className="cursor-pointer list-none font-display text-sm font-medium">{question}</summary>
                <p className="mt-3 text-sm leading-6 text-muted">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="enterprise" className="bg-white px-5 py-18 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-primary px-6 py-12 text-center text-white elevated-shadow sm:px-12">
          <BadgeCheck className="mx-auto size-8 text-[#d8e2ff]" aria-hidden />
          <h2 className="mt-5 font-display text-3xl font-medium tracking-[-0.025em] sm:text-4xl">Ready to master your workflow?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/72">Join professionals who trust PDF Toolkit for daily document needs.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-primary">Create Free Account</Link>
            <a href="mailto:sales@example.com" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-medium">Talk to Enterprise</a>
          </div>
        </div>
      </section>
    </main>
  )
}

function DashboardPreview() {
  return (
    <div id="demo" className="relative mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-[#cfd5df] bg-white p-2 text-left elevated-shadow">
      <div className="grid min-h-80 grid-cols-[110px_1fr] overflow-hidden rounded-xl bg-[#f5f7f9] sm:grid-cols-[170px_1fr]">
        <aside className="border-r border-line bg-white p-3 sm:p-4">
          <div className="mb-5 flex items-center gap-2"><span className="grid size-6 place-items-center rounded-md bg-primary text-white"><FileText className="size-3.5" /></span><span className="hidden text-xs font-semibold sm:inline">PDF Toolkit</span></div>
          {['Home', 'Files', 'Recent', 'Tools', 'Trash'].map((item, index) => <div key={item} className={`mb-1 rounded-lg px-2 py-2 text-[10px] ${index === 1 ? 'bg-[#e7effe] text-primary' : 'text-muted'}`}>{item}</div>)}
        </aside>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-[10px] font-medium text-primary">Recent Documents</p><h3 className="mt-1 font-display text-lg font-medium">Your workspace</h3></div><Link className="rounded-md bg-primary px-3 py-2 text-[10px] text-white" to="/tools">Upload PDF</Link></div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{['Quarterly report', 'Project proposal', 'Invoices', 'Research notes'].map((item, index) => <div key={item} className="rounded-lg border border-line bg-white p-2 soft-shadow"><div className={`aspect-[4/3] rounded-md ${['bg-blue-50','bg-amber-50','bg-emerald-50','bg-violet-50'][index]}`} /><p className="mt-2 truncate text-[9px] font-medium">{item}.pdf</p><p className="mt-1 text-[8px] text-muted">Edited recently</p></div>)}</div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, tone, title, text, className }: { icon: typeof Combine; tone: 'blue' | 'amber' | 'green'; title: string; text: string; className?: string }) {
  const colors = { blue: 'bg-blue-50 text-primary', amber: 'bg-amber-50 text-amber-700', green: 'bg-emerald-50 text-emerald-700' }
  return <article className={`rounded-xl border border-line bg-[#f7f8f9] p-6 ${className ?? ''}`}><span className={`grid size-9 place-items-center rounded-lg ${colors[tone]}`}><Icon className="size-4" aria-hidden /></span><h3 className="mt-6 font-display text-lg font-medium">{title}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted">{text}</p></article>
}

function PlanCard({ title, price, features, featured = false }: { title: string; price: string; features: string[]; featured?: boolean }) {
  return <article className={`relative rounded-xl border bg-white p-6 soft-shadow ${featured ? 'border-primary ring-1 ring-primary/15' : 'border-line'}`}>{featured && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">Most popular</span>}<p className="text-sm font-medium">{title}</p><p className="mt-5 font-display text-3xl font-semibold">{price}<span className="text-xs font-normal text-muted">{price.startsWith('$') ? '/month' : ''}</span></p><ul className="mt-6 space-y-3 text-xs text-muted">{features.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-3.5 text-primary" />{item}</li>)}</ul><Link to="/login" className={`mt-7 flex min-h-10 items-center justify-center rounded-lg border text-xs font-medium ${featured ? 'border-primary bg-primary text-white' : 'border-line'}`}>{price === 'Custom' ? 'Contact Sales' : 'Get Started'}</Link></article>
}
