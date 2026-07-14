import { beforeEach, describe, expect, it } from 'vitest'

import {
  applyPreferences,
  defaultPreferences,
  loadPreferences,
  savePreferences,
} from './preferences'

describe('application preferences', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.lang = 'en'
  })

  it('loads safe defaults when nothing has been saved', () => {
    expect(loadPreferences()).toEqual(defaultPreferences)
  })

  it('applies theme and language preferences to the document', () => {
    applyPreferences({ ...defaultPreferences, theme: 'dark', language: 'hi' })

    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.lang).toBe('hi')
  })

  it('persists complete preferences for the next visit', () => {
    const preferences = { ...defaultPreferences, theme: 'dark' as const, usageAnalytics: true }
    savePreferences(preferences)

    expect(loadPreferences()).toEqual(preferences)
  })
})
