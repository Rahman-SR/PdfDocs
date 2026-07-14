import {
  ArrowRight,
  FileImage,
  FileOutput,
  Hash,
  RotateCw,
  Stamp,
  Trash2,
  ListOrdered,
  type LucideIcon,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { CORE_PDF_TOOLS } from '../config/pdf-tools'

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
  { title: 'Rotate', text: 'Rotate single pages or an entire document to the right orientation.', icon: RotateCw, to: '/tools', iconClass: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200/70', accentClass: 'text-violet-700', surfaceClass: 'bg-gradient-to-br from-violet-100/90 via-violet-50/55 to-white hover:border-violet-300 hover:shadow-violet-200/60' },
  { title: 'Reorder', text: 'Drag and drop pages to rearrange the order of your document.', icon: ListOrdered, to: '/tools', iconClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/70', accentClass: 'text-cyan-700', surfaceClass: 'bg-gradient-to-br from-cyan-100/90 via-cyan-50/55 to-white hover:border-cyan-300 hover:shadow-cyan-200/60' },
  { title: 'Delete', text: 'Remove unwanted pages from your PDF file safely.', icon: Trash2, to: '/tools', iconClass: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-200/70', accentClass: 'text-rose-700', surfaceClass: 'bg-gradient-to-br from-rose-100/90 via-rose-50/55 to-white hover:border-rose-300 hover:shadow-rose-200/60' },
  { title: 'Extract', text: 'Pull specific content or pages into a new PDF document.', icon: FileOutput, to: '/tools', iconClass: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-200/70', accentClass: 'text-teal-700', surfaceClass: 'bg-gradient-to-br from-teal-100/90 via-teal-50/55 to-white hover:border-teal-300 hover:shadow-teal-200/60' },
  { title: 'Watermark', text: 'Add text or image watermarks for copyright protection.', icon: Stamp, to: '/tools', iconClass: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-200/70', accentClass: 'text-fuchsia-700', surfaceClass: 'bg-gradient-to-br from-fuchsia-100/90 via-fuchsia-50/55 to-white hover:border-fuchsia-300 hover:shadow-fuchsia-200/60' },
  { title: 'Page Numbers', text: 'Add flexible page numbering to your document.', icon: Hash, to: '/tools', iconClass: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-200/70', accentClass: 'text-amber-700', surfaceClass: 'bg-gradient-to-br from-amber-100/90 via-amber-50/55 to-white hover:border-amber-300 hover:shadow-amber-200/60' },
  { title: 'JPG to PDF', text: 'Turn images into one polished, shareable PDF.', icon: FileImage, to: '/tools', iconClass: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200/70', accentClass: 'text-pink-700', surfaceClass: 'bg-gradient-to-br from-pink-100/90 via-pink-50/55 to-white hover:border-pink-300 hover:shadow-pink-200/60' },
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
