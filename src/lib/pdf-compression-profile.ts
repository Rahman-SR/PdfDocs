export type PdfCompressionProfile = {
  jpegQuality: number
  renderScale: number
}

export function getPdfCompressionProfile(level: number): PdfCompressionProfile {
  const normalizedLevel = Math.min(100, Math.max(0, Number.isFinite(level) ? level : 50)) / 100

  return {
    jpegQuality: 0.9 - normalizedLevel * 0.5,
    renderScale: 1.65 - normalizedLevel * 0.75,
  }
}
