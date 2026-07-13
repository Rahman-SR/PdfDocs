import { BarChart3, Check, CreditCard, Link2, Pencil, UserRound } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../features/auth/auth-context'

const profileSections = [
  { icon: UserRound, label: 'Personal Info' },
  { icon: CreditCard, label: 'Subscription' },
  { icon: BarChart3, label: 'Data Usage' },
  { icon: Link2, label: 'Connected Accounts' },
] as const

type ProfileSection = (typeof profileSections)[number]['label']

export function ProfilePage() {
  const { user } = useAuth()
  const initialName = (user?.user_metadata.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'Account Owner'
  const [fullName, setFullName] = useState(initialName)
  const [activeSection, setActiveSection] = useState<ProfileSection>('Personal Info')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSaved(true)
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 pb-24 sm:px-8 lg:px-10">
      <h1 className="font-display text-4xl font-semibold tracking-[-0.035em]">User Profile</h1>
      <p className="mt-2 text-base text-muted">Manage your account settings, subscription, and data usage.</p>
      <div className="mt-9 grid overflow-hidden rounded-xl border border-line bg-white soft-shadow lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-line p-4 lg:border-b-0 lg:border-r">
          {profileSections.map(({ icon: Icon, label }) => (
            <button key={label} type="button" onClick={() => setActiveSection(label)} aria-pressed={activeSection === label} className={`mb-1 flex min-h-12 w-full items-center gap-3 rounded-lg px-4 text-left text-sm font-medium ${activeSection === label ? 'bg-[#eef3fd] text-primary' : 'text-[#333b49] hover:bg-[#f3f4f5]'}`}><Icon className="size-5" />{label}</button>
          ))}
        </aside>
        {activeSection === 'Personal Info' ? <section className="p-6 sm:p-9">
          <h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Personal Information</h2>
          <div className="mt-8 flex items-center gap-5">
            <span className="relative grid size-24 place-items-center rounded-full border-4 border-[#e3e8ef] bg-primary text-2xl font-semibold text-white">{fullName.slice(0, 2).toUpperCase()}<span className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full bg-primary text-white shadow-md"><Pencil className="size-4" /></span></span>
            <div><p className="font-display text-xl font-medium">{fullName}</p><p className="mt-1 text-sm text-muted">Account owner</p></div>
          </div>
          <form onSubmit={handleSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
            <Field label="Full Name"><input value={fullName} onChange={(event) => { setFullName(event.target.value); setSaved(false) }} className="precision-input" /></Field>
            <Field label="Email Address"><input readOnly value={user?.email ?? 'Not configured'} className="precision-input bg-[#f5f6f7]" /></Field>
            <Field label="Timezone"><select className="precision-input"><option>Asia/Calcutta (IST)</option><option>UTC</option><option>Pacific Time (PT)</option></select></Field>
            <Field label="Role"><input readOnly value="Account Owner" className="precision-input bg-[#f5f6f7]" /></Field>
            <div className="flex items-center justify-end gap-3 sm:col-span-2">{saved && <span className="inline-flex items-center gap-1 text-xs text-emerald-700"><Check className="size-4" />Saved locally</span>}<button className="min-h-10 rounded-lg bg-primary px-5 text-sm font-medium text-white hover:bg-primary-strong" type="submit">Save Changes</button></div>
          </form>
        </section> : <ProfileSectionPanel section={activeSection} email={user?.email ?? 'Not configured'} />}
      </div>
    </main>
  )
}

function ProfileSectionPanel({ section, email }: { section: Exclude<ProfileSection, 'Personal Info'>; email: string }) {
  if (section === 'Subscription') {
    return <section className="p-6 sm:p-9"><h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Subscription</h2><p className="mt-2 text-sm text-muted">Review your current workspace plan and available upgrades.</p><div className="mt-8 rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs uppercase tracking-wider text-muted">Current plan</p><p className="mt-2 font-display text-2xl font-medium">Professional</p><Link to="/pricing" className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-white">View plans</Link></div></section>
  }

  if (section === 'Data Usage') {
    return <section className="p-6 sm:p-9"><h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Data Usage</h2><p className="mt-2 text-sm text-muted">Files processed locally will appear in your workspace activity.</p><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs text-muted">Processed</p><p className="mt-2 font-display text-3xl">0 MB</p></div><div className="rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs text-muted">Files</p><p className="mt-2 font-display text-3xl">0</p></div></div></section>
  }

  return <section className="p-6 sm:p-9"><h2 className="font-display text-3xl font-medium tracking-[-0.025em]">Connected Accounts</h2><p className="mt-2 text-sm text-muted">Accounts currently associated with this workspace.</p><div className="mt-8 rounded-xl border border-line bg-[#f7f8f9] p-6"><p className="text-xs uppercase tracking-wider text-muted">Primary account</p><p className="mt-2 text-sm font-medium">{email}</p><p className="mt-2 text-xs text-emerald-700">Connected</p></div></section>
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-medium uppercase tracking-[0.06em] text-[#333b49]">{label}</span>{children}</label>
}
