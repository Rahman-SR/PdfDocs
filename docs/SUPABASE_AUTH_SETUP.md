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

The reset flow sends users to `/update-password`, where the authenticated recovery
session can update the password.

## 4. Google OAuth

1. Create an OAuth web application in Google Auth Platform.
2. Add this Google authorized redirect URI:
   `https://<project-ref>.supabase.co/auth/v1/callback`
3. In **Supabase → Authentication → Providers → Google**, enable Google and add
   the Google client ID and secret.
4. Keep the application `/auth/callback` URL in the Supabase redirect allow list.

The Google secret belongs in Supabase, not in this Vite application.

## 5. Production security follow-up

- Keep breached-password protection and appropriate rate limits enabled.
- Use a custom SMTP provider before production email volume grows.
- Enable RLS on every exposed user-data table.
- Combine `TO authenticated` with ownership checks such as
  `(select auth.uid()) = user_id`; the role alone does not enforce ownership.
- Give update policies both `USING` and `WITH CHECK` predicates.
- Run the Supabase Security Advisor after adding tables or policies.

No database tables are required for the current auth-only milestone. Dashboard
history and usage tables should be introduced through reviewed migrations with
explicit Data API grants and RLS policies.
