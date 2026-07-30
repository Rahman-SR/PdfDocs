import { ArrowRight, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CORE_PDF_TOOLS, ROADMAP_PDF_TOOLS } from '../config/pdf-tools'

// The implemented tools reuse the shared catalog; this file only defines roadmap items.
const tools = [
  ...CORE_PDF_TOOLS.map(({ cardAccentClass, cardSurfaceClass, description, icon, iconClass, workspacePath, workspaceTitle }) => ({
    accentClass: cardAccentClass,
    icon,
    iconClass,
    surfaceClass: cardSurfaceClass,
    text: description,
    title: workspaceTitle,
    to: workspacePath,
  })),
  ...ROADMAP_PDF_TOOLS.map(({ accentClass, description, icon, iconClass, surfaceClass, title }) => ({
    accentClass,
    icon,
    iconClass,
    surfaceClass,
    text: description,
    title,
    to: '/tools',
  })),
]

export function ToolsPage() {
  // Unavailable tools report their status without navigating away.
  const [notice, setNotice] = useState<string | null>(null)

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10 lg:py-12">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.035em]">Tools Directory</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-muted">Powerful, privacy-focused PDF utilities for professional workflows. Common operations stay on your device.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map(({ title, text, icon: Icon, to, iconClass, accentClass, surfaceClass }) => <ToolDirectoryCard key={title} {...{ title, text, Icon, to, iconClass, accentClass, surfaceClass }} onUnavailable={(tool) => setNotice(`${tool} is coming soon.`)} />)}
        <article className="grid min-h-60 place-items-center rounded-xl bg-[#2774e8] p-6 text-center text-white transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20"><div><span className="mx-auto grid size-14 place-items-center rounded-full border-4 border-white/45"><span className="text-4xl font-light">+</span></span><h2 className="mt-5 font-display text-xl font-medium">More tools coming</h2><p className="mt-2 text-sm text-white/70">OCR, signatures, and AI workflows are on the roadmap.</p></div></article>
      </div>
      {notice && <p role="status" className="fixed bottom-20 right-5 z-50 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-[#333b49] shadow-xl lg:bottom-6">{notice}</p>}
    </main>
  )
}

// A single card component handles both active routes and coming-soon feedback.
function ToolDirectoryCard({ title, text, Icon, to, iconClass, accentClass, surfaceClass, onUnavailable }: { title: string; text: string; Icon: LucideIcon; to: string; iconClass: string; accentClass: string; surfaceClass: string; onUnavailable: (title: string) => void }) {
  const available = to !== '/tools'
  const cardClass = `group relative flex min-h-60 w-full cursor-pointer flex-col rounded-xl border border-line p-6 text-left soft-shadow transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${surfaceClass}`
  const content = <><span className={`grid size-11 place-items-center rounded-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 ${iconClass}`}><Icon className="size-5" aria-hidden /></span>{!available && <span className="absolute right-5 top-5 rounded-full border border-white/80 bg-white/75 px-2.5 py-1 text-[10px] font-medium text-muted shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-white">Coming soon</span>}<h2 className="mt-6 font-display text-lg font-medium transition-transform duration-300 group-hover:translate-x-0.5">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{text}</p><span className={`mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold ${accentClass}`}>Open tool <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden /></span></>

  return available
    ? <Link to={to} aria-label={`Open ${title} tool`} className={cardClass}>{content}</Link>
    : <button type="button" aria-label={`${title} (coming soon)`} onClick={() => onUnavailable(title)} className={cardClass}>{content}</button>
}
