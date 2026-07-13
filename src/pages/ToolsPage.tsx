import {
  ArrowRight,
  Combine,
  FileImage,
  FileOutput,
  Hash,
  Minimize2,
  RotateCw,
  Scissors,
  Stamp,
  Trash2,
  ListOrdered,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const tools = [
  { title: 'Merge', text: 'Combine multiple PDF files into one single document in seconds.', icon: Combine, to: '/tools/merge', tone: 'blue' },
  { title: 'Split', text: 'Extract specific pages or split one file into several documents.', icon: Scissors, to: '/tools/split', tone: 'green' },
  { title: 'Compress', text: 'Reduce PDF file size while maintaining high visual quality.', icon: Minimize2, to: '/tools/compress', tone: 'amber' },
  { title: 'Rotate', text: 'Rotate single pages or an entire document to the right orientation.', icon: RotateCw, to: '/tools', tone: 'blue' },
  { title: 'Reorder', text: 'Drag and drop pages to rearrange the order of your document.', icon: ListOrdered, to: '/tools', tone: 'neutral' },
  { title: 'Delete', text: 'Remove unwanted pages from your PDF file safely.', icon: Trash2, to: '/tools', tone: 'red' },
  { title: 'Extract', text: 'Pull specific content or pages into a new PDF document.', icon: FileOutput, to: '/tools', tone: 'green' },
  { title: 'Watermark', text: 'Add text or image watermarks for copyright protection.', icon: Stamp, to: '/tools', tone: 'blue' },
  { title: 'Page Numbers', text: 'Add flexible page numbering to your document.', icon: Hash, to: '/tools', tone: 'amber' },
  { title: 'JPG to PDF', text: 'Turn images into one polished, shareable PDF.', icon: FileImage, to: '/tools', tone: 'green' },
]

export function ToolsPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10 lg:py-12">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.035em]">Tools Directory</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-muted">Powerful, privacy-focused PDF utilities for professional workflows. Common operations stay on your device.</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map(({ title, text, icon: Icon, to, tone }) => <ToolDirectoryCard key={title} {...{ title, text, Icon, to, tone }} />)}
        <article className="grid min-h-72 place-items-center rounded-xl bg-[#2774e8] p-6 text-center text-white"><div><span className="mx-auto grid size-14 place-items-center rounded-full border-4 border-white/45"><span className="text-4xl font-light">+</span></span><h2 className="mt-5 font-display text-xl font-medium">More tools coming</h2><p className="mt-2 text-sm text-white/70">OCR, signatures, and AI workflows are on the roadmap.</p></div></article>
      </div>
    </main>
  )
}

function ToolDirectoryCard({ title, text, Icon, to, tone }: { title: string; text: string; Icon: typeof Combine; to: string; tone: string }) {
  const tones: Record<string, string> = { blue: 'bg-blue-50 text-primary', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', red: 'bg-red-50 text-red-700', neutral: 'bg-[#f0f1f2] text-[#333b49]' }
  const available = to !== '/tools'
  return <article className="flex min-h-72 flex-col rounded-xl border border-line bg-white p-6 soft-shadow"><span className={`grid size-11 place-items-center rounded-xl ${tones[tone]}`}><Icon className="size-5" /></span><h2 className="mt-6 font-display text-lg font-medium">{title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-muted">{text}</p>{available ? <Link to={to} className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#e7e8e9] text-xs font-medium hover:bg-primary hover:text-white">Open Tool<ArrowRight className="size-4" /></Link> : <span aria-disabled="true" className="mt-6 inline-flex min-h-10 cursor-not-allowed items-center justify-center rounded-lg bg-[#f0f1f2] text-xs font-medium text-muted">Coming Soon</span>}</article>
}
