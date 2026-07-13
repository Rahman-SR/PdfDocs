import { describe, expect, it } from 'vitest'

import { getSafeRedirect } from './auth-redirect'

describe('getSafeRedirect', () => {
  it('allows an internal application path', () => {
    expect(getSafeRedirect('/settings')).toBe('/settings')
  })

  it('rejects an absolute URL', () => {
    expect(getSafeRedirect('https://example.com')).toBe('/dashboard')
  })

  it('rejects a protocol-relative URL', () => {
    expect(getSafeRedirect('//example.com')).toBe('/dashboard')
  })
})
