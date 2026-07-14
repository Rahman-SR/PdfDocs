import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { PDFDocument } from 'pdf-lib'

import { getPdfCompressionProfile } from './pdf-compression-profile'

GlobalWorkerOptions.workerSrc = pdfWorkerUrl

export async function rasterizePdfForCompression(input: Uint8Array, level: number) {
  const loadingTask = getDocument({ data: new Uint8Array(input) })
  const source = await loadingTask.promise
  const output = await PDFDocument.create()
  const { jpegQuality, renderScale } = getPdfCompressionProfile(level)

  try {
    for (let pageNumber = 1; pageNumber <= source.numPages; pageNumber += 1) {
      const sourcePage = await source.getPage(pageNumber)
      const pageViewport = sourcePage.getViewport({ scale: 1 })
      const renderViewport = sourcePage.getViewport({ scale: renderScale })
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.ceil(renderViewport.width))
      canvas.height = Math.max(1, Math.ceil(renderViewport.height))

      const context = canvas.getContext('2d', { alpha: false })
      if (!context) throw new Error('Canvas rendering is not available in this browser.')

      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      await sourcePage.render({ canvas, canvasContext: context, viewport: renderViewport, background: '#ffffff' }).promise

      const jpegBytes = new Uint8Array(await (await canvasToJpeg(canvas, jpegQuality)).arrayBuffer())
      const image = await output.embedJpg(jpegBytes)
      const outputPage = output.addPage([pageViewport.width, pageViewport.height])
      outputPage.drawImage(image, { x: 0, y: 0, width: pageViewport.width, height: pageViewport.height })

      canvas.width = 1
      canvas.height = 1
      sourcePage.cleanup()
    }

    return output.save({ addDefaultPage: false, useObjectStreams: true, updateFieldAppearances: false })
  } finally {
    await loadingTask.destroy()
  }
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('The browser could not encode the optimized page image.'))
    }, 'image/jpeg', quality)
  })
}
