import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export type PageRange = { from: number; to: number }
export type PdfBytes = Uint8Array | ArrayBuffer

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

export async function getPdfPageCount(input: PdfBytes) {
  const document = await PDFDocument.load(input)
  return document.getPageCount()
}

export async function createDemoPdf(pageCount: number, title: string) {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error('A PDF must contain at least one page.')
  }

  const document = await PDFDocument.create()
  const font = await document.embedFont(StandardFonts.Helvetica)
  const boldFont = await document.embedFont(StandardFonts.HelveticaBold)

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = document.addPage([595, 842])
    page.drawText(title, { x: 48, y: 770, size: 18, font: boldFont, color: rgb(0.04, 0.25, 0.52) })
    page.drawText(`Sample document - page ${pageNumber} of ${pageCount}`, { x: 48, y: 735, size: 11, font })
    page.drawText('Created locally by PDF Toolkit for testing.', { x: 48, y: 705, size: 10, font, color: rgb(0.35, 0.39, 0.45) })
    page.drawText(String(pageNumber), { x: 286, y: 36, size: 10, font, color: rgb(0.35, 0.39, 0.45) })
  }

  return document.save()
}

export function pagesInRange({ from, to }: PageRange) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}

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
