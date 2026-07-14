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
  ShieldCheck,
  Sparkles,
  Stamp,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { FeatureCard, PlanCard, WorkflowPreview } from '../components/landing/LandingComponents'
import { CORE_PDF_TOOLS } from '../config/pdf-tools'

// Secondary toolkit content used by the marketing page.
const smallTools = [
  { title: 'Edit PDF', text: 'Modify text and images directly.', icon: PenLine, iconClass: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-200/70', surfaceClass: 'bg-gradient-to-br from-sky-100/90 via-sky-50/55 to-white hover:border-sky-300 hover:shadow-sky-200/60' },
  { title: 'eSign', text: 'Legally binding signatures.', icon: FileCheck2, iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200/70', surfaceClass: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50/55 to-white hover:border-emerald-300 hover:shadow-emerald-200/60' },
  { title: 'Protect', text: 'AES-256 encryption and permissions.', icon: LockKeyhole, iconClass: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-200/70', surfaceClass: 'bg-gradient-to-br from-amber-100/90 via-amber-50/55 to-white hover:border-amber-300 hover:shadow-amber-200/60' },
  { title: 'OCR', text: 'Optical character recognition.', icon: ScanText, iconClass: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200/70', surfaceClass: 'bg-gradient-to-br from-violet-100/90 via-violet-50/55 to-white hover:border-violet-300 hover:shadow-violet-200/60' },
  { title: 'Delete Pages', text: 'Quick page removal.', icon: Files, iconClass: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-200/70', surfaceClass: 'bg-gradient-to-br from-rose-100/90 via-rose-50/55 to-white hover:border-rose-300 hover:shadow-rose-200/60' },
  { title: 'Watermark', text: 'Custom brand overlays.', icon: Stamp, iconClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/70', surfaceClass: 'bg-gradient-to-br from-cyan-100/90 via-cyan-50/55 to-white hover:border-cyan-300 hover:shadow-cyan-200/60' },
  { title: 'Flatten', text: 'Remove interactive layers.', icon: FileText, iconClass: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200/70', surfaceClass: 'bg-gradient-to-br from-indigo-100/90 via-indigo-50/55 to-white hover:border-indigo-300 hover:shadow-indigo-200/60' },
  { title: 'Rearrange', text: 'Drag-and-drop ordering.', icon: Combine, iconClass: 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200/70', surfaceClass: 'bg-gradient-to-br from-orange-100/90 via-orange-50/55 to-white hover:border-orange-300 hover:shadow-orange-200/60' },
]

// Frequently asked questions remain plain data so the markup stays focused.
const faqs = [
  ['Is my data secure?', 'Absolutely. Common tools run locally in your browser, while authenticated routes use verified Supabase sessions.'],
  ['Can I cancel my subscription?', 'Yes. You can change or cancel a paid plan at any time from workspace settings.'],
  ['Do you offer educational discounts?', 'Student and educator plans are part of the product roadmap.'],
]

export function LandingPage() {
  return (
    <main>
      {/* Hero: product promise and animated local-processing visualization. */}
      <section className="relative overflow-hidden border-b border-line bg-[linear-gradient(135deg,#f7fbff_0%,#f4f0ff_48%,#fff7ef_100%)] px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute -left-24 top-16 size-72 rounded-full bg-cyan-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-4 size-80 rounded-full bg-violet-300/30 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="relative z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 text-violet-600" aria-hidden /> Free PDF tools. No account needed.
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Make every PDF task
              <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-rose-500 bg-clip-text text-transparent">feel effortless.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted sm:text-base lg:mx-0">
              Merge, split, and compress documents instantly in your browser. Your files stay on your device, and you can start without creating an account.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <a href="#try-free-tools" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-primary-strong">
                Try tools free <ArrowRight className="size-4" aria-hidden />
              </a>
              <a href="#workflow-preview" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/80 bg-white/80 px-6 text-sm font-semibold shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-primary">
                See how it works <Zap className="size-4 text-amber-500" aria-hidden />
              </a>
            </div>
            <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-medium text-muted lg:justify-start">
              <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" aria-hidden /> No sign-up</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-3.5 text-blue-600" aria-hidden /> Local processing</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5 text-amber-500" aria-hidden /> Ready in seconds</span>
            </div>
          </div>
          <WorkflowPreview />
        </div>
      </section>

      {/* Free tools: direct public entry points with no authentication wall. */}
      <section id="try-free-tools" className="scroll-mt-20 border-b border-line bg-white px-5 py-18 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Start right now</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">Useful tools, no login wall.</h2>
              <p className="mt-2 text-sm text-muted">Choose a tool, add your PDF, and process it privately on your device.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="size-3.5" aria-hidden /> Files never leave your browser
            </span>
          </div>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {CORE_PDF_TOOLS.map(({ title, description, publicPath, icon: Icon, landingGradient, iconClass, cardAccentClass, cardSurfaceClass }) => (
              <Link key={title} to={publicPath} className={`group relative overflow-hidden rounded-2xl border border-line p-6 soft-shadow transition duration-300 hover:-translate-y-1.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${cardSurfaceClass}`}>
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${landingGradient}`} />
                <div className="flex items-start justify-between gap-4">
                  <span className={`grid size-12 place-items-center rounded-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}><Icon className="size-5" aria-hidden /></span>
                  <ArrowRight className={`size-5 opacity-55 transition duration-300 group-hover:translate-x-1 group-hover:opacity-100 ${cardAccentClass}`} aria-hidden />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">{title}</h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-muted">{description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-primary">Use free <span aria-hidden>→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature overview: explains the core document-processing capabilities. */}
      <section id="features" className="scroll-mt-24 bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-2xl font-medium tracking-[-0.02em] sm:text-3xl">Precision Tools for Every Task</h2>
          <p className="mt-2 text-sm text-muted">Engineered for the modern workflow where speed meets accuracy.</p>
          <div className="mt-10 grid gap-4 lg:grid-cols-12">
            <FeatureCard className="lg:col-span-8" icon={Combine} tone="blue" title="Seamless Merge" text="Combine hundreds of documents into a single, cohesive PDF with preserved bookmarks, transitions, and metadata." />
            <FeatureCard className="lg:col-span-4" icon={Scissors} tone="emerald" title="Precision Split" text="Explode large files into individual pages or specific ranges with surgical accuracy." />
            <FeatureCard className="lg:col-span-4" icon={Minimize2} tone="orange" title="Smart Compress" text="Reduce file size while maintaining visual quality." />
            <article className="relative overflow-hidden rounded-xl bg-[#292d2e] p-6 text-white lg:col-span-8">
              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-lg shadow-fuchsia-950/30"><FileImage className="size-4" aria-hidden /></span>
              <h3 className="mt-6 font-display text-lg font-medium">Universal Conversion</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-white/65">Convert PDF to Office, CAD, or high-res images. One-click bidirectional processing that respects original formatting.</p>
              <div className="mt-6 flex flex-wrap gap-2">{['DOCX', 'XLSX', 'PPTX', 'JPG'].map((item) => <span key={item} className="rounded-md border border-white/14 bg-white/8 px-3 py-2 text-[10px]">{item}</span>)}</div>
            </article>
          </div>
        </div>
      </section>

      {/* Toolkit overview: future and supporting tools with distinct visual categories. */}
      <section className="bg-[#eef0f2] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div><h2 className="font-display text-2xl font-medium tracking-[-0.02em]">The Complete Toolkit</h2><p className="mt-2 text-sm text-muted">A library of specialized tools to handle any document scenario.</p></div>
            <a className="hidden items-center gap-1 text-xs font-medium text-primary sm:inline-flex" href="#try-free-tools">Try free tools <ArrowRight className="size-3.5" /></a>
          </div>
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {smallTools.map(({ title, text, icon: Icon, iconClass, surfaceClass }) => (
              <article key={title} className={`group rounded-xl border border-line p-5 soft-shadow transition duration-300 hover:-translate-y-1 hover:shadow-lg ${surfaceClass}`}>
                <span className={`grid size-10 place-items-center rounded-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}><Icon className="size-4" aria-hidden /></span>
                <h3 className="mt-4 font-display text-sm font-medium">{title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-muted">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview: concise plan comparison with a link to full details. */}
      <section className="bg-white px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Simple, Transparent Pricing.</h2>
          <p className="mt-2 text-sm text-muted">Choose the plan that fits your volume.</p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            <PlanCard title="Starter" price="₹0" features={['5 tasks per day', '50 MB max per file', 'Web-only access']} />
            <PlanCard featured title="Professional" price="₹999" features={['Unlimited tasks', '2 GB max file size', 'Desktop & mobile apps', 'AI summarization']} />
            <PlanCard title="Enterprise" price="Custom" features={['SSO & team management', 'Custom API integration', '99.9% SLA guarantee']} />
          </div>
          <Link to="/pricing" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary">Compare all plan features <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      {/* FAQ: expandable answers for common trust and billing questions. */}
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

      {/* Final call to action: optional account creation and enterprise contact. */}
      <section id="enterprise" className="bg-white px-5 py-18 sm:px-8">
        <div className="mx-auto max-w-6xl rounded-2xl bg-primary px-6 py-12 text-center text-white elevated-shadow sm:px-12">
          <BadgeCheck className="mx-auto size-8 text-[#d8e2ff]" aria-hidden />
          <h2 className="mt-5 font-display text-3xl font-medium tracking-[-0.025em] sm:text-4xl">Ready to master your workflow?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/72">Join professionals who trust PDF Toolkit for daily document needs.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/login" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-primary">Create Free Account</Link>
            <Link to="/pricing" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-medium">View Plans</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
