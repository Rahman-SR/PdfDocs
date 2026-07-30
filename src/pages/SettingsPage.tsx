import { Bell, Check, Languages, Palette, Shield, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import {
  applyPreferences,
  loadPreferences,
  savePreferences,
  type AppPreferences,
  type DateFormat,
  type InterfaceLanguage,
  type ThemePreference,
} from '../lib/preferences'

// Settings navigation is data-driven so sidebar and panel labels cannot drift.
const settingsSections = [
  { icon: Palette, label: 'Appearance' },
  { icon: Languages, label: 'Language' },
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Privacy' },
  { icon: UserRound, label: 'Account' },
] as const

type SettingsSection = (typeof settingsSections)[number]['label']

export function SettingsPage() {
  // Draft preferences remain local until the user explicitly saves them.
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<AppPreferences>(() => loadPreferences())
  const [savedPreferences, setSavedPreferences] = useState<AppPreferences>(() => loadPreferences())
  const [activeSection, setActiveSection] = useState<SettingsSection>('Appearance')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    applyPreferences(preferences)
    if (!preferences.syncSystem || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const applySystemTheme = () => applyPreferences(preferences)
    mediaQuery.addEventListener('change', applySystemTheme)
    return () => mediaQuery.removeEventListener('change', applySystemTheme)
  }, [preferences])

  const updatePreferences = (changes: Partial<AppPreferences>) => {
    setPreferences((current) => ({ ...current, ...changes }))
    setNotice(null)
  }

  const selectTheme = (theme: ThemePreference) => updatePreferences({ theme, syncSystem: false })

  const handleCancel = () => {
    setPreferences(savedPreferences)
    applyPreferences(savedPreferences)
    setNotice('Unsaved changes discarded.')
  }

  const handleSave = () => {
    savePreferences(preferences)
    setSavedPreferences(preferences)
    setNotice('Settings saved on this device.')
  }

  const showPreferenceActions = activeSection !== 'Account'

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-1">
          {settingsSections.map(({ icon: Icon, label }) => <button key={label} type="button" onClick={() => { setActiveSection(label); setNotice(null) }} aria-pressed={activeSection === label} className={`flex min-h-13 w-full items-center gap-3 rounded-xl border px-5 text-left text-sm font-medium soft-shadow ${activeSection === label ? 'border-line bg-white text-primary' : 'border-transparent text-[#333b49] hover:bg-white'}`}><Icon className="size-5" aria-hidden />{label}</button>)}
        </aside>

        <div>
          {activeSection === 'Appearance' && <AppearancePanel preferences={preferences} selectTheme={selectTheme} updatePreferences={updatePreferences} />}
          {activeSection === 'Language' && <LanguagePanel preferences={preferences} updatePreferences={updatePreferences} />}
          {activeSection === 'Notifications' && <NotificationsPanel preferences={preferences} updatePreferences={updatePreferences} />}
          {activeSection === 'Privacy' && <PrivacyPanel preferences={preferences} updatePreferences={updatePreferences} />}
          {activeSection === 'Account' && <AccountPanel email={user?.email ?? 'Not configured'} />}

          {showPreferenceActions && <div className="mt-6 flex flex-wrap items-center justify-end gap-3">{notice && <span className="mr-auto text-xs text-emerald-700" aria-live="polite">{notice}</span>}<button onClick={handleCancel} type="button" className="min-h-11 rounded-lg border border-line bg-white px-5 text-sm font-medium">Cancel</button><button onClick={handleSave} type="button" className="min-h-11 rounded-lg bg-primary px-5 text-sm font-medium text-white">Save Settings</button></div>}
        </div>
      </div>
    </main>
  )
}

// Appearance, language, notification, privacy, and account panels.
function AppearancePanel({ preferences, selectTheme, updatePreferences }: { preferences: AppPreferences; selectTheme: (theme: ThemePreference) => void; updatePreferences: (changes: Partial<AppPreferences>) => void }) {
  return <SettingsCard title="Appearance" description="Customize how PdfDocs looks on this device."><div className="mt-8 grid gap-5 sm:grid-cols-2"><ThemeOption label="Light Mode" selected={!preferences.syncSystem && preferences.theme === 'light'} onSelect={() => selectTheme('light')} dark={false} /><ThemeOption label="Dark Mode" selected={!preferences.syncSystem && preferences.theme === 'dark'} onSelect={() => selectTheme('dark')} dark /></div><div className="mt-8 border-t border-line pt-7"><SwitchSetting label="Sync with system" description="Follow your operating system's light or dark appearance." value={preferences.syncSystem} onChange={(syncSystem) => updatePreferences({ syncSystem })} /></div></SettingsCard>
}

function LanguagePanel({ preferences, updatePreferences }: { preferences: AppPreferences; updatePreferences: (changes: Partial<AppPreferences>) => void }) {
  return <SettingsCard title="Language" description="Choose your interface language metadata and preferred date format."><div className="mt-8 grid gap-5 sm:grid-cols-2"><SelectField label="Interface Language" value={preferences.language} onChange={(value) => updatePreferences({ language: value as InterfaceLanguage })}><option value="en">English</option><option value="hi">Hindi</option><option value="es">Spanish</option></SelectField><SelectField label="Date Format" value={preferences.dateFormat} onChange={(value) => updatePreferences({ dateFormat: value as DateFormat })}><option value="day-first">DD/MM/YYYY</option><option value="month-first">MM/DD/YYYY</option><option value="iso">YYYY-MM-DD</option></SelectField></div></SettingsCard>
}

function NotificationsPanel({ preferences, updatePreferences }: { preferences: AppPreferences; updatePreferences: (changes: Partial<AppPreferences>) => void }) {
  return <SettingsCard title="Notifications" description="Control completion messages and optional sounds."><div className="mt-8 divide-y divide-line rounded-xl border border-line"><div className="p-5"><SwitchSetting label="Completion notifications" description="Show a message when a PDF operation finishes." value={preferences.completionNotifications} onChange={(completionNotifications) => updatePreferences({ completionNotifications })} /></div><div className="p-5"><SwitchSetting label="Notification sounds" description="Play a sound for completed operations when supported." value={preferences.notificationSounds} onChange={(notificationSounds) => updatePreferences({ notificationSounds })} /></div></div></SettingsCard>
}

function PrivacyPanel({ preferences, updatePreferences }: { preferences: AppPreferences; updatePreferences: (changes: Partial<AppPreferences>) => void }) {
  return <SettingsCard title="Privacy" description="Review local-processing and data-retention preferences."><div className="mt-8 divide-y divide-line rounded-xl border border-line"><div className="p-5"><SwitchSetting label="Clear recent activity on exit" description="Do not retain recent workflow names between browser sessions." value={preferences.clearHistoryOnExit} onChange={(clearHistoryOnExit) => updatePreferences({ clearHistoryOnExit })} /></div><div className="p-5"><SwitchSetting label="Anonymous usage statistics" description="Allow anonymous product analytics. PDF contents are never included." value={preferences.usageAnalytics} onChange={(usageAnalytics) => updatePreferences({ usageAnalytics })} /></div></div></SettingsCard>
}

function AccountPanel({ email }: { email: string }) {
  return <SettingsCard title="Account" description="Manage account access and personal information."><div className="mt-8 rounded-xl border border-line p-5"><p className="text-xs font-medium uppercase tracking-wider text-muted">Signed-in email</p><p className="mt-2 text-sm font-medium">{email}</p><div className="mt-6 flex flex-wrap gap-3"><Link to="/profile" className="inline-flex min-h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white">Edit profile</Link><Link to="/change-password" className="inline-flex min-h-10 items-center rounded-lg border border-line bg-white px-5 text-sm font-medium">Change password</Link></div></div></SettingsCard>
}

// Reusable settings layout and form controls.
function SettingsCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-line bg-white p-6 soft-shadow sm:p-8"><h1 className="font-display text-3xl font-medium tracking-[-0.025em]">{title}</h1><p className="mt-2 text-sm text-muted">{description}</p>{children}</section>
}

function ThemeOption({ label, selected, onSelect, dark }: { label: string; selected: boolean; onSelect: () => void; dark: boolean }) {
  return <button data-theme-preview type="button" onClick={onSelect} aria-pressed={selected} className={`rounded-xl border-2 p-4 text-left transition ${selected ? 'border-primary' : 'border-transparent hover:border-line'}`}><div className={`grid aspect-[16/8] place-items-center rounded-lg ${dark ? 'bg-[#202c3b]' : 'bg-[#f0f1f4]'}`}><div className={`h-16 w-3/4 rounded-md p-3 ${dark ? 'bg-[#3b485c]' : 'bg-white shadow-sm'}`}><div className={`h-2 w-1/2 rounded-full ${dark ? 'bg-[#59687d]' : 'bg-[#dfe3e9]'}`} /><div className={`mt-2 h-1.5 rounded-full ${dark ? 'bg-[#59687d]' : 'bg-[#e9ecf0]'}`} /></div></div><div className="mt-4 flex items-center justify-between text-sm font-medium"><span>{label}</span><span className={`grid size-5 place-items-center rounded-full border-2 ${selected ? 'border-primary text-primary' : 'border-[#c4cad4]'}`}>{selected && <Check className="size-3" aria-hidden />}</span></div></button>
}

function SwitchSetting({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-5"><div><p className="text-sm font-medium">{label}</p><p className="mt-1 text-xs leading-5 text-muted">{description}</p></div><button type="button" onClick={() => onChange(!value)} aria-label={label} aria-pressed={value} className={`relative h-7 w-12 shrink-0 rounded-full transition ${value ? 'bg-primary' : 'bg-[#d9dde4]'}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${value ? 'left-6' : 'left-1'}`} /></button></div>
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label><span className="mb-2 block text-xs font-medium uppercase tracking-[0.06em] text-[#333b49]">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="precision-input">{children}</select></label>
}
