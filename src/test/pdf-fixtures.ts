import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

// Test-only fixture builder. Production workspaces never create placeholder PDFs.
export async function createTestPdf(pageCount: number, title = 'Test document') {
  if (!Number.isInteger(pageCount) || pageCount < 1) {
    throw new Error('A PDF fixture must contain at least one page.')
  }

  const document = await PDFDocument.create()
  const font = await document.embedFont(StandardFonts.Helvetica)
  const boldFont = await document.embedFont(StandardFonts.HelveticaBold)

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = document.addPage([595, 842])
    page.drawText(title, { x: 48, y: 770, size: 18, font: boldFont, color: rgb(0.04, 0.25, 0.52) })
    page.drawText(`Test page ${pageNumber} of ${pageCount}`, { x: 48, y: 735, size: 11, font })
    page.drawText(String(pageNumber), { x: 286, y: 36, size: 10, font, color: rgb(0.35, 0.39, 0.45) })
  }

  return document.save()
}

// Converts fixture bytes into the File objects used by browser upload controls.
export function createPdfFile(bytes: Uint8Array, filename: string) {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  return new File([data], filename, { type: 'application/pdf' })
}
