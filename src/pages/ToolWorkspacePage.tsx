import {
  CheckCircle2,
  Combine,
  FileText,
  GripVertical,
  Info,
  LockKeyhole,
  Minimize2,
  Plus,
  Scissors,
  Trash2,
  UploadCloud,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import {
  createDemoPdf,
  downloadPdf,
  extractPdfPages,
  getPdfPageCount,
  mergePdfDocuments,
  pagesInRange,
  readFileBytes,
} from '../lib/pdf-processing'

type WorkspaceMode = 'merge' | 'split' | 'compress'
type DemoFile = { name: string; size: string; pageCount: number }
type QueueFile = File | DemoFile
type SplitSource = { name: string; pageCount: number; bytes: Uint8Array | null }

export function ToolWorkspacePage({ mode }: { mode: WorkspaceMode }) {
  if (mode === 'split') return <SplitWorkspace />
  if (mode === 'compress') return <CompressWorkspace />
  return <MergeWorkspace />
}

function MergeWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<QueueFile[]>(() => [...demoFiles])
  const [notice, setNotice] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const appendFiles = (incomingFiles: File[]) => {
    const pdfFiles = incomingFiles.filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))
    setFiles((current) => [...current, ...pdfFiles])
    setNotice(pdfFiles.length ? null : 'Choose one or more PDF files to continue.')
  }

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    appendFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const dropFiles = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    appendFiles(Array.from(event.dataTransfer.files))
  }

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
    setNotice(null)
  }

  const mergeDocuments = async () => {
    if (files.length < 2) {
      setNotice('Add at least two PDF files before merging.')
      return
    }

    setProcessing(true)
    setNotice('Merging your PDFs on this device...')

    try {
      const inputs = await Promise.all(files.map((file) => file instanceof File
        ? readFileBytes(file)
        : createDemoPdf(file.pageCount, file.name)))
      const merged = await mergePdfDocuments(inputs)
      const pageCount = await getPdfPageCount(merged)
      downloadPdf(merged, 'merged-document.pdf')
      setNotice(`Merged ${files.length} PDFs into ${pageCount} pages. Download started.`)
    } catch (error) {
      setNotice(`Could not merge these PDFs. ${errorMessage(error)}`)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.78fr]">
        <section className="rounded-xl border border-[#bfc9dc] bg-white p-5 soft-shadow sm:p-7">
          <div className="flex items-center justify-between gap-4"><h1 className="font-display text-2xl font-medium">Merge PDF Documents</h1><span className="rounded-full bg-[#6cf8bb] px-3 py-1 text-xs font-medium text-[#006c49]">Secure local</span></div>
          <button type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={dropFiles} className="mt-6 grid min-h-80 w-full place-items-center rounded-xl border-2 border-dashed border-[#b9c3d5] bg-[#fbfcfd] p-6 text-center transition hover:border-primary hover:bg-blue-50/30">
            <span><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#eef3fd] text-primary"><UploadCloud className="size-7" /></span><span className="mt-5 block font-display text-lg font-medium">Drag & drop files here</span><span className="mt-2 block text-sm text-muted">Or click to browse your local storage</span><span className="mx-auto mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-5 text-sm font-medium soft-shadow"><Plus className="size-4" />Add Files</span></span>
          </button>
          <input ref={inputRef} aria-label="Choose PDF files" className="sr-only" type="file" accept="application/pdf" multiple onChange={addFiles} />
          <div className="mt-5 flex flex-wrap gap-4 text-[11px] uppercase tracking-wider text-muted"><span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5" />Processed on device</span><span className="inline-flex items-center gap-1.5"><Trash2 className="size-3.5" />Cleared when you leave</span></div>
        </section>

        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-[#bfc9dc] bg-white soft-shadow">
          <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 className="text-xs font-semibold uppercase tracking-[0.12em]">Merge Queue ({files.length})</h2><button onClick={() => { setFiles([]); setNotice('Merge queue cleared.') }} disabled={!files.length} type="button" className="text-xs font-medium text-primary disabled:cursor-not-allowed disabled:opacity-40">Clear all</button></div>
          <div className="flex-1 space-y-3 p-4">
            {files.map((file, index) => {
              const name = file instanceof File ? file.name : file.name
              const size = file instanceof File ? formatSize(file.size) : file.size
              return <div key={`${name}-${index}`} className="flex items-center gap-3 rounded-xl border border-line bg-[#f3f4f5] p-3"><GripVertical className="size-5 shrink-0 text-muted" /><span className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600"><FileText className="size-5" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{name}</p><p className="mt-1 text-xs text-muted">{size}</p></div><button onClick={() => removeFile(index)} type="button" className="grid size-8 place-items-center rounded-md hover:bg-white" aria-label={`Remove ${name}`}><X className="size-4" /></button></div>
            })}
            {!files.length && <p className="grid min-h-52 place-items-center text-center text-sm text-muted">No files in the queue. Add at least two PDFs to prepare a merge.</p>}
          </div>
          <div className="border-t border-line p-4"><button onClick={mergeDocuments} disabled={processing} type="button" className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-lg font-medium text-white shadow-lg shadow-primary/15 hover:bg-primary-strong disabled:cursor-wait disabled:opacity-70"><Combine className="size-5" />{processing ? 'Merging...' : 'Merge PDF'}</button>{notice && <p className="mt-3 text-center text-xs leading-5 text-muted" aria-live="polite">{notice}</p>}</div>
        </section>
      </div>
    </main>
  )
}

function SplitWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [source, setSource] = useState<SplitSource>(() => ({ ...demoSplitSource }))
  const [fromPage, setFromPage] = useState(1)
  const [toPage, setToPage] = useState(5)
  const [mergeOutput, setMergeOutput] = useState(true)
  const [ranges, setRanges] = useState<Array<{ from: number; to: number }>>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([1])
  const [notice, setNotice] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const chooseSource = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setNotice('Choose a PDF file to split.')
      return
    }

    setProcessing(true)
    setNotice('Checking your PDF...')
    try {
      const bytes = await readFileBytes(file)
      const pageCount = await getPdfPageCount(bytes)
      setSource({ name: file.name, pageCount, bytes })
      setFromPage(1)
      setToPage(Math.min(5, pageCount))
      setRanges([])
      setSelectedPages([1])
      setNotice(`Loaded ${file.name} with ${pageCount} page${pageCount === 1 ? '' : 's'}.`)
    } catch (error) {
      setNotice(`Could not open this PDF. ${errorMessage(error)}`)
    } finally {
      setProcessing(false)
    }
  }

  const addRange = () => {
    if (!Number.isInteger(fromPage) || !Number.isInteger(toPage) || fromPage < 1 || toPage < fromPage || toPage > source.pageCount) {
      setNotice(`Enter a page range between 1 and ${source.pageCount}.`)
      return
    }

    setRanges((current) => [...current, { from: fromPage, to: toPage }])
    setNotice(`Added pages ${fromPage} to ${toPage}.`)
  }

  const togglePage = (page: number) => {
    setSelectedPages((current) => current.includes(page) ? current.filter((item) => item !== page) : [...current, page])
    setNotice(null)
  }

  const splitDocument = async () => {
    const groups = [
      ...ranges.map((range) => ({ pages: pagesInRange(range), label: `pages-${range.from}-${range.to}` })),
      ...selectedPages.map((page) => ({ pages: [page], label: `page-${page}` })),
    ]

    if (!groups.length) {
      setNotice('Select a page or add a range before splitting.')
      return
    }

    setProcessing(true)
    setNotice('Splitting your PDF on this device...')
    try {
      const input = source.bytes ?? await createDemoPdf(source.pageCount, source.name)
      const baseName = source.name.replace(/\.pdf$/i, '')

      if (mergeOutput) {
        const uniquePages = [...new Set(groups.flatMap((group) => group.pages))]
        const output = await extractPdfPages(input, uniquePages)
        downloadPdf(output, `${baseName}-selection.pdf`)
        setNotice(`Created one PDF with ${uniquePages.length} page${uniquePages.length === 1 ? '' : 's'}. Download started.`)
      } else {
        const outputs = await Promise.all(groups.map((group) => extractPdfPages(input, group.pages)))
        outputs.forEach((output, index) => downloadPdf(output, `${baseName}-${groups[index]?.label ?? index + 1}.pdf`))
        setNotice(`Created ${outputs.length} separate PDF${outputs.length === 1 ? '' : 's'}. Downloads started.`)
      }
    } catch (error) {
      setNotice(`Could not split this PDF. ${errorMessage(error)}`)
    } finally {
      setProcessing(false)
    }
  }
  const visiblePages = Array.from({ length: Math.min(5, source.pageCount) }, (_, index) => index + 1)
  return (
    <main className="grid min-h-[calc(100vh-4rem)] pb-20 xl:grid-cols-[1fr_380px] lg:pb-0">
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><FileText className="size-5 shrink-0 text-primary" /><h1 className="truncate font-display text-lg font-medium">{source.name}</h1></div><div className="flex items-center gap-2"><button type="button" disabled={processing} onClick={() => inputRef.current?.click()} className="min-h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-primary disabled:opacity-60">Choose PDF</button><div className="hidden items-center gap-3 rounded-lg border border-line bg-white px-3 py-2 sm:flex"><ZoomOut className="size-4" /><span className="text-sm">85%</span><ZoomIn className="size-4" /></div></div></div>
        <input ref={inputRef} aria-label="Choose PDF to split" className="sr-only" type="file" accept="application/pdf" onChange={chooseSource} />
        <div className="precision-grid mt-6 grid min-h-[650px] place-items-center rounded-xl border border-line p-5 sm:p-10"><DocumentPreview totalPages={source.pageCount} /></div>
      </div>
      <aside className="border-l border-line bg-white">
        <div className="border-b border-line p-6"><h2 className="font-display text-xl font-medium">Split Settings</h2><p className="mt-1 text-sm text-muted">Choose pages from this {source.pageCount}-page document</p></div>
        <div className="p-6"><div className="flex items-center justify-between"><h3 className="font-display text-sm font-medium uppercase tracking-wider">Split by range</h3><button onClick={addRange} className="text-sm font-medium text-primary" type="button">+ Add Range</button></div><div className="mt-5 grid grid-cols-2 gap-4"><NumberField label="From Page" value={fromPage} onChange={setFromPage} /><NumberField label="To Page" value={toPage} onChange={setToPage} /></div><p className="mt-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-primary"><Info className="size-4" />Pages {fromPage} to {toPage} will be extracted into a new file.</p>
          {ranges.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{ranges.map((range, index) => <button key={`${range.from}-${range.to}-${index}`} onClick={() => setRanges((current) => current.filter((_, rangeIndex) => rangeIndex !== index))} type="button" aria-label={`Remove range ${range.from} to ${range.to}`} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs">Pages {range.from}–{range.to} ×</button>)}</div>}
          <h3 className="mt-8 font-display text-sm font-medium uppercase tracking-wider">Individual selection</h3><div className="mt-4 grid grid-cols-3 gap-2">{visiblePages.map((page) => { const selected = selectedPages.includes(page); return <button key={page} onClick={() => togglePage(page)} aria-label={`Select page ${page}`} aria-pressed={selected} type="button" className={`relative aspect-[3/4] rounded-lg border bg-[#f3f4f5] p-2 ${selected ? 'border-2 border-primary' : 'border-line'}`}><div className="h-2 w-2/3 rounded bg-[#cfd5de]" /><div className="mt-2 h-1 rounded bg-[#dfe3e8]" /><span className="absolute bottom-1.5 left-2 text-[10px]">{page}</span></button> })}{source.pageCount > visiblePages.length && <div className="grid aspect-[3/4] place-items-center rounded-lg border border-dashed border-[#b9c3d5] text-center text-sm font-medium">+{source.pageCount - visiblePages.length}<br /><span className="text-xs font-normal text-muted">more</span></div>}</div>
          <div className="mt-7 flex items-center justify-between rounded-xl bg-[#f3f4f5] p-4"><div><p className="text-sm font-medium">Merge into one file</p><p className="mt-1 text-xs text-muted">Combine selection into one PDF</p></div><button type="button" onClick={() => setMergeOutput((value) => !value)} aria-label="Merge split selections into one file" aria-pressed={mergeOutput} className={`relative h-7 w-12 rounded-full ${mergeOutput ? 'bg-primary' : 'bg-[#cfd5de]'}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${mergeOutput ? 'left-6' : 'left-1'}`} /></button></div>
        </div>
        <div className="border-t border-line p-6"><button onClick={splitDocument} disabled={processing} type="button" className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-lg font-medium text-white disabled:cursor-wait disabled:opacity-70"><Scissors className="size-5" />{processing ? 'Processing...' : 'Split PDF'}</button>{notice && <p className="mt-3 text-center text-xs leading-5 text-muted" aria-live="polite">{notice}</p>}<p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-muted">Securely processed on your device</p></div>
      </aside>
    </main>
  )
}

function CompressWorkspace() {
  const [level, setLevel] = useState(50)
  const [removeMetadata, setRemoveMetadata] = useState(true)
  const [optimizeImages, setOptimizeImages] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const estimate = level < 35 ? '3.8' : level < 70 ? '1.8' : '1.1'
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">
      <div className="grid gap-7 xl:grid-cols-[1.1fr_0.78fr]">
        <section className="precision-grid rounded-xl border border-line bg-white p-6 soft-shadow"><div className="grid min-h-[560px] place-items-center rounded-xl bg-[linear-gradient(145deg,#e8edf3,#cad4df)] p-8"><DocumentPreview compact /></div><p className="mt-5 text-center text-sm">Page 1 of 12 — 5.2 MB</p></section>
        <div className="space-y-5"><section className="rounded-xl border border-line bg-white p-6 soft-shadow"><h1 className="font-display text-2xl font-medium">Size Comparison</h1><div className="mt-6 flex items-center justify-between gap-4"><div className="rounded-xl bg-[#f3f4f5] p-4"><p className="text-xs text-muted">Original</p><p className="mt-1 font-display text-3xl font-medium">5.2<span className="ml-1 text-sm">MB</span></p></div><Minimize2 className="size-7 text-primary" /><div className="rounded-xl border border-blue-200 bg-[#d8e2ff] p-4"><p className="text-xs text-primary">Estimated</p><p className="mt-1 font-display text-3xl font-medium">{estimate}<span className="ml-1 text-sm">MB</span></p></div></div><p className="mt-5 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="size-4" />Up to 65% space saved</p></section>
          <section className="rounded-xl border border-line bg-white p-6 soft-shadow"><h2 className="font-display text-2xl font-medium">Compression Level</h2><input aria-label="Compression level" type="range" min="0" max="100" value={level} onChange={(event) => setLevel(Number(event.target.value))} className="mt-8 w-full accent-primary" /><div className="mt-2 grid grid-cols-3 text-center text-xs"><span>Low<br /><small className="text-muted">Max quality</small></span><span className="font-medium text-primary">Recommended<br /><small className="font-normal text-muted">Balanced</small></span><span>Extreme<br /><small className="text-muted">Min size</small></span></div><div className="mt-8 space-y-5 border-t border-line pt-6"><SwitchRow label="Remove Metadata" value={removeMetadata} setValue={setRemoveMetadata} /><SwitchRow label="Image Optimization" value={optimizeImages} setValue={setOptimizeImages} /></div></section>
          <button onClick={() => setNotice('Compression processing is not implemented yet. Merge and Split are ready to use.')} type="button" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-lg font-medium text-white shadow-lg shadow-primary/15"><Minimize2 className="size-5" />Compress</button>{notice && <p className="text-center text-xs leading-5 text-muted" aria-live="polite">{notice}</p>}<p className="text-center text-xs text-muted">Processed locally in your browser.</p>
        </div>
      </div>
    </main>
  )
}

function DocumentPreview({ compact = false, totalPages = 12 }: { compact?: boolean; totalPages?: number }) {
  return <div className={`relative w-full max-w-md bg-white p-8 shadow-xl ${compact ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}><div className="h-3 w-2/3 rounded bg-[#c9d2dc]" /><div className="mt-4 space-y-2"><div className="h-2 rounded bg-[#e4e8ed]" /><div className="h-2 rounded bg-[#e4e8ed]" /><div className="h-2 w-4/5 rounded bg-[#e4e8ed]" /></div><h3 className="mt-10 font-display text-2xl font-semibold text-[#394553]">Quarterly Performance</h3><div className="mt-8 flex h-40 items-end gap-3 border-b border-l border-[#cbd3dd] p-4">{[35,55,45,72,64,88].map((height, index) => <div key={index} style={{ height: `${height}%` }} className="flex-1 bg-primary/65" />)}</div><div className="mt-8 grid grid-cols-3 gap-3">{[1,2,3].map((item) => <div key={item} className="h-12 rounded bg-[#eef1f4]" />)}</div><span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-[#33383c] px-3 py-1 text-[10px] font-medium text-white">PAGE 1 OF {totalPages}</span></div>
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label><span className="mb-2 block text-xs text-[#333b49]">{label}</span><input type="number" min={1} value={value} onChange={(event) => onChange(Number(event.target.value))} className="precision-input" /></label>
}

function SwitchRow({ label, value, setValue }: { label: string; value: boolean; setValue: (value: boolean) => void }) {
  return <div className="flex items-center justify-between"><span className="text-sm">{label}</span><button type="button" onClick={() => setValue(!value)} aria-label={label} aria-pressed={value} className={`relative h-7 w-12 rounded-full ${value ? 'bg-primary' : 'bg-[#cfd5de]'}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${value ? 'left-6' : 'left-1'}`} /></button></div>
}

const demoFiles: DemoFile[] = [
  { name: 'Sample_Report.pdf', size: 'Test sample · 2 pages', pageCount: 2 },
  { name: 'Sample_Appendix.pdf', size: 'Test sample · 1 page', pageCount: 1 },
]

const demoSplitSource: SplitSource = { name: 'Sample_Report.pdf', pageCount: 5, bytes: null }

function formatSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try a different PDF.'
}
