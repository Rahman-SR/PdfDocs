# Supabase Auth setup

The frontend integration is complete, but it needs a dedicated Supabase project
before live authentication can be exercised.

## 1. Connect the project

In the Supabase dashboard, open the project's **Connect** dialog and copy:

- Project URL → `VITE_SUPABASE_URL`
- Publishable key (`sb_publishable_...`) → `VITE_SUPABASE_PUBLISHABLE_KEY`

Create `.env.local` from `.env.example`. Do not use a secret or `service_role` key.

## 2. Configure URL settings

In **Authentication → URL Configuration**, set:

- Local Site URL: `http://localhost:5173`
- Local Redirect URLs:
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/update-password`
- Production Site URL: the final HTTPS Vercel domain
- Production Redirect URLs: the matching `/auth/callback` and
  `/update-password` URLs on that domain

Set `VITE_SITE_URL` to the deployed HTTPS origin in Vercel. Preview deployments
need matching allow-listed redirect URLs if authentication is tested there.

## 3. Email/password

Email authentication is enabled by default on hosted Supabase projects. Hosted
projects also require email confirmation by default. The app handles both cases:
it enters the dashboard immediately if sign-up returns a session, otherwise it
asks the user to confirm their email.

Keep **Confirm email** enabled. In **Authentication → Sign In / Providers**:

- Keep Email enabled.
- Disable Google and every other social provider.
- Set the minimum password length to at least 12.
- Require uppercase, lowercase, digits, and symbols.
- Enable **Require current password** for password changes.
- Enable leaked-password protection when the project plan supports it.

The reset flow sends users to `/update-password`. That page only accepts a
Supabase `PASSWORD_RECOVERY` session and clears its local recovery permission
after the password is changed.

Signed-in users can open `/change-password` from Settings. The app verifies the
current password, sends it to Supabase again with the password-change request,
and revokes other refresh-token sessions after success.

Google OAuth code and UI are intentionally absent. Disabling the Google provider
in the Supabase dashboard prevents direct API attempts from using it.

## 4. Production email delivery

Configure a custom SMTP provider before public launch. Supabase's default SMTP
service is intended for testing and can be restricted to organization members.
Test sign-up confirmation and recovery delivery with a non-team email address.

## 5. Production security follow-up

- Keep appropriate Auth rate limits enabled.
- Enable CAPTCHA protection for sign-up, sign-in, and recovery if abuse appears.
- Enable RLS on every exposed user-data table.
- Combine `TO authenticated` with ownership checks such as
  `(select auth.uid()) = user_id`; the role alone does not enforce ownership.
- Give update policies both `USING` and `WITH CHECK` predicates.
- Run the Supabase Security Advisor after adding tables or policies.

No database tables are required for the current auth-only milestone. Dashboard
history and usage tables should be introduced through reviewed migrations with
explicit Data API grants and RLS policies.

An Edge Function is not needed for email/password authentication. Supabase Auth
must receive and hash passwords directly; application Edge Functions should
never log, store, or proxy raw passwords.
