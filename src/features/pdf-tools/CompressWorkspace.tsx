import { CheckCircle2, Download, LoaderCircle, LockKeyhole, Minimize2 } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { compressPdfDocument, downloadPdf, getPdfPageCount, readFileBytes } from '../../lib/pdf-processing'
import { FreeUsageNotice, PdfPreviewFrame, PdfUploadEmptyState, SwitchRow } from './WorkspaceUi'
import { useFreeUsageQuota } from './useFreeUsageQuota'
import { createPdfObjectUrl, formatFileSize, getErrorMessage, isPdfFile } from './workspace-utils'

// Compression source and output are stored only for the active page session.
type CompressSource = {
  bytes: Uint8Array
  name: string
  pageCount: number
  sizeBytes: number
  url: string
}

type CompressedResult = {
  bytes: Uint8Array
  sizeBytes: number
}

export function CompressWorkspace() {
  // Source, compression settings, and result state.
  const quota = useFreeUsageQuota()
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)
  const [level, setLevel] = useState(50)
  const [removeMetadata, setRemoveMetadata] = useState(true)
  const [optimizeImages, setOptimizeImages] = useState(true)
  const [notice, setNotice] = useState<string | null>(null)
  const [source, setSource] = useState<CompressSource | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [compressedResult, setCompressedResult] = useState<CompressedResult | null>(null)

  // Local preview URLs are released when the workspace closes.
  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
  }, [])

  // File selection validates and prepares the source PDF without uploading it.
  const chooseCompressionSource = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!isPdfFile(file)) {
      setNotice('Choose a PDF file to preview and compress.')
      return
    }

    const fileLimitMessage = quota.validateFile(file)
    if (fileLimitMessage) {
      setNotice(fileLimitMessage)
      return
    }

    setPreviewLoading(true)
    setNotice('Opening your PDF locally...')

    try {
      const bytes = await readFileBytes(file)
      const pageCount = await getPdfPageCount(bytes)
      const url = createPdfObjectUrl(bytes)

      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = url
      setSource({ bytes, name: file.name, pageCount, sizeBytes: file.size, url })
      setCompressedResult(null)
      setNotice(`Loaded ${file.name} with ${pageCount} page${pageCount === 1 ? '' : 's'}.`)
    } catch (error) {
      setNotice(`Could not preview this PDF. ${getErrorMessage(error)}`)
    } finally {
      setPreviewLoading(false)
    }
  }

  // Compression never replaces the source; it creates a separate downloadable result.
  const compressDocument = async () => {
    if (!source) return

    if (!quota.canStartTask()) {
      setNotice(quota.dailyLimitMessage)
      return
    }

    setCompressing(true)
    setCompressedResult(null)
    setNotice('Optimizing your PDF on this device...')

    try {
      const result = await compressPdfDocument(source.bytes, {
        imageOptimization: optimizeImages,
        level,
        removeMetadata,
      })
      setCompressedResult({ bytes: result.bytes, sizeBytes: result.bytes.byteLength })
      quota.completeTask()

      const savedBytes = source.sizeBytes - result.bytes.byteLength
      const savedPercent = Math.max(0, Math.round((savedBytes / source.sizeBytes) * 100))

      if (result.imageOptimizationError && optimizeImages) {
        setNotice(`Image optimization was unavailable: ${result.imageOptimizationError}`)
      } else if (savedBytes > 0) {
        const method = result.imageOptimizationApplied ? 'Image-optimized' : 'Optimized'
        setNotice(`${method} PDF ready to download. Saved ${formatFileSize(savedBytes)} (${savedPercent}%).`)
      } else {
        setNotice('This PDF is already efficiently encoded. The original size was preserved.')
      }
    } catch (error) {
      setNotice(`Could not compress this PDF. ${getErrorMessage(error)}`)
    } finally {
      setCompressing(false)
    }
  }

  const downloadCompressedDocument = () => {
    if (!source || !compressedResult) return

    const baseName = source.name.replace(/\.pdf$/i, '')
    downloadPdf(compressedResult.bytes, `${baseName}-compressed.pdf`)
    setNotice('Compressed PDF download started.')
  }

  // Comparison values update as settings change, then switch to the exact result.
  const estimatedBytes = source ? Math.max(1024, Math.round(source.sizeBytes * (0.92 - level * 0.0055))) : 0
  const comparisonBytes = compressedResult?.sizeBytes ?? estimatedBytes
  const compressionTier = level < 34 ? 'low' : level < 67 ? 'recommended' : 'extreme'

  // Two-column layout keeps the preview and compression action visible together.
  return (
    <main className="grid min-h-[calc(100vh-4rem)] pb-20 min-[1180px]:grid-cols-[minmax(0,540px)_minmax(460px,1fr)] min-[1180px]:pb-0">
      <div className="px-5 py-8 sm:px-8 min-[1180px]:px-4">
        <section className="overflow-hidden rounded-xl border border-line bg-white soft-shadow">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">PDF preview</p>
              <h2 className="mt-1 truncate font-display text-lg font-medium">{source?.name ?? 'Choose a PDF to begin'}</h2>
            </div>
            {source && <button type="button" onClick={() => inputRef.current?.click()} disabled={previewLoading} className="min-h-10 rounded-lg border border-line bg-white px-4 text-sm font-medium text-primary transition hover:border-primary/30 hover:bg-blue-50 disabled:cursor-wait disabled:opacity-60">Choose another PDF</button>}
            <input ref={inputRef} aria-label="Choose PDF to compress" className="sr-only" type="file" accept="application/pdf" onChange={chooseCompressionSource} />
          </div>
          <div className="border-b border-line px-5 py-3 sm:px-6"><FreeUsageNotice isFreePlan={quota.isFreePlan} remainingTasks={quota.usage.remainingTasks} /></div>

          <div className="flex justify-center bg-canvas p-3 sm:p-5">
            {previewLoading ? (
              <div className="grid aspect-square w-full max-w-[500px] place-items-center rounded-xl border border-line bg-[#e9edf2] text-center text-muted">
                <div><LoaderCircle className="mx-auto size-8 animate-spin text-primary" aria-hidden /><p className="mt-3 text-sm">Preparing PDF preview...</p></div>
              </div>
            ) : source ? (
              <PdfPreviewFrame title={`Compression preview: ${source.name}`} url={source.url} />
            ) : (
              <PdfUploadEmptyState title="Select a PDF to compress" description="Choose a document to compare its size and tune the output quality." buttonLabel="Choose PDF" onChoose={() => inputRef.current?.click()} />
            )}
          </div>

          {source && (
            <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3 text-xs text-muted sm:px-6">
              <span>{source.pageCount} page{source.pageCount === 1 ? '' : 's'}</span><span aria-hidden>&middot;</span><span>{formatFileSize(source.sizeBytes)}</span>
              <span className="ml-auto inline-flex items-center gap-1.5 text-emerald-700"><LockKeyhole className="size-3.5" aria-hidden />Local preview</span>
            </div>
          )}
        </section>
      </div>

      <aside className="flex min-w-0 flex-col border-t border-line bg-white min-[1180px]:sticky min-[1180px]:top-16 min-[1180px]:h-[calc(100vh-4rem)] min-[1180px]:self-start min-[1180px]:overflow-hidden min-[1180px]:border-l min-[1180px]:border-t-0">
        <div className="shrink-0 border-b border-line px-6 py-4">
          <h1 className="font-display text-xl font-medium">Compress Settings</h1>
          <p className="mt-1 text-sm text-muted">Balance output quality and file size</p>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
          <section className="rounded-xl border border-line bg-white p-4 soft-shadow">
            <h2 className="font-display text-xl font-medium">Size Comparison</h2>
            <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
              <div className="rounded-xl bg-[#f3f4f5] p-3"><p className="text-xs text-muted">Original</p><p className="mt-1 font-display text-xl font-medium">{source ? formatFileSize(source.sizeBytes) : <>&mdash;</>}</p></div>
              <Minimize2 className="size-6 text-primary" aria-hidden />
              <div className="rounded-xl border border-blue-200 bg-[#d8e2ff] p-3"><p className="text-xs text-primary">{compressedResult ? 'Result' : 'Estimated'}</p><p className="mt-1 font-display text-xl font-medium">{source ? formatFileSize(comparisonBytes) : <>&mdash;</>}</p></div>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 className="size-4" aria-hidden />{compressedResult ? 'Optimized output ready' : source ? 'Estimate updates with compression level' : 'Choose a PDF to compare sizes'}</p>
          </section>

          <fieldset disabled={!source} className="rounded-xl border border-line bg-white p-4 soft-shadow disabled:opacity-55">
            <h2 className="font-display text-xl font-medium">Compression Level</h2>
            <input aria-label="Compression level" type="range" min="0" max="100" value={level} onChange={(event) => { setLevel(Number(event.target.value)); setCompressedResult(null); setNotice(null) }} className="mt-4 w-full accent-primary" />
            <div className="mt-1 grid grid-cols-3 text-center text-xs">
              <span className={compressionTier === 'low' ? 'font-medium text-primary' : ''}>Low<br /><small className="font-normal text-muted">Max quality</small></span>
              <span className={compressionTier === 'recommended' ? 'font-medium text-primary' : ''}>Recommended<br /><small className="font-normal text-muted">Balanced</small></span>
              <span className={compressionTier === 'extreme' ? 'font-medium text-primary' : ''}>Extreme<br /><small className="font-normal text-muted">Min size</small></span>
            </div>
            <div className="mt-4 space-y-3 border-t border-line pt-4">
              <SwitchRow label="Remove Metadata" value={removeMetadata} setValue={(value) => { setRemoveMetadata(value); setCompressedResult(null) }} />
              <SwitchRow label="Image Optimization" value={optimizeImages} setValue={(value) => { setOptimizeImages(value); setCompressedResult(null) }} />
              {optimizeImages && <p className="text-xs leading-5 text-muted">Pages are recompressed as images. Extreme uses the smallest size and lowest visual quality.</p>}
            </div>
          </fieldset>
        </div>

        <div className="shrink-0 border-t border-line bg-white p-4">
          <div className={`grid gap-3 ${compressedResult ? 'grid-cols-2' : ''}`}>
            <button onClick={() => void compressDocument()} disabled={!source || previewLoading || compressing} type="button" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-display text-base font-medium text-white shadow-lg shadow-primary/15 disabled:cursor-wait disabled:opacity-60">
              {compressing ? <LoaderCircle className="size-5 animate-spin" aria-hidden /> : <Minimize2 className="size-5" aria-hidden />}{compressing ? 'Compressing...' : compressedResult ? 'Compress again' : 'Compress'}
            </button>
            {compressedResult && <button onClick={downloadCompressedDocument} type="button" aria-label="Download compressed PDF" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 font-display text-base font-medium text-emerald-800 transition hover:bg-emerald-100"><Download className="size-5" aria-hidden />Download PDF</button>}
          </div>
          {notice && <p className="mt-2 text-center text-xs leading-5 text-muted" aria-live="polite">{notice}</p>}
        </div>
      </aside>
    </main>
  )
}
