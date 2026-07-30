# PdfDocs

PdfDocs is a privacy-focused React application for merging, splitting, previewing, and compressing PDF files directly in the browser. All currently available PDF tools work without an account and process document contents on the user's device.

Repository: [Rahman-SR/Pdf-Toolkit](https://github.com/Rahman-SR/Pdf-Toolkit)

## Available features

### PDF tools

- **Merge PDF** — add several PDFs, preview each file, reorder the queue, create one merged document, and download it only after processing finishes.
- **Split PDF** — preview a PDF, select individual pages or ranges, and create one combined selection or separate PDF downloads.
- **Compress PDF** — preview the source, choose a compression level, remove metadata, optionally optimize page images, compare the exact output size, and download the result explicitly.
- **Local processing** — the implemented workflows use `pdf-lib`, `pdfjs-dist`, Canvas, and browser object URLs without intentionally uploading PDF contents to an application server.

### Application

- Public landing page and all implemented PDF tools work without login.
- Email-only sign-up and sign-in with Supabase Auth.
- Email confirmation, password recovery, and authenticated password changes.
- Protected dashboard, tools, settings, and profile routes.
- Editable profile metadata and persistent local preferences.
- Appearance, language, notification, and privacy settings.
- Responsive public navigation, workspace sidebar, and mobile navigation.
- Light and dark appearance modes.

## Usage limits

PdfDocs currently applies browser-side daily limits:

| Access | Tasks per day | Processing per day | Per-file rule | Merge batch |
| --- | ---: | ---: | --- | ---: |
| Guest | 5 | 100 MB | Every PDF must be smaller than 50 MB | 100 MB |
| Signed in | 10 | 200 MB | One PDF up to 100 MB once per day; other files must be smaller than 50 MB | 100 MB |

Oversized files display a clear validation message before processing starts. Usage counters are stored in browser `localStorage`, so these limits are product guidance rather than a security or billing boundary. Authoritative cross-device enforcement will require a trusted server-side usage service and database policies.

Paid subscriptions are not available yet. Any professional-plan pricing shown in the interface is a future preview and does not collect payment.

## Technology

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Supabase Auth
- `pdf-lib` for PDF document operations
- `pdfjs-dist` for previews and image-based compression
- Lucide React icons
- Vitest and Testing Library

## Local development

### Requirements

- Node.js 20.19+, 22.12+, or a newer supported release
- npm

### Setup

```bash
git clone https://github.com/Rahman-SR/Pdf-Toolkit.git
cd Pdf-Toolkit
npm install
```

Create the local environment file:

```powershell
Copy-Item .env.example .env.local
```

On macOS or Linux:

```bash
cp .env.example .env.local
```

Start the development server:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

On Windows systems where PowerShell blocks `npm.ps1`, use `npm.cmd`:

```powershell
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

The public PDF tools work without Supabase credentials. Authentication pages show a setup notice until Supabase is configured.

## Environment variables

Copy `.env.example` to `.env.local` and provide only browser-safe values:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
VITE_SITE_URL=http://127.0.0.1:5173
```

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL from the project Connect dialog |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key |
| `VITE_SITE_URL` | Application origin used to create authentication callback URLs |

Never place `sb_secret_`, `service_role`, private keys, database passwords, or other server credentials in a `VITE_` variable or commit them to this repository. Restart Vite after changing `.env.local`.

See [Supabase Auth setup](docs/SUPABASE_AUTH_SETUP.md) for dashboard configuration, redirect URLs, password security, SMTP, and production notes.

## Routes

### Public routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page and public tool entry points |
| `/pricing` | Current access limits and future plan preview |
| `/free-tools/merge` | Public Merge workspace |
| `/free-tools/split` | Public Split workspace |
| `/free-tools/compress` | Public Compress workspace |
| `/login` | Email sign-in and sign-up |
| `/forgot-password` | Request a password recovery link |
| `/update-password` | Set a password from a recovery session |
| `/auth/callback` | Supabase email confirmation callback |

### Signed-in workspace routes

| Route | Purpose |
| --- | --- |
| `/dashboard` | Workspace overview |
| `/tools` | Available and roadmap tools |
| `/tools/merge` | Signed-in Merge workspace |
| `/tools/split` | Signed-in Split workspace |
| `/tools/compress` | Signed-in Compress workspace |
| `/settings` | Appearance, language, notification, privacy, and account settings |
| `/profile` | Profile and account metadata |
| `/change-password` | Verify the current password and choose a new one |

## Project structure

```text
public/
  pdfdocs-hero-user-v1.png    Landing-page hero artwork
src/
  app/                        Router, protected routes, and route tests
  components/                 Shared public and workspace layout components
  config/                     Shared PDF tool catalog and visual metadata
  features/
    auth/                     Supabase session provider and auth context
    pdf-tools/                Merge, Split, Compress, preview, and quota UI
  lib/                        PDF processing, preferences, quota, auth, and Supabase helpers
  pages/                      Route-level pages
  test/                       Test setup and generated PDF fixtures
docs/
  SUPABASE_AUTH_SETUP.md      Supabase dashboard and redirect configuration
```

## Quality checks

```bash
npm run lint
npm test
npm run build
```

The test suite covers authentication and route protection, password flows, settings and profile changes, free-access limits, PDF merging, page extraction, split downloads, compression behavior, and explicit download confirmation.

## PDF processing notes

- Selected files remain in browser memory for the active workflow.
- Temporary preview object URLs are revoked when previews change or workspaces close.
- Merge and Compress create a result before showing a separate Download button.
- Split processes and downloads the selected output after confirmation.
- Image optimization rasterizes pages to JPEG. It may flatten searchable text, forms, links, annotations, and vector detail.
- Compression compares available candidates and keeps the smallest result so it does not intentionally return a file larger than the original.

## Security and privacy

- `.env.local`, dependencies, build output, coverage, logs, and editor files are ignored by Git.
- Only a Supabase publishable key belongs in frontend configuration.
- Passwords are sent directly to Supabase Auth and are not stored by PdfDocs.
- Google and other social providers are not used by the application.
- Recovery password forms require a Supabase `PASSWORD_RECOVERY` session.
- Authenticated password changes verify the current password and revoke other refresh-token sessions.
- React route protection is a user-experience boundary, not database authorization.
- Any future database tables must enable Row Level Security and enforce ownership with the authenticated user ID.

## Deployment

`vercel.json` rewrites application routes to `index.html` so the Vite SPA can handle direct route loads.

1. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SITE_URL` to the hosting provider.
2. Set `VITE_SITE_URL` to the deployed HTTPS origin.
3. Add the production `/auth/callback` and `/update-password` URLs to Supabase Authentication URL Configuration.
4. Run `npm run build`.
5. Deploy the generated `dist` directory.

## Roadmap

Rotate, Reorder, Delete Pages, Extract, Watermark, Page Numbers, and JPG to PDF are marked as coming soon. Their cards are navigation previews only and do not currently process files.
