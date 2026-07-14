import { Route, Routes } from 'react-router-dom'

import { DashboardLayout } from '../components/DashboardLayout'
import { PublicLayout } from '../components/PublicLayout'
import { AuthCallbackPage } from '../pages/AuthCallbackPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PasswordResetPage } from '../pages/PasswordResetPage'
import { PricingPage } from '../pages/PricingPage'
import { ProfilePage } from '../pages/ProfilePage'
import { SettingsPage } from '../pages/SettingsPage'
import { ToolsPage } from '../pages/ToolsPage'
import { ToolWorkspacePage } from '../pages/ToolWorkspacePage'
import { UpdatePasswordPage } from '../pages/UpdatePasswordPage'
import { ProtectedRoute } from './ProtectedRoute'

export function App() {
  return (
    <Routes>
      {/* Public pages and local PDF tools do not require authentication. */}
      <Route element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="free-tools/merge" element={<ToolWorkspacePage mode="merge" />} />
        <Route path="free-tools/split" element={<ToolWorkspacePage mode="split" />} />
        <Route path="free-tools/compress" element={<ToolWorkspacePage mode="compress" />} />
      </Route>

      {/* Authentication and password-recovery routes. */}
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<PasswordResetPage />} />
      <Route path="update-password" element={<UpdatePasswordPage />} />
      <Route path="auth/callback" element={<AuthCallbackPage />} />

      {/* Signed-in workspace routes share the dashboard navigation shell. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="tools/merge" element={<ToolWorkspacePage mode="merge" />} />
          <Route path="tools/split" element={<ToolWorkspacePage mode="split" />} />
          <Route path="tools/compress" element={<ToolWorkspacePage mode="compress" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Unknown paths fall back to a single not-found page. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
