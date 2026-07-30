import { ArrowRight, ChevronDown, Mail, ShieldCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { CORE_PDF_TOOLS, ROADMAP_PDF_TOOLS } from '../config/pdf-tools'
import { Brand } from './Brand'

export function PublicLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [infoPanel, setInfoPanel] = useState<InfoPanelKey | null>(null)
  const headerOnHero = isLandingPage && !scrolled

  // The landing header blends into the hero, then gains a readable glass surface while scrolling.
  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 40)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  // Hash links also scroll correctly when React mounts the landing page after navigation.
  useEffect(() => {
    if (!location.hash) return
    const target = document.getElementById(location.hash.slice(1))
    target?.scrollIntoView({ behavior: 'auto', block: 'start' })
  }, [location.hash, location.pathname])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* Landing navigation floats directly over the hero; inner pages keep a readable glass bar. */}
      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
        <div className={`relative mx-auto flex h-16 max-w-[78rem] items-center justify-between px-2 transition-all duration-300 sm:px-3 ${headerOnHero ? '' : 'rounded-2xl border border-white/70 bg-white/80 shadow-[0_12px_40px_rgba(28,55,94,0.12)] backdrop-blur-2xl'}`}>
          <Brand premium={headerOnHero} />
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 text-xs font-semibold md:flex" aria-label="Primary navigation">
            {/* All implemented tools appear first, followed by clearly labeled roadmap tools. */}
            <div className="group/tools relative">
              <a className={`${publicNavClass(headerOnHero)} inline-flex items-center gap-1.5`} href="/#try-free-tools">
                Tools
                <ChevronDown className="size-3 transition-transform duration-300 group-hover/tools:rotate-180" aria-hidden />
              </a>
              <div className="pointer-events-none invisible absolute left-1/2 top-full w-[48rem] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-300 ease-out group-hover/tools:pointer-events-auto group-hover/tools:visible group-hover/tools:translate-y-0 group-hover/tools:opacity-100 group-focus-within/tools:pointer-events-auto group-focus-within/tools:visible group-focus-within/tools:translate-y-0 group-focus-within/tools:opacity-100">
                <div className="rounded-2xl border border-white/65 bg-slate-950/88 p-3 text-white shadow-[0_24px_70px_rgba(2,6,23,0.4)] backdrop-blur-2xl">
                  <p className="px-2 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">Available now</p>
                  <div className="grid grid-cols-3 gap-2">
                    {CORE_PDF_TOOLS.map(({ description, icon: Icon, iconClass, publicPath, title }) => (
                      <Link key={title} to={publicPath} className="group/card rounded-xl border border-white/10 bg-white/7 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                        <span className={`grid size-9 place-items-center rounded-lg ${iconClass}`}><Icon className="size-4" aria-hidden /></span>
                        <span className="mt-3 flex items-center justify-between gap-2 font-semibold">{title}<ArrowRight className="size-3.5 text-cyan-200 transition-transform duration-300 group-hover/card:translate-x-1" aria-hidden /></span>
                        <span className="mt-1 block text-[10px] leading-4 text-white/60">{description}</span>
                      </Link>
                    ))}
                  </div>
                  <p className="px-2 pb-2 pt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-violet-200">Coming soon</p>
                  <div className="grid grid-cols-4 gap-2">
                    {ROADMAP_PDF_TOOLS.map(({ description, icon: Icon, iconClass, title }) => (
                      <span key={title} className="rounded-xl border border-white/8 bg-white/5 p-2.5 opacity-80">
                        <span className={`grid size-8 place-items-center rounded-lg ${iconClass}`}><Icon className="size-3.5" aria-hidden /></span>
                        <span className="mt-2 block text-[11px] font-semibold">{title}</span>
                        <span className="mt-1 block text-[9px] leading-3.5 text-white/50">{description}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <a className={publicNavClass(headerOnHero)} href="/#features">Features</a>
            <Link className={publicNavClass(headerOnHero)} to="/pricing">Pricing</Link>
            <button className={publicNavClass(headerOnHero)} onClick={() => setContactOpen(true)} type="button">Contact</button>
            <Link className={publicNavClass(headerOnHero)} to="/login">Login</Link>
          </nav>
          <Link className={`${publicNavClass(headerOnHero)} md:hidden`} to="/login">Login</Link>
        </div>
      </header>

      {/* Child public route content. */}
      <div className={isLandingPage ? '' : 'pt-20'}><Outlet /></div>

      {/* Footer links connect to real sections and the contact action opens an email handoff. */}
      <footer id="about" className="border-t border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8 lg:px-10">
          <div className="public-footer-grid grid gap-8 sm:grid-cols-2">
            <div>
              <Brand premium />
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">Fast, private PDF workflows that run locally in your browser. Built for focused document work without unnecessary uploads.</p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-300"><ShieldCheck className="size-3.5" aria-hidden />Local-first processing</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Product</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <a href="/#try-free-tools" className={footerActionClass}>Tools</a>
                <a href="/#features" className={footerActionClass}>Features</a>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Company</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <button type="button" onClick={() => setInfoPanel('about')} className={footerActionClass}>About</button>
                <button type="button" onClick={() => setInfoPanel('security')} className={footerActionClass}>Security</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Resources</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <a href="/#faq" className={footerActionClass}>FAQ</a>
                <button type="button" onClick={() => setContactOpen(true)} className={`${footerActionClass} inline-flex items-center gap-2`}><Mail className="size-4" aria-hidden />Contact</button>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200">Legal</p>
              <div className="mt-4 flex flex-col items-start gap-3">
                <button type="button" onClick={() => setInfoPanel('privacy')} className={footerActionClass}>Privacy Policy</button>
                <button type="button" onClick={() => setInfoPanel('terms')} className={footerActionClass}>Terms &amp; Conditions</button>
              </div>
            </div>
          </div>
          <div className="mt-7 border-t border-slate-800 pt-5 text-[11px] text-slate-500">
            <p>&copy; {new Date().getFullYear()} PdfDocs. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {contactOpen && <ContactDialog onClose={() => setContactOpen(false)} />}
      {infoPanel && <InfoDialog panel={infoPanel} onClose={() => setInfoPanel(null)} />}
    </div>
  )
}

function ContactDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-5">
      <button type="button" aria-label="Close contact dialog" onClick={onClose} className="absolute inset-0 h-full w-full bg-slate-950/70 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-labelledby="contact-title" className="relative w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg border border-line transition hover:bg-slate-100" aria-label="Close"><X className="size-4" aria-hidden /></button>
        <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg"><Mail className="size-5" aria-hidden /></span>
        <h2 id="contact-title" className="mt-5 font-display text-2xl font-bold">Contact PdfDocs</h2>
        <p className="mt-2 text-sm leading-6 text-muted">Your email application will open with a pre-filled support subject. Add your message and send it when ready.</p>
        <a href="mailto:anxprimesnow@gmail.com?subject=PdfDocs%20Support%20Request" className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-strong"><Mail className="size-4" aria-hidden />Open email app</a>
      </section>
    </div>
  )
}

type InfoPanelKey = 'about' | 'privacy' | 'security' | 'terms'

const infoPanels: Record<InfoPanelKey, { body: string[]; title: string }> = {
  about: {
    title: 'About PdfDocs',
    body: ['PdfDocs is a browser-first workspace for practical PDF tasks. Merge, Split, and Compress are available now without forcing account creation.', 'The product focuses on fast, understandable document workflows with local browser processing wherever supported.'],
  },
  security: {
    title: 'Security',
    body: ['Available PDF tools process document contents in your browser. PdfDocs does not intentionally upload those files to an application server.', 'Temporary object URLs are released when previews change or the workspace closes. Account sessions are handled through the configured Supabase authentication project.'],
  },
  privacy: {
    title: 'Privacy Policy',
    body: ['PdfDocs stores local preferences and daily usage counters needed to operate the web experience. PDF contents are excluded from product analytics.', 'Contact details are used only when you deliberately open your email application and send a support message.'],
  },
  terms: {
    title: 'Terms & Conditions',
    body: ['Use PdfDocs only with documents you own or are authorized to process. You remain responsible for the content and outputs you create.', 'Roadmap features and preview pricing may change before release. No paid subscription is currently offered or collected.'],
  },
}

function InfoDialog({ onClose, panel }: { onClose: () => void; panel: InfoPanelKey }) {
  const content = infoPanels[panel]
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-5">
      <button type="button" aria-label={`Close ${content.title}`} onClick={onClose} className="absolute inset-0 h-full w-full bg-slate-950/72 backdrop-blur-sm" />
      <section role="dialog" aria-modal="true" aria-labelledby="info-dialog-title" className="relative w-full max-w-xl rounded-2xl border border-white/70 bg-white p-7 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 grid size-9 place-items-center rounded-lg transition hover:bg-slate-100" aria-label="Close"><X className="size-4" aria-hidden /></button>
        <h2 id="info-dialog-title" className="pr-10 font-display text-2xl font-bold text-[#23272f]">{content.title}</h2>
        <div className="mt-5 space-y-4">{content.body.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-muted">{paragraph}</p>)}</div>
        <button type="button" onClick={onClose} className="mt-7 min-h-11 rounded-xl bg-[#23272f] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-black">Done</button>
      </section>
    </div>
  )
}

// Glass pills remain readable over both the hero and light inner-page header.
const publicNavClass = (onHero: boolean) => `rounded-full border border-transparent bg-transparent px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${onHero ? 'text-white/85 hover:border-white/20 hover:bg-white/12 hover:text-white' : 'text-[#4f5661] hover:border-blue-100 hover:bg-white/80 hover:text-primary'}`
const footerActionClass = 'text-sm text-slate-400 transition hover:translate-x-0.5 hover:text-cyan-300'
