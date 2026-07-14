import { describe, expect, it } from 'vitest'

import { getPdfCompressionProfile } from './pdf-compression-profile'

describe('PDF compression profile', () => {
  it('uses fewer pixels and lower JPEG quality at Extreme', () => {
    const low = getPdfCompressionProfile(0)
    const recommended = getPdfCompressionProfile(50)
    const extreme = getPdfCompressionProfile(100)

    expect(extreme.renderScale).toBeLessThan(recommended.renderScale)
    expect(recommended.renderScale).toBeLessThan(low.renderScale)
    expect(extreme.jpegQuality).toBeLessThan(recommended.jpegQuality)
    expect(recommended.jpegQuality).toBeLessThan(low.jpegQuality)
  })

  it('clamps slider values to the supported range', () => {
    expect(getPdfCompressionProfile(-20)).toEqual(getPdfCompressionProfile(0))
    expect(getPdfCompressionProfile(130)).toEqual(getPdfCompressionProfile(100))
  })
})
