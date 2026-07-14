export type ThemePreference = 'light' | 'dark'
export type InterfaceLanguage = 'en' | 'hi' | 'es'
export type DateFormat = 'day-first' | 'month-first' | 'iso'

export interface AppPreferences {
  theme: ThemePreference
  syncSystem: boolean
  language: InterfaceLanguage
  dateFormat: DateFormat
  completionNotifications: boolean
  notificationSounds: boolean
  clearHistoryOnExit: boolean
  usageAnalytics: boolean
}

export const defaultPreferences: AppPreferences = {
  theme: 'light',
  syncSystem: false,
  language: 'en',
  dateFormat: 'day-first',
  completionNotifications: true,
  notificationSounds: false,
  clearHistoryOnExit: true,
  usageAnalytics: false,
}

const storageKey = 'pdf-toolkit-preferences'

export function loadPreferences(): AppPreferences {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return stored ? { ...defaultPreferences, ...JSON.parse(stored) as Partial<AppPreferences> } : { ...defaultPreferences }
  } catch {
    return { ...defaultPreferences }
  }
}

export function savePreferences(preferences: AppPreferences) {
  window.localStorage.setItem(storageKey, JSON.stringify(preferences))
  applyPreferences(preferences)
}

export function applyPreferences(preferences: AppPreferences) {
  const systemPrefersDark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
  const effectiveTheme = preferences.syncSystem ? (systemPrefersDark ? 'dark' : 'light') : preferences.theme
  document.documentElement.classList.toggle('dark', effectiveTheme === 'dark')
  document.documentElement.dataset.theme = effectiveTheme
  document.documentElement.lang = preferences.language
}

export function initializePreferences() {
  const applyStored = () => applyPreferences(loadPreferences())
  applyStored()

  if (typeof window.matchMedia === 'function') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyStored)
  }
  window.addEventListener('storage', applyStored)
}
