import {
  ArrowRight,
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
  Stamp,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { FeatureCard, PlanCard } from '../components/landing/LandingComponents'
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
  ['Do I need an account?', 'No. Guests receive 5 tasks and 100 MB of processing per day. Signing in raises those limits to 10 tasks and 200 MB per day.'],
  ['Why should I sign in?', 'A signed-in account can process one PDF up to 100 MB once per day. Guest PDFs must each be smaller than 50 MB.'],
]

export function LandingPage() {
  return (
    <main>
      {/* Cinematic hero keeps the animated backdrop behind stable, readable content. */}
      <section className="relative grid min-h-[88svh] place-items-center overflow-hidden border-b border-white/10 bg-[#031334] px-5 pb-12 pt-24 text-white sm:px-8 sm:pb-14 sm:pt-28">
        <div className="hero-art-motion pointer-events-none absolute -inset-[4%] bg-cover bg-center" aria-hidden />
        <div className="hero-light-sweep pointer-events-none absolute inset-0" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(1,10,36,0.86)_0%,rgba(2,16,53,0.62)_42%,rgba(3,17,51,0.24)_72%)] backdrop-blur-[1px]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-6xl text-center">
          <h1 className="font-display text-5xl font-black uppercase leading-[1.02] tracking-[-0.035em] text-white drop-shadow-[0_8px_26px_rgba(1,8,35,0.65)] sm:text-7xl lg:text-[6.2rem]">
            Make every PDF task
            <span className="mt-4 block bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">feel effortless</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-base font-semibold leading-7 text-white drop-shadow-[0_3px_14px_rgba(1,8,35,0.85)] sm:text-xl">
            Merge, split, and compress documents instantly in your browser. Your files stay on your device, with no account required.
          </p>
          <a href="#try-free-tools" className="mx-auto mt-9 inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border border-white/45 bg-white/14 px-11 text-xl font-black text-white shadow-[0_16px_42px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-cyan-200/80 hover:bg-white/24 hover:shadow-[0_0_44px_rgba(34,211,238,0.42)]">
            Try tools free <ArrowRight className="size-5" aria-hidden />
          </a>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-[0.08em] text-white/85">
            <span className="inline-flex items-center gap-1.5"><Check className="size-4 text-emerald-300" aria-hidden />No sign-up</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="size-4 text-cyan-200" aria-hidden />Local processing</span>
          </div>
        </div>
      </section>

      {/* Free tools: direct public entry points with no authentication wall. */}
      <section id="try-free-tools" className="scroll-mt-20 border-b border-line bg-white px-5 py-18 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Start right now</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">All Useful Tools</h2>
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

      {/* Access limits remain the final landing section and match runtime validation. */}
      <section id="access-plans" className="scroll-mt-20 bg-[#eef0f2] px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">Free access limits</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.025em]">Choose how you use PdfDocs</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">No paid subscription is available yet. Signing in simply unlocks a higher daily allowance and one larger-file task each day.</p>
          <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
            <PlanCard actionLabel="Use free tools" compactPrice title="Guest access" price="Free" priceSuffix="" to="/#try-free-tools" features={['5 tasks per day', '100 MB total processing per day', 'Each PDF must be smaller than 50 MB', 'Merge batches up to 100 MB']} />
            <PlanCard actionLabel="Login for higher limits" compactPrice featured badge="Higher limits" title="SIGN IN" price="Free" priceSuffix="" to="/login" features={['10 tasks per day', '200 MB total processing per day', 'One file up to 100 MB once per day', 'Merge batches up to 100 MB']} />
            <PlanCard actionLabel="Coming soon" disabled featured badge="Future pricing" title="Professional" price="₹999" features={['Planned expanded workflows', 'Priority processing options', 'Final benefits announced before launch', 'No payment collected today']} />
          </div>
        </div>
      </section>
    </main>
  )
}
