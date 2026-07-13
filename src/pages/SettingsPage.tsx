import { Bell, Languages, Palette, Shield, UserRound } from 'lucide-react'
import { useState } from 'react'

const settingsSections = [
  { icon: Palette, label: 'Appearance' },
  { icon: Languages, label: 'Language' },
  { icon: Bell, label: 'Notifications' },
  { icon: Shield, label: 'Privacy' },
  { icon: UserRound, label: 'Account' },
] as const

type SettingsSection = (typeof settingsSections)[number]['label']

const sectionDescriptions: Record<Exclude<SettingsSection, 'Appearance'>, string> = {
  Language: 'Language and regional formatting controls will appear here.',
  Notifications: 'Choose how PDF Toolkit should notify you about completed workflows.',
  Privacy: 'Review local-processing and data-retention preferences.',
  Account: 'Manage account-level security and workspace preferences.',
}

export function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [syncSystem, setSyncSystem] = useState(false)
  const [savedSettings, setSavedSettings] = useState<{ theme: 'light' | 'dark'; syncSystem: boolean }>({ theme: 'light', syncSystem: false })
  const [activeSection, setActiveSection] = useState<SettingsSection>('Appearance')
  const [saved, setSaved] = useState(false)

  const selectTheme = (value: 'light' | 'dark') => {
    setTheme(value)
    setSaved(false)
  }

  const handleCancel = () => {
    setTheme(savedSettings.theme)
    setSyncSystem(savedSettings.syncSystem)
    setSaved(false)
  }

  const handleSave = () => {
    setSavedSettings({ theme, syncSystem })
    setSaved(true)
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-1">
          {settingsSections.map(({ icon: Icon, label }) => <button key={label} type="button" onClick={() => setActiveSection(label)} aria-pressed={activeSection === label} className={`flex min-h-13 w-full items-center gap-3 rounded-xl border px-5 text-left text-sm font-medium soft-shadow ${activeSection === label ? 'border-line bg-white text-primary' : 'border-transparent text-[#333b49] hover:bg-white'}`}><Icon className="size-5" />{label}</button>)}
        </aside>
        <div>
          {activeSection === 'Appearance' ? <section className="rounded-xl border border-line bg-white p-6 soft-shadow sm:p-8">
            <h1 className="font-display text-3xl font-medium tracking-[-0.025em]">Appearance</h1>
            <p className="mt-2 text-sm text-muted">Customize how PDF Toolkit looks on your device.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <ThemeOption label="Light Mode" selected={theme === 'light'} onSelect={() => selectTheme('light')} dark={false} />
              <ThemeOption label="Dark Mode" selected={theme === 'dark'} onSelect={() => selectTheme('dark')} dark />
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-line pt-7">
              <div><p className="font-display text-lg font-medium">Sync with system</p><p className="mt-1 text-sm text-muted">Automatically switch between light and dark themes.</p></div>
              <button type="button" onClick={() => { setSyncSystem((value) => !value); setSaved(false) }} aria-label="Sync theme with system" aria-pressed={syncSystem} className={`relative h-7 w-12 rounded-full transition ${syncSystem ? 'bg-primary' : 'bg-[#d9dde4]'}`}><span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${syncSystem ? 'left-6' : 'left-1'}`} /></button>
            </div>
          </section> : <section className="rounded-xl border border-line bg-white p-6 soft-shadow sm:p-8"><h1 className="font-display text-3xl font-medium tracking-[-0.025em]">{activeSection}</h1><p className="mt-2 text-sm text-muted">{sectionDescriptions[activeSection]}</p><p className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-primary">This section is visible and ready for its account-backed controls in the next implementation milestone.</p></section>}
          {activeSection === 'Appearance' && <div className="mt-6 flex items-center justify-end gap-3">{saved && <span className="mr-auto text-xs text-emerald-700" aria-live="polite">Preferences saved for this session.</span>}<button onClick={handleCancel} type="button" className="min-h-11 rounded-lg border border-line bg-white px-5 text-sm font-medium">Cancel</button><button onClick={handleSave} type="button" className="min-h-11 rounded-lg bg-primary px-5 text-sm font-medium text-white">{saved ? 'Changes Saved' : 'Save Changes'}</button></div>}
        </div>
      </div>
    </main>
  )
}

function ThemeOption({ label, selected, onSelect, dark }: { label: string; selected: boolean; onSelect: () => void; dark: boolean }) {
  return <button type="button" onClick={onSelect} aria-pressed={selected} className={`rounded-xl border-2 p-4 text-left transition ${selected ? 'border-primary' : 'border-transparent hover:border-line'}`}><div className={`grid aspect-[16/8] place-items-center rounded-lg ${dark ? 'bg-[#202c3b]' : 'bg-[#f0f1f4]'}`}><div className={`h-16 w-3/4 rounded-md p-3 ${dark ? 'bg-[#3b485c]' : 'bg-white shadow-sm'}`}><div className={`h-2 w-1/2 rounded-full ${dark ? 'bg-[#59687d]' : 'bg-[#dfe3e9]'}`} /><div className={`mt-2 h-1.5 rounded-full ${dark ? 'bg-[#59687d]' : 'bg-[#e9ecf0]'}`} /></div></div><div className="mt-4 flex items-center justify-between text-sm font-medium"><span>{label}</span><span className={`grid size-5 place-items-center rounded-full border-2 ${selected ? 'border-primary text-primary' : 'border-[#c4cad4]'}`}>{selected && '✓'}</span></div></button>
}
