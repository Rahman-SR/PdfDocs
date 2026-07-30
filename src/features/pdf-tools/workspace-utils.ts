import { loadPreferences } from '../../lib/preferences'
import { getPdfPageCount, readFileBytes } from '../../lib/pdf-processing'

// File validation and display helpers shared by every PDF workspace.
export function isPdfFile(file: File) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export function formatFileSize(bytes: number) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export function createPdfObjectUrl(bytes: Uint8Array) {
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
  return URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
}

// Shared source preparation keeps Split and Compress preview behavior identical.
export async function preparePdfPreview(file: File, previousUrl: string | null) {
  const bytes = await readFileBytes(file)
  const pageCount = await getPdfPageCount(bytes)
  const url = createPdfObjectUrl(bytes)

  if (previousUrl) URL.revokeObjectURL(previousUrl)

  return { bytes, pageCount, url }
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Please try a different PDF.'
}

// Completion feedback respects the notification preferences saved on this device.
export function notifyCompletion(message: string, setNotice: (notice: string | null) => void) {
  const preferences = loadPreferences()
  setNotice(preferences.completionNotifications ? message : null)

  if (!preferences.notificationSounds || typeof window.AudioContext !== 'function') return

  const audioContext = new window.AudioContext()
  const oscillator = audioContext.createOscillator()
  const gain = audioContext.createGain()

  oscillator.connect(gain)
  gain.connect(audioContext.destination)
  oscillator.frequency.value = 660
  gain.gain.setValueAtTime(0.04, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12)
  oscillator.addEventListener('ended', () => void audioContext.close(), { once: true })
  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.12)
}
