import { BarChart3, Check, CreditCard, Link2, LoaderCircle, Pencil, UserRound } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'
import { supabase } from '../lib/supabase'

const profileSections = [
  { icon: UserRound, label: 'Personal Info' },
  { icon: CreditCard, label: 'Subscription' },
  { icon: BarChart3, label: 'Data Usage' },
  { icon: Link2, label: 'Connected Accounts' },
] as const

type ProfileSection = (typeof profileSections)[number]['label']

export function ProfilePage({ embedded = false }: { embedded?: boolean }) {
  // Profile fields initialize from authenticated metadata only.
  const { user } = useAuth()
  const initialName = (user?.user_metadata.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'Account'
  const [fullName, setFullName] = useState(initialName)
  const initialTimezone = (user?.user_metadata.timezone as string | undefined) ?? 'Asia/Calcutta (IST)'
  const [timezone, setTimezone] = useState(initialTimezone)
  const [savedProfile, setSavedProfile] = useState({ fullName: initialName, timezone: initialTimezone })
  const [activeSection, setActiveSection] = useState<ProfileSection>('Personal Info')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Saving validates locally before updating Supabase account metadata.
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const normalizedName = fullName.trim()
    if (normalizedName.length < 2) {
      setSaveStatus('error')
      setSaveMessage('Enter a name with at least two characters.')
      return
    }
    if (!supabase || !user) {
      setSaveStatus('error')
      setSaveMessage('Sign in again before saving profile changes.')
      return
    }

    setSaveStatus('saving')
    setSaveMessage(null)
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: normalizedName, timezone } })
    if (error) {
      setSaveStatus('error')
      setSaveMessage(error.message)
      return
    }

    const savedName = (data.user.user_metadata.full_name as string | undefined) ?? normalizedName
    const savedTimezone = (data.user.user_metadata.timezone as string | undefined) ?? timezone
    setFullName(savedName)
    setTimezone(savedTimezone)
    setSavedProfile({ fullName: savedName, timezone: savedTimezone })
    setSaveStatus('saved')
    setSaveMessage('Profile saved to your account.')
  }

  const cancelChanges = () => {
    setFullName(savedProfile.fullName)
    setTimezone(savedProfile.timezone)
    setSaveStatus('idle')
    setSaveMessage('Unsaved profile changes discarded.')
  }

  // The same profile content can render as a page or inside Settings.
  const content = (
    <>
      <h1 className="font-display text-4xl font-semibold tracking-[-0.035em]">User Profile</h1>
      <p className="mt-2 text-base text-muted">Manage your account settings, subscription, and data usage.</p>
      <div className={`${embedded ? 'mt-6' : 'mt-9'} grid overflow-hidden rounded-xl border border-line bg-white soft-shadow ${embedded ? '' : 'lg:grid-cols-[260px_1fr]'}`}>
        <aside className={`${embedded ? 'flex flex-wrap gap-1 border-b' : 'border-b lg:border-b-0 lg:border-r'} border-line p-4`}>
          {profileSections.map(({ icon: Icon, label }) => (
            <button key={label} type="button" onClick={() => setActiveSection(label)} aria-pressed={activeSection === label} className={`${embedded ? 'min-w-40 flex-1' : 'mb-1 w-full'} flex min-h-12 items-center gap-3 rounded-lg px-4 text-left text-sm font-medium ${activeSection === label ? 'bg-[#eef3fd] text-primary' : 'text-[#333b49] hover:bg-[#f3f4f5]'}`}><Icon className="size-5" />{label}</button>
          ))}
        </aside>
        {activeSection === 'Personal Info' ? <section className="p-6 sm:p-9">
          <h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Personal Information</h2>
          <div className="mt-8 flex items-center gap-5">
            <span className="relative grid size-24 place-items-center rounded-full border-4 border-[#e3e8ef] bg-primary text-2xl font-semibold text-white">{fullName.slice(0, 2).toUpperCase()}<span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-primary text-white shadow-md"><Pencil className="size-4" /></span></span>
            <div><p className="font-display text-xl font-medium">{fullName}</p><p className="mt-1 text-sm text-muted">Signed-in account</p></div>
          </div>
          <form onSubmit={handleSubmit} className={`mt-10 grid gap-5 ${embedded ? 'xl:grid-cols-2' : 'sm:grid-cols-2'}`}>
            <Field label="Full Name"><input required minLength={2} value={fullName} onChange={(event) => { setFullName(event.target.value); setSaveStatus('idle'); setSaveMessage(null) }} className="precision-input" /></Field>
            <Field label="Email Address"><input readOnly value={user?.email ?? 'Not configured'} className="precision-input bg-[#f5f6f7]" /></Field>
            <Field label="Timezone"><select value={timezone} onChange={(event) => { setTimezone(event.target.value); setSaveStatus('idle'); setSaveMessage(null) }} className="precision-input"><option>Asia/Calcutta (IST)</option><option>UTC</option><option>Pacific Time (PT)</option></select></Field>
            <Field label="Account"><input readOnly value="Signed-in user" className="precision-input bg-[#f5f6f7]" /></Field>
            <div className={`flex flex-wrap items-center justify-end gap-3 ${embedded ? 'xl:col-span-2' : 'sm:col-span-2'}`}>{saveMessage && <span className={`mr-auto inline-flex items-center gap-1 text-xs ${saveStatus === 'error' ? 'text-red-700' : 'text-emerald-700'}`} aria-live="polite">{saveStatus === 'saved' && <Check className="size-4" />}{saveMessage}</span>}<button onClick={cancelChanges} className="min-h-10 rounded-lg border border-line bg-white px-5 text-sm font-medium" type="button">Cancel</button><button disabled={saveStatus === 'saving'} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary-strong disabled:cursor-wait disabled:opacity-70" type="submit">{saveStatus === 'saving' && <LoaderCircle className="size-4 animate-spin" aria-hidden />}{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</button></div>
          </form>
        </section> : <ProfileSectionPanel section={activeSection} email={user?.email ?? 'Not configured'} />}
      </div>
    </>
  )

  return embedded ? <div>{content}</div> : <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">{content}</main>
}

// Secondary panels avoid showing plan or usage values that are not backed by stored data.
function ProfileSectionPanel({ section, email }: { section: Exclude<ProfileSection, 'Personal Info'>; email: string }) {
  if (section === 'Subscription') {
    return <section className="p-6 sm:p-9"><h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Subscription</h2><p className="mt-2 text-sm text-muted">Billing is not connected to this workspace yet.</p><div className="mt-8 rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs uppercase tracking-wider text-muted">Plan status</p><p className="mt-2 font-display text-2xl font-medium">No billing plan linked</p><Link to="/pricing" className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white">View plans</Link></div></section>
  }

  if (section === 'Data Usage') {
    return <section className="p-6 sm:p-9"><h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Data Usage</h2><p className="mt-2 text-sm text-muted">PDF processing is local and this workspace does not currently store usage totals.</p><div className="mt-8 rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs uppercase tracking-wider text-muted">Tracking status</p><p className="mt-2 font-display text-2xl font-medium">Not collected</p><p className="mt-2 text-sm leading-6 text-muted">Document names, contents, and processed file sizes remain outside your account data.</p></div></section>
  }

  return <section className="p-6 sm:p-9"><h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Connected Accounts</h2><p className="mt-2 text-sm text-muted">Accounts currently associated with this workspace.</p><div className="mt-8 rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs uppercase tracking-wider text-muted">Primary account</p><p className="mt-2 text-sm font-medium">{email}</p><p className="mt-2 text-xs text-emerald-700">Connected</p></div></section>
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[0.06em] text-[#333b49]">{label}</span>{children}</label>
}
