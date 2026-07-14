import { FileText, Info, LoaderCircle, LockKeyhole, Scissors } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { downloadPdf, extractPdfPages, getPdfPageCount, pagesInRange, readFileBytes } from '../../lib/pdf-processing'
import { FreeUsageNotice, NumberField, PdfPreviewFrame, PdfUploadEmptyState } from './WorkspaceUi'
import { useFreeUsageQuota } from './useFreeUsageQuota'
import { createPdfObjectUrl, getErrorMessage, isPdfFile, notifyCompletion } from './workspace-utils'

// Split workspace source and page-selection models.
type SplitSource = {
  bytes: Uint8Array
  name: string
  pageCount: number
  url: string
}

type PageRange = {
  from: number
  to: number
}

export function SplitWorkspace() {
  // Source document, selection, and feedback state.
  const quota = useFreeUsageQuota()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [source, setSource] = useState<SplitSource | null>(null)
  const [fromPage, setFromPage] = useState(1)
  const [toPage, setToPage] = useState(1)
  const [mergeOutput, setMergeOutput] = useState(true)
  const [ranges, setRanges] = useState<PageRange[]>([])
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [previewLoading, setPreviewLoading] = useState(false)

  // Release the local preview URL when the workspace closes.
  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  // Selecting a PDF initializes a clean set of page controls.
  const chooseSource = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!isPdfFile(file)) {
      setNotice('Choose a PDF file to split.')
      return
    }

    const fileLimitMessage = quota.validateFile(file)
    if (fileLimitMessage) {
      setNotice(fileLimitMessage)
      return
    }

    setProcessing(true)
    setPreviewLoading(true)
    setNotice('Checking your PDF...')

    try {
      const bytes = await readFileBytes(file)
      const pageCount = await getPdfPageCount(bytes)
      const url = createPdfObjectUrl(bytes)

      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = url
      setSource({ bytes, name: file.name, pageCount, url })
      setFromPage(1)
      setToPage(Math.min(5, pageCount))
      setRanges([])
      setSelectedPages([1])
      setNotice(`Loaded ${file.name} with ${pageCount} page${pageCount === 1 ? '' : 's'}.`)
    } catch (error) {
      setNotice(`Could not open this PDF. ${getErrorMessage(error)}`)
    } finally {
      setProcessing(false)
      setPreviewLoading(false)
    }
  }

  // Page ranges and individual pages can be combined into one output selection.
  const addRange = () => {
    if (!source) return

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

  // Split processing either creates one combined PDF or one download per selection.
  const splitDocument = async () => {
    if (!source) {
      setNotice('Choose a PDF before selecting pages.')
      return
    }

    const groups = [
      ...ranges.map((range) => ({ pages: pagesInRange(range), label: `pages-${range.from}-${range.to}` })),
      ...selectedPages.map((page) => ({ pages: [page], label: `page-${page}` })),
    ]

    if (!groups.length) {
      setNotice('Select a page or add a range before splitting.')
      return
    }

    if (!quota.canStartTask()) {
      setNotice(quota.dailyLimitMessage)
      return
    }

    setProcessing(true)
    setNotice('Splitting your PDF on this device...')

    try {
      const baseName = source.name.replace(/\.pdf$/i, '')

      if (mergeOutput) {
        const uniquePages = [...new Set(groups.flatMap((group) => group.pages))]
        const output = await extractPdfPages(source.bytes, uniquePages)
        downloadPdf(output, `${baseName}-selection.pdf`)
        quota.completeTask()
        notifyCompletion(`Created one PDF with ${uniquePages.length} page${uniquePages.length === 1 ? '' : 's'}. Download started.`, setNotice)
      } else {
        const outputs = await Promise.all(groups.map((group) => extractPdfPages(source.bytes, group.pages)))
        outputs.forEach((output, index) => downloadPdf(output, `${baseName}-${groups[index]?.label ?? index + 1}.pdf`))
        quota.completeTask()
        notifyCompletion(`Created ${outputs.length} separate PDF${outputs.length === 1 ? '' : 's'}. Downloads started.`, setNotice)
      }
    } catch (error) {
      setNotice(`Could not split this PDF. ${getErrorMessage(error)}`)
    } finally {
      setProcessing(false)
    }
  }

  const visiblePages = source ? Array.from({ length: Math.min(5, source.pageCount) }, (_, index) => index + 1) : []

  // Two-column layout keeps the preview and split controls visible together.
  return (
    <main className="grid min-h-[calc(100vh-4rem)] pb-20 min-[1180px]:grid-cols-[minmax(0,540px)_minmax(460px,1fr)] min-[1180px]:pb-0">
      <div className="px-5 py-8 sm:px-8 min-[1180px]:px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="size-5 shrink-0 text-primary" aria-hidden />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">PDF preview</p>
              <h1 className="mt-1 truncate font-display text-lg font-medium">{source?.name ?? 'Choose a PDF to begin'}</h1>
            </div>
          </div>
          {source && (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-xs text-emerald-700 sm:inline-flex"><LockKeyhole className="size-3.5" aria-hidden />Local preview</span>
              <button type="button" disabled={processing || previewLoading} onClick={() => inputRef.current?.click()} className="min-h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60">Choose another PDF</button>
            </div>
          )}
        </div>
        <div className="mt-4"><FreeUsageNotice isFreePlan={quota.isFreePlan} remainingTasks={quota.usage.remainingTasks} /></div>
        <input ref={inputRef} aria-label="Choose PDF to split" className="sr-only" type="file" accept="application/pdf" onChange={chooseSource} />

        <div className="mt-6 flex justify-center min-[1180px]:justify-start">
          {previewLoading ? (
            <div className="grid aspect-square w-full max-w-[500px] place-items-center rounded-xl border border-line bg-[#e9edf2] text-center text-muted">
              <div><LoaderCircle className="mx-auto size-8 animate-spin text-primary" aria-hidden /><p className="mt-3 text-sm">Preparing PDF preview...</p></div>
            </div>
          ) : source ? (
            <PdfPreviewFrame title={`Split preview: ${source.name}`} url={source.url} />
          ) : (
            <PdfUploadEmptyState title="Select a PDF to split" description="Choose a document, then select page ranges or individual pages." buttonLabel="Choose PDF" onChoose={() => inputRef.current?.click()} />
          )}
        </div>

        {source && (
          <div className="mx-auto mt-3 flex max-w-[500px] items-center justify-center gap-2 text-xs text-muted min-[1180px]:mx-0">
            <span>{source.pageCount} page{source.pageCount === 1 ? '' : 's'}</span><span aria-hidden>&middot;</span><span>Processed on your device</span>
          </div>
        )}
      </div>

      <aside className="min-w-0 border-l border-line bg-white">
        <div className="border-b border-line px-7 py-6">
          <h2 className="font-display text-2xl font-medium">Split Settings</h2>
          <p className="mt-1.5 text-sm text-muted">{source ? `Choose pages from this ${source.pageCount}-page document` : 'Choose a PDF to enable page selection'}</p>
        </div>

        <fieldset disabled={!source} className="disabled:opacity-55">
          <div className="p-7">
            <div className="flex items-center justify-between"><h3 className="font-display text-sm font-medium uppercase tracking-wider">Split by range</h3><button onClick={addRange} className="text-sm font-medium text-primary" type="button">+ Add Range</button></div>
            <div className="mt-5 grid grid-cols-2 gap-4"><NumberField label="From Page" value={fromPage} onChange={setFromPage} /><NumberField label="To Page" value={toPage} onChange={setToPage} /></div>
            <p className="mt-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-primary"><Info className="size-4" aria-hidden />{source ? `Pages ${fromPage} to ${toPage} will be extracted into a new file.` : 'Select a PDF to configure a page range.'}</p>

            {ranges.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {ranges.map((range, index) => <button key={`${range.from}-${range.to}-${index}`} onClick={() => setRanges((current) => current.filter((_, rangeIndex) => rangeIndex !== index))} type="button" aria-label={`Remove range ${range.from} to ${range.to}`} className="rounded-full border border-line bg-white px-3 py-1.5 text-xs">Pages {range.from}–{range.to} ×</button>)}
              </div>
            )}

            <h3 className="mt-8 font-display text-sm font-medium uppercase tracking-wider">Individual selection</h3>
            <div className="mt-4 grid grid-cols-3 gap-2 min-[1450px]:grid-cols-5">
              {visiblePages.map((page) => {
                const selected = selectedPages.includes(page)
                return (
                  <button key={page} onClick={() => togglePage(page)} aria-label={`Select page ${page}`} aria-pressed={selected} type="button" className={`relative aspect-[3/4] rounded-lg border bg-[#f3f4f5] p-2 ${selected ? 'border-2 border-primary' : 'border-line'}`}>
                    <div className="h-2 w-2/3 rounded bg-[#cfd5de]" /><div className="mt-2 h-1 rounded bg-[#dfe3e8]" /><span className="absolute bottom-1.5 left-2 text-[10px]">{page}</span>
                  </button>
                )
              })}
              {source && source.pageCount > visiblePages.length && <div className="grid aspect-[3/4] place-items-center rounded-lg border border-dashed border-[#b9c3d5] text-center text-sm font-medium">+{source.pageCount - visiblePages.length}<br /><span className="text-xs font-normal text-muted">more</span></div>}
            </div>

            <div className="mt-7 flex items-center justify-between rounded-xl bg-[#f3f4f5] p-4">
              <div><p className="text-sm font-medium">Merge into one file</p><p className="mt-1 text-xs text-muted">Combine selection into one PDF</p></div>
              <button type="button" onClick={() => setMergeOutput((value) => !value)} aria-label="Merge split selections into one file" aria-pressed={mergeOutput} className={`relative h-7 w-12 rounded-full ${mergeOutput ? 'bg-primary' : 'bg-[#cfd5de]'}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${mergeOutput ? 'left-6' : 'left-1'}`} /></button>
            </div>
          </div>
        </fieldset>

        <div className="border-t border-line p-7">
          <button onClick={() => void splitDocument()} disabled={!source || processing} type="button" className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-lg font-medium text-white disabled:cursor-wait disabled:opacity-70"><Scissors className="size-5" aria-hidden />{processing ? 'Processing...' : 'Split PDF'}</button>
          {notice && <p className="mt-3 text-center text-xs leading-5 text-muted" aria-live="polite">{notice}</p>}
          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-muted">Securely processed on your device</p>
        </div>
      </aside>
    </main>
  )
}
