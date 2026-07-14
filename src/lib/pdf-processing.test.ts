import { PDFDocument } from 'pdf-lib'
import { describe, expect, it, vi } from 'vitest'

import {
  compressPdfDocument,
  downloadPdf,
  extractPdfPages,
  mergePdfDocuments,
  splitPdfByRanges,
} from './pdf-processing'

describe('PDF processing', () => {
  it('merges every page in document order', async () => {
    const first = await makePdf([310, 320])
    const second = await makePdf([410, 420, 430])

    const merged = await mergePdfDocuments([first, second])
    const document = await PDFDocument.load(merged)

    expect(document.getPageCount()).toBe(5)
    expect(document.getPages().map((page) => page.getWidth())).toEqual([310, 320, 410, 420, 430])
  })

  it('extracts requested pages in the requested order', async () => {
    const source = await makePdf([300, 400, 500])
    const extracted = await extractPdfPages(source, [3, 1])
    const document = await PDFDocument.load(extracted)

    expect(document.getPages().map((page) => page.getWidth())).toEqual([500, 300])
  })

  it('creates one output PDF for each valid range', async () => {
    const source = await makePdf([300, 310, 320, 330, 340])
    const outputs = await splitPdfByRanges(source, [{ from: 2, to: 4 }, { from: 5, to: 5 }])

    expect(outputs).toHaveLength(2)
    await expect(pageWidths(outputs[0]!)).resolves.toEqual([310, 320, 330])
    await expect(pageWidths(outputs[1]!)).resolves.toEqual([340])
  })

  it('rejects missing inputs and out-of-bounds selections', async () => {
    const source = await makePdf([300, 310])

    await expect(mergePdfDocuments([source])).rejects.toThrow('At least two PDF documents')
    await expect(extractPdfPages(source, [3])).rejects.toThrow('between 1 and 2')
    await expect(splitPdfByRanges(source, [{ from: 1, to: 3 }])).rejects.toThrow('between 1 and 2')
  })

  it('creates an optimized PDF while preserving every page', async () => {
    const source = await makePdf([300, 400, 500])
    const compressed = await compressPdfDocument(source, { removeMetadata: true })

    await expect(pageWidths(compressed.bytes)).resolves.toEqual([300, 400, 500])
    expect(compressed.bytes.byteLength).toBeLessThanOrEqual(source.byteLength)
  })

  it('starts a browser download with the requested PDF filename', () => {
    let requestedFilename = ''
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      requestedFilename = this.download
    })

    downloadPdf(new Uint8Array([37, 80, 68, 70]), 'merged-document.pdf')

    expect(click).toHaveBeenCalledOnce()
    expect(requestedFilename).toBe('merged-document.pdf')
    click.mockRestore()
  })
})

async function makePdf(widths: number[]) {
  const document = await PDFDocument.create()
  widths.forEach((width) => document.addPage([width, 700]))
  return document.save()
}

async function pageWidths(bytes: Uint8Array) {
  const document = await PDFDocument.load(bytes)
  return document.getPages().map((page) => page.getWidth())
}
