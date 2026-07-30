import type { User } from '@supabase/supabase-js'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { DashboardLayout } from '../components/DashboardLayout'
import { AuthContext } from '../features/auth/auth-context'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { PasswordResetPage } from '../pages/PasswordResetPage'
import { DashboardPage } from '../pages/DashboardPage'
import { ProfilePage } from '../pages/ProfilePage'
import { PricingPage } from '../pages/PricingPage'
import { SettingsPage } from '../pages/SettingsPage'
import { ToolWorkspacePage } from '../pages/ToolWorkspacePage'
import { ToolsPage } from '../pages/ToolsPage'
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage'
import { FREE_MAX_FILE_SIZE_BYTES, getUsagePlan, recordFreeTask } from '../lib/free-usage'
import { createPdfFile, createTestPdf } from '../test/pdf-fixtures'

const authMocks = vi.hoisted(() => ({
  resetPasswordForEmail: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  updateUser: vi.fn(),
}))

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { auth: authMocks },
}))

vi.mock('../lib/pdf-raster-compression', () => ({
  rasterizePdfForCompression: vi.fn(async (bytes: Uint8Array) => new Uint8Array(bytes)),
}))

const testUser = {
  id: 'test-user',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'owner@example.com',
  app_metadata: {},
  user_metadata: { full_name: 'Original Name', timezone: 'UTC' },
  created_at: '2026-01-01T00:00:00.000Z',
} as User

function renderAnonymousLoginPage() {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ isRecovery: false, status: 'anonymous', user: null }}>
        <LoginPage />
      </AuthContext.Provider>
    </MemoryRouter>,
  )
}

async function uploadAndMerge(user: ReturnType<typeof userEvent.setup>) {
  await user.upload(screen.getByLabelText('Choose PDF files'), await createMergeFiles())
  await user.click(screen.getByRole('button', { name: 'Merge PDF' }))
}

async function renderSplitWorkspace(
  user: ReturnType<typeof userEvent.setup>,
  pageCount: number,
) {
  render(<ToolWorkspacePage mode="split" />)
  await user.upload(
    screen.getByLabelText('Choose PDF to split'),
    await createUploadFile('Report.pdf', pageCount),
  )
}

describe('button interactions', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.lang = 'en'
    authMocks.signOut.mockReset()
    authMocks.signOut.mockResolvedValue({ error: null })
    authMocks.signInWithPassword.mockReset()
    authMocks.signInWithPassword.mockResolvedValue({ data: { user: testUser, session: {} }, error: null })
    authMocks.signUp.mockReset()
    authMocks.signUp.mockResolvedValue({ data: { user: testUser, session: null }, error: null })
    authMocks.resetPasswordForEmail.mockReset()
    authMocks.resetPasswordForEmail.mockResolvedValue({ error: null })
    authMocks.updateUser.mockReset()
    authMocks.updateUser.mockImplementation(async ({ data }: { data?: Record<string, unknown>; password?: string }) => ({
      data: { user: { ...testUser, user_metadata: { ...testUser.user_metadata, ...(data ?? {}) } } },
      error: null,
    }))
  })

  it('offers merge, split, and compress from the landing page without a login wall', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)

    expect(screen.getByRole('link', { name: /Merge PDF/ })).toHaveAttribute('href', '/free-tools/merge')
    expect(screen.getByRole('link', { name: /Split PDF/ })).toHaveAttribute('href', '/free-tools/split')
    expect(screen.getByRole('link', { name: /Compress PDF/ })).toHaveAttribute('href', '/free-tools/compress')
  })

  it('opens the public merge workspace for an anonymous visitor', () => {
    render(
      <MemoryRouter initialEntries={['/free-tools/merge']}>
        <AuthContext.Provider value={{ isRecovery: false, status: 'anonymous', user: null }}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Merge PDF Documents' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Merge Queue (0)' })).toBeInTheDocument()
    expect(screen.getByText('5 of 5 tasks left today')).toBeInTheDocument()
    expect(screen.getByText('Each PDF under 50 MB')).toBeInTheDocument()
    expect(screen.getByText('100 MB daily processing')).toBeInTheDocument()
    expect(screen.getByText('100 MB maximum merge batch')).toBeInTheDocument()
    expect(screen.getByText('Web only')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Welcome back' })).not.toBeInTheDocument()
  })

  it('rejects files larger than 50 MB before adding them to a free workspace', async () => {
    const user = userEvent.setup()
    const oversizedFile = new File([], 'Oversized.pdf', { type: 'application/pdf' })
    Object.defineProperty(oversizedFile, 'size', { value: FREE_MAX_FILE_SIZE_BYTES + 1 })
    render(<ToolWorkspacePage mode="merge" />)

    await user.upload(screen.getByLabelText('Choose PDF files'), oversizedFile)

    expect(screen.getByRole('heading', { name: 'Merge Queue (0)' })).toBeInTheDocument()
    expect(screen.getByText('Oversized.pdf must be smaller than 50 MB. Sign in to use one file up to 100 MB per day.')).toBeInTheDocument()
  })

  it('keeps a merge upload batch at or below 100 MB', async () => {
    const user = userEvent.setup()
    const first = new File([], 'First.pdf', { type: 'application/pdf' })
    const second = new File([], 'Second.pdf', { type: 'application/pdf' })
    const overflow = new File([], 'Overflow.pdf', { type: 'application/pdf' })
    Object.defineProperty(first, 'size', { value: 49 * 1024 * 1024 })
    Object.defineProperty(second, 'size', { value: 49 * 1024 * 1024 })
    Object.defineProperty(overflow, 'size', { value: 3 * 1024 * 1024 })
    render(<ToolWorkspacePage mode="merge" />)

    await user.upload(screen.getByLabelText('Choose PDF files'), [first, second])
    await user.upload(screen.getByLabelText('Choose PDF files'), overflow)

    expect(screen.getByRole('heading', { name: 'Merge Queue (2)' })).toBeInTheDocument()
    expect(screen.getByText('The merge queue cannot exceed 100 MB. Remove a file before adding more.')).toBeInTheDocument()
  })

  it('blocks a sixth task for an anonymous visitor', async () => {
    const user = userEvent.setup()
    for (let task = 0; task < 5; task += 1) recordFreeTask()
    render(<ToolWorkspacePage mode="merge" />)

    await uploadAndMerge(user)

    expect(screen.getByText('0 of 5 tasks left today')).toBeInTheDocument()
    expect(screen.getByText('You have used all 5 tasks for today. Try again tomorrow.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Download merged PDF/ })).not.toBeInTheDocument()
  })

  it('applies ten tasks and the large-file allowance to a signed-in free user', async () => {
    const user = userEvent.setup()
    const signedPlan = getUsagePlan(true, testUser.id)
    for (let task = 0; task < 10; task += 1) recordFreeTask(new Date(), signedPlan)
    render(
      <AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}>
        <ToolWorkspacePage mode="merge" />
      </AuthContext.Provider>,
    )

    expect(screen.getByText('0 of 10 tasks left today')).toBeInTheDocument()
    expect(screen.getByText('One 100 MB file daily: available')).toBeInTheDocument()
    await user.upload(screen.getByLabelText('Choose PDF files'), await createMergeFiles())
    await user.click(screen.getByRole('button', { name: 'Merge PDF' }))

    expect(screen.getByText('0 of 10 tasks left today')).toBeInTheDocument()
    expect(screen.getByText('You have used all 10 tasks for today. Try again tomorrow.')).toBeInTheDocument()
  })

  it('opens the tools directory from the dashboard button', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}>
          <Routes>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="tools" element={<p>Tools directory</p>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'View all tools' }))
    expect(screen.getByText('Tools directory')).toBeInTheDocument()
  })

  it('makes tool directory cards interactive with compact action labels', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><ToolsPage /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Open Merge tool' })).toHaveAttribute('href', '/tools/merge')
    expect(screen.getAllByText('Open tool')).toHaveLength(10)

    await user.click(screen.getByRole('button', { name: 'Rotate (coming soon)' }))
    expect(screen.getByRole('status')).toHaveTextContent('Rotate is coming soon.')
  })

  it('switches authentication mode and password visibility', async () => {
    const user = userEvent.setup()
    renderAnonymousLoginPage()

    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Google/i })).not.toBeInTheDocument()

    const password = screen.getByLabelText('Password', { selector: 'input' })
    await user.type(password, 'test-password')
    await user.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password')
  })

  it('creates accounts using email and a validated password only', async () => {
    const user = userEvent.setup()
    renderAnonymousLoginPage()

    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'Owner@Example.com')
    await user.type(screen.getByLabelText('Password', { selector: 'input' }), 'StrongPassword1!')
    await user.type(screen.getByLabelText('Confirm password'), 'StrongPassword1!')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    await waitFor(() => expect(authMocks.signUp).toHaveBeenCalledOnce())
    expect(authMocks.signUp).toHaveBeenCalledWith(expect.objectContaining({
      email: 'owner@example.com',
      password: 'StrongPassword1!',
    }))
    expect(await screen.findByText(/Check your email to confirm your account/)).toBeInTheDocument()
  })

  it('submits a password recovery request through the configured auth client', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><PasswordResetPage /></MemoryRouter>)

    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'owner@example.com')
    await user.click(screen.getByRole('button', { name: 'Send recovery link' }))

    expect(await screen.findByText('Check your inbox')).toBeInTheDocument()
    expect(authMocks.resetPasswordForEmail).toHaveBeenCalledOnce()
  })

  it('blocks mismatched passwords before updating the account', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isRecovery: true, status: 'authenticated', user: testUser }}>
          <UpdatePasswordPage />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('New password'), 'StrongPassword1!')
    await user.type(screen.getByLabelText('Confirm password'), 'StrongPassword2!')
    await user.click(screen.getByRole('button', { name: 'Save new password' }))

    expect(screen.getByText('The passwords do not match.')).toBeInTheDocument()
    expect(authMocks.updateUser).not.toHaveBeenCalled()
  })

  it('verifies the current password before an authenticated password change', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/change-password']}>
        <AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}>
          <Routes>
            <Route path="change-password" element={<UpdatePasswordPage mode="account" />} />
            <Route path="settings" element={<p>Settings page</p>} />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Current password'), 'OldPassword1!')
    await user.type(screen.getByLabelText('New password'), 'NewStrongPassword2!')
    await user.type(screen.getByLabelText('Confirm password'), 'NewStrongPassword2!')
    await user.click(screen.getByRole('button', { name: 'Save new password' }))

    await screen.findByText('Settings page')
    expect(authMocks.signInWithPassword).toHaveBeenCalledWith({
      email: 'owner@example.com',
      password: 'OldPassword1!',
    })
    expect(authMocks.updateUser).toHaveBeenCalledWith({
      current_password: 'OldPassword1!',
      email: 'owner@example.com',
      password: 'NewStrongPassword2!',
    })
    expect(authMocks.signOut).toHaveBeenCalledWith({ scope: 'others' })
  })

  it('shows the current guest and signed-in access limits without paid pricing', () => {
    render(<MemoryRouter><PricingPage /></MemoryRouter>)

    expect(screen.getByText('PdfDocs does not currently sell subscriptions. Signing in only raises your daily task and processing limits.')).toBeInTheDocument()
    expect(screen.getByText('Guest access')).toBeInTheDocument()
    expect(screen.getByText('Account access')).toBeInTheDocument()
    expect(screen.getByText('One file up to 100 MB once daily')).toBeInTheDocument()
    expect(screen.queryByText('₹999')).not.toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: 'Yearly billing' })).not.toBeInTheDocument()
  })

  it('clears uploaded files and reports an empty merge attempt', async () => {
    const user = userEvent.setup()
    render(<ToolWorkspacePage mode="merge" />)

    await user.upload(screen.getByLabelText('Choose PDF files'), await createMergeFiles())
    expect(screen.getByRole('heading', { name: 'Merge Queue (2)' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear all' }))

    expect(screen.getByRole('heading', { name: 'Merge Queue (0)' })).toBeInTheDocument()
    expect(screen.getByText(/No files in the queue/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Merge PDF' }))
    expect(screen.getByText('Add at least two PDF files before merging.')).toBeInTheDocument()
  })

  it('merges uploaded PDFs and waits for download confirmation', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ToolWorkspacePage mode="merge" />)

    await uploadAndMerge(user)

    expect(await screen.findByText('Merged 2 PDFs into 3 pages. Ready to download.')).toBeInTheDocument()
    expect(screen.getByText('4 of 5 tasks left today')).toBeInTheDocument()
    expect(download).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /Download merged PDF/ }))
    expect(download).toHaveBeenCalledOnce()
    expect(screen.getByText('Download started for your 3-page merged PDF.')).toBeInTheDocument()
    download.mockRestore()
  })

  it('opens and closes a slide-over preview from the merge queue', async () => {
    const user = userEvent.setup()
    render(<ToolWorkspacePage mode="merge" />)

    const report = await createUploadFile('Report.pdf', 2)
    await user.upload(screen.getByLabelText('Choose PDF files'), report)
    await user.click(screen.getByRole('button', { name: 'Preview Report.pdf' }))

    const preview = await screen.findByRole('dialog', { name: 'Preview Report.pdf' })
    expect(preview).toBeInTheDocument()
    expect(within(preview).getByTitle('PDF preview: Report.pdf')).toHaveAttribute('src', expect.stringContaining('blob:'))
    expect(within(preview).getByTitle('PDF preview: Report.pdf')).toHaveClass('aspect-square', 'max-w-[460px]')
    expect(within(preview).getByText('2 pages')).toBeInTheDocument()

    await user.click(within(preview).getByRole('button', { name: 'Close preview' }))
    expect(screen.queryByRole('dialog', { name: 'Preview Report.pdf' })).not.toBeInTheDocument()
  })

  it('honors the disabled completion-notification preference', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    window.localStorage.setItem('pdf-toolkit-preferences', JSON.stringify({ completionNotifications: false }))
    render(<ToolWorkspacePage mode="merge" />)

    await user.upload(screen.getByLabelText('Choose PDF files'), await createMergeFiles())
    await user.click(screen.getByRole('button', { name: 'Merge PDF' }))
    const downloadButton = await screen.findByRole('button', { name: /Download merged PDF/ })

    expect(screen.queryByText(/Merged 2 PDFs into 3 pages/)).not.toBeInTheDocument()
    expect(download).not.toHaveBeenCalled()

    await user.click(downloadButton)
    await waitFor(() => expect(download).toHaveBeenCalledOnce())
    download.mockRestore()
  })

  it('updates split selections and provides split feedback', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    await renderSplitWorkspace(user, 5)
    expect(await screen.findByTitle('Split preview: Report.pdf')).toHaveAttribute('src', expect.stringContaining('blob:'))
    expect(screen.getByTitle('Split preview: Report.pdf')).toHaveClass('aspect-square', 'max-w-[460px]')
    expect(screen.getByTitle('Split preview: Report.pdf').parentElement).toHaveClass('max-w-[500px]')

    const pageTwo = screen.getByRole('button', { name: 'Select page 2' })
    expect(pageTwo).toHaveAttribute('aria-pressed', 'false')
    await user.click(pageTwo)
    expect(pageTwo).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: '+ Add Range' }))
    expect(screen.getByText('Added pages 1 to 5.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Split PDF' }))
    expect(await screen.findByText('Created one PDF with 5 pages. Download started.')).toBeInTheDocument()
    expect(download).toHaveBeenCalledOnce()
    download.mockRestore()
  })

  it('downloads split selections as separate PDFs when requested', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    await renderSplitWorkspace(user, 2)
    await user.click(screen.getByRole('button', { name: 'Select page 2' }))
    await user.click(screen.getByRole('button', { name: 'Merge split selections into one file' }))
    await user.click(screen.getByRole('button', { name: 'Split PDF' }))

    expect(await screen.findByText('Created 2 separate PDFs. Downloads started.')).toBeInTheDocument()
    expect(download).toHaveBeenCalledTimes(2)
    download.mockRestore()
  })

  it('provides feedback when compression is requested', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ToolWorkspacePage mode="compress" />)

    expect(screen.getByRole('heading', { name: 'Select a PDF to compress' })).toBeInTheDocument()
    await user.upload(screen.getByLabelText('Choose PDF to compress'), await createUploadFile('Uploaded.pdf', 2))

    expect(await screen.findByTitle('Compression preview: Uploaded.pdf')).toHaveAttribute('src', expect.stringContaining('blob:'))
    expect(screen.getByText('Loaded Uploaded.pdf with 2 pages.')).toBeInTheDocument()

    const compressionSlider = screen.getByRole('slider', { name: 'Compression level' })
    fireEvent.change(compressionSlider, { target: { value: '100' } })
    expect(compressionSlider).toHaveValue('100')

    await user.click(screen.getByRole('button', { name: 'Compress' }))
    expect(await screen.findByText(/Optimized PDF ready to download/)).toBeInTheDocument()
    expect(download).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Download compressed PDF' }))
    expect(download).toHaveBeenCalledOnce()
    expect(screen.getByText('Compressed PDF download started.')).toBeInTheDocument()
    download.mockRestore()
  })

  it('switches settings and profile panels', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<MemoryRouter><AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}><SettingsPage /></AuthContext.Provider></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Language' }))
    expect(screen.getByRole('heading', { name: 'Language' })).toBeInTheDocument()
    unmount()

    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ isRecovery: false, status: 'anonymous', user: null }}>
          <ProfilePage />
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'Data Usage' }))
    expect(screen.getByRole('heading', { name: 'Data Usage' })).toBeInTheDocument()
  })

  it('applies and persists appearance, language, notification, and privacy settings', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}><SettingsPage /></AuthContext.Provider></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Dark Mode' }))
    expect(document.documentElement).toHaveClass('dark')
    await user.click(screen.getByRole('button', { name: 'Save Settings' }))
    expect(JSON.parse(window.localStorage.getItem('pdf-toolkit-preferences') ?? '{}')).toMatchObject({ theme: 'dark' })

    await user.click(screen.getByRole('button', { name: 'Language' }))
    await user.selectOptions(screen.getByRole('combobox', { name: 'Interface Language' }), 'hi')
    expect(document.documentElement.lang).toBe('hi')

    await user.click(screen.getByRole('button', { name: 'Notifications' }))
    const completionNotifications = screen.getByRole('button', { name: 'Completion notifications' })
    expect(completionNotifications).toHaveAttribute('aria-pressed', 'true')
    await user.click(completionNotifications)

    await user.click(screen.getByRole('button', { name: 'Privacy' }))
    await user.click(screen.getByRole('button', { name: 'Anonymous usage statistics' }))
    await user.click(screen.getByRole('button', { name: 'Save Settings' }))

    expect(JSON.parse(window.localStorage.getItem('pdf-toolkit-preferences') ?? '{}')).toMatchObject({
      language: 'hi',
      completionNotifications: false,
      usageAnalytics: true,
    })
  })

  it('saves profile metadata and exposes working account actions', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<MemoryRouter><AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}><SettingsPage /></AuthContext.Provider></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Account' }))
    expect(screen.getByRole('link', { name: 'Change password' })).toHaveAttribute('href', '/change-password')
    expect(screen.getByRole('link', { name: 'Edit profile' })).toHaveAttribute('href', '/profile')
    unmount()

    render(<MemoryRouter><AuthContext.Provider value={{ isRecovery: false, status: 'authenticated', user: testUser }}><ProfilePage /></AuthContext.Provider></MemoryRouter>)

    const name = screen.getByRole('textbox', { name: 'Full Name' })
    await user.clear(name)
    await user.type(name, 'Updated Name')
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Profile saved to your account.')).toBeInTheDocument()
    expect(authMocks.updateUser).toHaveBeenCalledWith({ data: { full_name: 'Updated Name', timezone: 'UTC' } })
  })

  it('exposes working dashboard actions and options', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthContext.Provider value={{ isRecovery: false, status: 'anonymous', user: null }}>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<p>Dashboard content</p>} />
            </Route>
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Help' })).toHaveAttribute('href', '/#faq')
    expect(screen.queryByRole('link', { name: 'New Project' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Upload PDF' })).toHaveAttribute('href', '/tools')

    const workspaceNavigation = screen.getByRole('navigation', { name: 'Workspace navigation' })
    expect(within(workspaceNavigation).getAllByRole('link').map((link) => link.textContent)).toEqual(['Dashboard', 'Tools', 'Settings', 'Profile', 'Help'])
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Open profile menu' }))
    const profileMenu = document.getElementById('profile-menu')
    expect(profileMenu).toBeInTheDocument()
    expect(within(profileMenu!).getByRole('link', { name: 'View profile' })).toHaveAttribute('href', '/profile')
    expect(within(profileMenu!).getByRole('button', { name: 'Logout' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'More options' }))
    const options = document.getElementById('workspace-options')
    expect(options).toBeInTheDocument()
    expect(within(options!).getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
    expect(within(options!).getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
  })
})

// PDF upload fixtures live below the behavior tests to keep setup reusable and explicit.
async function createUploadFile(filename: string, pageCount: number) {
  return createPdfFile(await createTestPdf(pageCount, filename.replace(/\.pdf$/i, '')), filename)
}

async function createMergeFiles() {
  return Promise.all([
    createUploadFile('Report.pdf', 2),
    createUploadFile('Appendix.pdf', 1),
  ])
}
