import { PDFDocument } from 'pdf-lib'

// Public data contracts for PDF processing operations.
export type PageRange = { from: number; to: number }
export type PdfBytes = Uint8Array | ArrayBuffer
export type PdfCompressionOptions = {
  imageOptimization?: boolean
  level?: number
  removeMetadata?: boolean
}
export type PdfCompressionResult = {
  bytes: Uint8Array
  imageOptimizationApplied: boolean
  imageOptimizationError?: string
}

// Core document operations. These functions contain no UI or fixture data.
export async function mergePdfDocuments(inputs: PdfBytes[]) {
  if (inputs.length < 2) {
    throw new Error('At least two PDF documents are required.')
  }

  const output = await PDFDocument.create()

  for (const input of inputs) {
    const source = await PDFDocument.load(input)
    const pages = await output.copyPages(source, source.getPageIndices())
    pages.forEach((page) => output.addPage(page))
  }

  return output.save()
}

export async function extractPdfPages(input: PdfBytes, pageNumbers: number[]) {
  if (!pageNumbers.length) {
    throw new Error('Select at least one page.')
  }

  const source = await PDFDocument.load(input)
  validatePageNumbers(pageNumbers, source.getPageCount())

  const output = await PDFDocument.create()
  const pages = await output.copyPages(source, pageNumbers.map((page) => page - 1))
  pages.forEach((page) => output.addPage(page))
  return output.save()
}

export async function splitPdfByRanges(input: PdfBytes, ranges: PageRange[]) {
  if (!ranges.length) {
    throw new Error('Add at least one page range.')
  }

  const pageCount = await getPdfPageCount(input)
  ranges.forEach((range) => validateRange(range, pageCount))

  return Promise.all(ranges.map((range) => extractPdfPages(input, pagesInRange(range))))
}

export async function compressPdfDocument(input: PdfBytes, options: PdfCompressionOptions = {}): Promise<PdfCompressionResult> {
  const original = input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(input.slice(0))
  const candidates: Array<{ bytes: Uint8Array; imageOptimizationApplied: boolean }> = [
    { bytes: original, imageOptimizationApplied: false },
  ]
  const document = await PDFDocument.load(original)

  if (options.removeMetadata) {
    document.setTitle('')
    document.setAuthor('')
    document.setSubject('')
    document.setKeywords([])
    document.setCreator('')
    document.setProducer('')
  }

  const structurallyOptimized = await document.save({ addDefaultPage: false, useObjectStreams: true, updateFieldAppearances: false })
  candidates.push({ bytes: structurallyOptimized, imageOptimizationApplied: false })

  let imageOptimizationError: string | undefined
  if (options.imageOptimization) {
    try {
      const { rasterizePdfForCompression } = await import('./pdf-raster-compression')
      const rasterized = await rasterizePdfForCompression(original, options.level ?? 50)
      candidates.push({ bytes: rasterized, imageOptimizationApplied: true })
    } catch (error) {
      imageOptimizationError = error instanceof Error ? error.message : 'Image optimization failed.'
    }
  }

  const smallest = candidates.reduce((current, candidate) => (
    candidate.bytes.byteLength < current.bytes.byteLength ? candidate : current
  ))

  return { ...smallest, imageOptimizationError }
}

export async function getPdfPageCount(input: PdfBytes) {
  const document = await PDFDocument.load(input)
  return document.getPageCount()
}

export function pagesInRange({ from, to }: PageRange) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}

// Browser adapters keep file input and download details out of the core operations.
export async function readFileBytes(file: File) {
  if (typeof file.arrayBuffer === 'function') {
    return new Uint8Array(await file.arrayBuffer())
  }

  return new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}.`))
    reader.readAsArrayBuffer(file)
  })
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

// Internal validation helpers provide consistent page-boundary errors.
function validateRange(range: PageRange, pageCount: number) {
  if (!Number.isInteger(range.from) || !Number.isInteger(range.to) || range.from < 1 || range.to < range.from || range.to > pageCount) {
    throw new Error(`Page range must be between 1 and ${pageCount}.`)
  }
}

function validatePageNumbers(pageNumbers: number[], pageCount: number) {
  pageNumbers.forEach((page) => {
    if (!Number.isInteger(page) || page < 1 || page > pageCount) {
      throw new Error(`Page numbers must be between 1 and ${pageCount}.`)
    }
  })
}
