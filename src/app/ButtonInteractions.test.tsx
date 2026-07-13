import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { DashboardLayout } from '../components/DashboardLayout'
import { AuthContext } from '../features/auth/auth-context'
import { LandingPage } from '../pages/LandingPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SettingsPage } from '../pages/SettingsPage'
import { ToolWorkspacePage } from '../pages/ToolWorkspacePage'

describe('button interactions', () => {
  it('routes the landing-page upload control to the tools directory', () => {
    render(<MemoryRouter><LandingPage /></MemoryRouter>)

    expect(screen.getByRole('link', { name: 'Upload PDF' })).toHaveAttribute('href', '/tools')
  })

  it('clears the merge queue and reports an empty merge attempt', async () => {
    const user = userEvent.setup()
    render(<ToolWorkspacePage mode="merge" />)

    expect(screen.getByRole('heading', { name: 'Merge Queue (2)' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear all' }))

    expect(screen.getByRole('heading', { name: 'Merge Queue (0)' })).toBeInTheDocument()
    expect(screen.getByText(/No files in the queue/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Merge PDF' }))
    expect(screen.getByText('Add at least two PDF files before merging.')).toBeInTheDocument()
  })

  it('merges the ready-to-test sample PDFs and starts a download', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ToolWorkspacePage mode="merge" />)

    await user.click(screen.getByRole('button', { name: 'Merge PDF' }))

    expect(await screen.findByText('Merged 2 PDFs into 3 pages. Download started.')).toBeInTheDocument()
    expect(download).toHaveBeenCalledOnce()
    download.mockRestore()
  })

  it('updates split selections and provides split feedback', async () => {
    const user = userEvent.setup()
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    render(<ToolWorkspacePage mode="split" />)

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
    render(<ToolWorkspacePage mode="split" />)

    await user.click(screen.getByRole('button', { name: 'Select page 2' }))
    await user.click(screen.getByRole('button', { name: 'Merge split selections into one file' }))
    await user.click(screen.getByRole('button', { name: 'Split PDF' }))

    expect(await screen.findByText('Created 2 separate PDFs. Downloads started.')).toBeInTheDocument()
    expect(download).toHaveBeenCalledTimes(2)
    download.mockRestore()
  })

  it('provides feedback when compression is requested', async () => {
    const user = userEvent.setup()
    render(<ToolWorkspacePage mode="compress" />)

    await user.click(screen.getByRole('button', { name: 'Compress' }))
    expect(screen.getByText(/Compression processing is not implemented yet/)).toBeInTheDocument()
  })

  it('switches settings and profile panels', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<SettingsPage />)

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
    expect(screen.getByRole('link', { name: 'Upload PDF' })).toHaveAttribute('href', '/tools')

    await user.click(screen.getByRole('button', { name: 'More options' }))
    const options = document.getElementById('workspace-options')
    expect(options).toBeInTheDocument()
    expect(within(options!).getByRole('link', { name: 'Profile' })).toHaveAttribute('href', '/profile')
    expect(within(options!).getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/settings')
  })
})
