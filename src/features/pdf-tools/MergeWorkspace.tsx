import {
  Combine,
  Download,
  Eye,
  FileText,
  GripVertical,
  LoaderCircle,
  LockKeyhole,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from 'react'

import { downloadPdf, getPdfPageCount, mergePdfDocuments, readFileBytes } from '../../lib/pdf-processing'
import { FreeUsageNotice, PdfPreviewFrame } from './WorkspaceUi'
import { useFreeUsageQuota } from './useFreeUsageQuota'
import { createPdfObjectUrl, formatFileSize, getErrorMessage, isPdfFile, notifyCompletion } from './workspace-utils'

// Merge-specific data kept in memory only for the current browser session.
type MergePreview = {
  name: string
  pageCount: number
  size: string
  url: string
}

export function MergeWorkspace() {
  // Input, processing, and result state.
  const quota = useFreeUsageQuota()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [preview, setPreview] = useState<MergePreview | null>(null)
  const [previewingIndex, setPreviewingIndex] = useState<number | null>(null)
  const [mergedResult, setMergedResult] = useState<{ bytes: Uint8Array; pageCount: number } | null>(null)

  // Object URLs must be released when a preview changes or the page closes.
  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  // File selection accepts only PDFs and appends them to the current queue.
  const appendFiles = (incomingFiles: File[]) => {
    const pdfFiles = incomingFiles.filter(isPdfFile)
    const acceptedFiles = pdfFiles.filter((file) => !quota.validateFile(file))
    const rejectedFile = pdfFiles.find((file) => quota.validateFile(file))

    if (acceptedFiles.length) {
      setFiles((current) => [...current, ...acceptedFiles])
      setMergedResult(null)
    }

    setNotice(
      rejectedFile
        ? quota.validateFile(rejectedFile)
        : pdfFiles.length
          ? null
          : 'Choose one or more PDF files to continue.',
    )
  }

  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    appendFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  const dropFiles = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault()
    appendFiles(Array.from(event.dataTransfer.files))
  }

  // Preview lifecycle is separate from merge processing so files remain reusable.
  const closePreview = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = null
    setPreview(null)
  }

  const openPreview = async (file: File, index: number) => {
    setPreviewingIndex(index)

    try {
      const bytes = await readFileBytes(file)
      const pageCount = await getPdfPageCount(bytes)
      const url = createPdfObjectUrl(bytes)

      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = url
      setPreview({ name: file.name, pageCount, size: formatFileSize(file.size), url })
      setNotice(null)
    } catch (error) {
      setNotice(`Could not preview this PDF. ${getErrorMessage(error)}`)
    } finally {
      setPreviewingIndex(null)
    }
  }

  const removeFile = (index: number) => {
    closePreview()
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
    setMergedResult(null)
    setNotice(null)
  }

  const clearFiles = () => {
    closePreview()
    setFiles([])
    setMergedResult(null)
    setNotice('Merge queue cleared.')
  }

  // Merge processing creates a result first; downloading remains an explicit action.
  const mergeDocuments = async () => {
    if (files.length < 2) {
      setNotice('Add at least two PDF files before merging.')
      return
    }

    if (!quota.canStartTask()) {
      setNotice(quota.dailyLimitMessage)
      return
    }

    setProcessing(true)
    setMergedResult(null)
    setNotice('Merging your PDFs on this device...')

    try {
      const inputs = await Promise.all(files.map(readFileBytes))
      const merged = await mergePdfDocuments(inputs)
      const pageCount = await getPdfPageCount(merged)
      setMergedResult({ bytes: merged, pageCount })
      quota.completeTask()
      notifyCompletion(`Merged ${files.length} PDFs into ${pageCount} pages. Ready to download.`, setNotice)
    } catch (error) {
      setNotice(`Could not merge these PDFs. ${getErrorMessage(error)}`)
    } finally {
      setProcessing(false)
    }
  }

  const downloadMergedDocument = () => {
    if (!mergedResult) return

    try {
      downloadPdf(mergedResult.bytes, 'merged-document.pdf')
      setNotice(`Download started for your ${mergedResult.pageCount}-page merged PDF.`)
    } catch (error) {
      setNotice(`Could not download the merged PDF. ${getErrorMessage(error)}`)
    }
  }

  // Workspace layout: upload area, queue, actions, and optional preview drawer.
  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.78fr]">
        <section className="rounded-xl border border-[#bfc9dc] bg-white p-5 soft-shadow sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-display text-2xl font-medium">Merge PDF Documents</h1>
            <span className="rounded-full bg-[#6cf8bb] px-3 py-1 text-xs font-medium text-[#006c49]">Secure local</span>
          </div>
          <div className="mt-4"><FreeUsageNotice isFreePlan={quota.isFreePlan} remainingTasks={quota.usage.remainingTasks} /></div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={dropFiles}
            className="mt-6 grid min-h-80 w-full place-items-center rounded-xl border-2 border-dashed border-[#b9c3d5] bg-[#fbfcfd] p-6 text-center transition hover:border-primary hover:bg-blue-50/30"
          >
            <span>
              <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#eef3fd] text-primary">
                <UploadCloud className="size-7" aria-hidden />
              </span>
              <span className="mt-5 block font-display text-lg font-medium">Drag &amp; drop files here</span>
              <span className="mt-2 block text-sm text-muted">Or click to browse your local storage</span>
              <span className="mx-auto mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-5 text-sm font-medium soft-shadow">
                <Plus className="size-4" aria-hidden /> Add Files
              </span>
            </span>
          </button>
          <input ref={inputRef} aria-label="Choose PDF files" className="sr-only" type="file" accept="application/pdf" multiple onChange={addFiles} />
          <div className="mt-5 flex flex-wrap gap-4 text-[11px] uppercase tracking-wider text-muted">
            <span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5" aria-hidden />Processed on device</span>
            <span className="inline-flex items-center gap-1.5"><Trash2 className="size-3.5" aria-hidden />Cleared when you leave</span>
          </div>
        </section>

        <section className="flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-[#bfc9dc] bg-white soft-shadow">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em]">Merge Queue ({files.length})</h2>
            <button onClick={clearFiles} disabled={!files.length} type="button" className="text-xs font-medium text-primary disabled:cursor-not-allowed disabled:opacity-40">Clear all</button>
          </div>

          <div className="flex-1 space-y-3 p-4">
            {files.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-xl border border-line bg-[#f3f4f5] p-3">
                <GripVertical className="size-5 shrink-0 text-muted" aria-hidden />
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600"><FileText className="size-5" aria-hidden /></span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.name}</p><p className="mt-1 text-xs text-muted">{formatFileSize(file.size)}</p></div>
                <button onClick={() => void openPreview(file, index)} disabled={previewingIndex !== null} type="button" className="inline-flex min-h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-primary transition hover:bg-white disabled:cursor-wait disabled:opacity-60" aria-label={`Preview ${file.name}`}>
                  {previewingIndex === index ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Eye className="size-4" aria-hidden />}<span className="hidden sm:inline">Preview</span>
                </button>
                <button onClick={() => removeFile(index)} type="button" className="grid size-8 place-items-center rounded-md transition hover:bg-white" aria-label={`Remove ${file.name}`}><X className="size-4" aria-hidden /></button>
              </div>
            ))}
            {!files.length && <p className="grid min-h-52 place-items-center text-center text-sm text-muted">No files in the queue. Add at least two PDFs to prepare a merge.</p>}
          </div>

          <div className="border-t border-line p-4">
            <div className="space-y-3">
              <button onClick={() => void mergeDocuments()} disabled={processing} type="button" className="flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-lg font-medium text-white shadow-lg shadow-primary/15 transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-70">
                <Combine className="size-5" aria-hidden />{processing ? 'Merging...' : mergedResult ? 'Merge again' : 'Merge PDF'}
              </button>
              {mergedResult && (
                <button onClick={downloadMergedDocument} type="button" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 font-display text-base font-medium text-emerald-800 transition hover:-translate-y-0.5 hover:bg-emerald-100 hover:shadow-md active:translate-y-0">
                  <Download className="size-5" aria-hidden />Download merged PDF
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold">{mergedResult.pageCount} pages</span>
                </button>
              )}
            </div>
            {notice && <p className="mt-3 text-center text-xs leading-5 text-muted" aria-live="polite">{notice}</p>}
          </div>
        </section>
      </div>

      {preview && <MergePreviewPanel preview={preview} onClose={closePreview} />}
    </main>
  )
}

// Slide-over keeps the document readable without leaving the merge queue.
function MergePreviewPanel({ preview, onClose }: { preview: MergePreview; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close PDF preview" onClick={onClose} className="absolute inset-0 h-full w-full bg-[#101820]/45 backdrop-blur-[2px]" />
      <aside role="dialog" aria-modal="true" aria-labelledby="merge-preview-title" className="preview-slide-in absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col border-l border-line bg-canvas shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">PDF preview</p><h2 id="merge-preview-title" className="mt-1 truncate font-display text-lg font-medium">Preview {preview.name}</h2></div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-white text-[#333b49] transition hover:border-primary/30 hover:bg-blue-50 hover:text-primary" aria-label="Close preview"><X className="size-5" aria-hidden /></button>
        </div>
        <div className="flex items-center gap-3 border-b border-line bg-white px-5 py-3 text-xs text-muted sm:px-6">
          <span>{preview.pageCount} page{preview.pageCount === 1 ? '' : 's'}</span><span aria-hidden>&middot;</span><span>{preview.size}</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-700"><LockKeyhole className="size-3.5" aria-hidden />Local preview</span>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-canvas p-3">
          <PdfPreviewFrame title={`PDF preview: ${preview.name}`} url={preview.url} />
        </div>
      </aside>
    </div>
  )
}
