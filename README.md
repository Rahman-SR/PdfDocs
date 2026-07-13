# PDF Toolkit

A privacy-first PDF Toolkit SaaS foundation built with React, TypeScript, Vite,
Tailwind CSS, and Supabase Auth.

The current build includes:

- Responsive landing page and dashboard foundation
- Email/password sign-up and sign-in
- Google OAuth entry point and callback handling
- Password recovery and password update flows
- Verified session bootstrap with `supabase.auth.getUser()`
- Protected `/dashboard` and `/settings` routes
- Safe internal redirects after authentication
- Dark-mode responsive styling
- Focused route-protection tests

PDF operations are intentionally represented as the next build phase. The product
requirements prioritize client-side PDF processing, so those tools should use
`pdf-lib` and `pdfjs-dist` without uploading documents whenever possible.

## Start locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:5173`.

The app builds without Supabase credentials and displays an explicit setup notice
on the auth page. Live authentication requires the environment variables below.

## Environment variables

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
VITE_SITE_URL=http://localhost:5173
```

Only use a Supabase publishable key in `VITE_` variables. Never place a secret key
or legacy `service_role` key in frontend code.

See [docs/SUPABASE_AUTH_SETUP.md](docs/SUPABASE_AUTH_SETUP.md) for the dashboard
configuration and Google provider setup.

## Quality checks

```bash
npm run lint
npm test
npm run build
```

## Route security

The React router guard prevents unauthenticated navigation in the browser and
restores the originally requested page after login. It is a user-experience layer,
not a database authorization boundary. Every future user-data table must enable
Row Level Security and scope policies to the authenticated user's ID.
