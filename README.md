# PDF Toolkit

PDF Toolkit is a privacy-focused React application for merging, splitting, previewing, and compressing PDF files directly in the browser. The core PDF workflows run on the user's device and do not require an account.

Repository: [Rahman-SR/Pdf-Toolkit](https://github.com/Rahman-SR/Pdf-Toolkit)

## Current features

### PDF tools

- **Merge PDF** — add multiple PDFs, preview individual files, preserve queue order, create one merged document, and download it explicitly.
- **Split PDF** — preview a PDF, select individual pages or page ranges, and export one combined selection or separate PDF files.
- **Compress PDF** — preview the source, choose a compression level, remove metadata, optionally optimize page images, compare the exact result size, and download the optimized file.
- **Local processing** — common PDF operations use `pdf-lib`, `pdfjs-dist`, canvas, and browser object URLs without uploading documents to an application server.

### Application experience

- Public landing page with Merge, Split, and Compress available without login.
- Responsive authenticated dashboard and tools directory.
- Email/password sign-up and sign-in through Supabase Auth.
- Google OAuth entry point and callback handling.
- Password recovery and password update flows.
- Protected dashboard, tools, settings, and profile routes.
- Editable profile metadata and persistent appearance, language, notification, and privacy preferences.
- Responsive desktop sidebar and mobile navigation.
- Light and dark appearance settings.

### Free-plan limits

Anonymous visitors and signed-in users without paid-plan metadata receive:

- 5 successful PDF tasks per local calendar day.
- 50 MB maximum per file.
- Web-only access.

The current quota is stored in browser `localStorage`, so it is a client-side product limit for this web build. Production-grade enforcement across browsers or devices requires a server-side usage table or API, authenticated user ownership, and database policies.

## Technology

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Supabase Auth
- `pdf-lib` for PDF document operations
- `pdfjs-dist` for PDF rendering and image-based compression
- Lucide React icons
- Vitest and Testing Library

## Run locally

### Requirements

- Node.js 20.19+, 22.12+, or a newer supported release
- npm

### Installation

```bash
git clone https://github.com/Rahman-SR/Pdf-Toolkit.git
cd Pdf-Toolkit
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env.local
```

On macOS or Linux:

```bash
cp .env.example .env.local
```

Start Vite:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

The public PDF tools work without Supabase credentials. Authentication pages display a setup notice until Supabase is configured.

## Environment variables

Copy the safe placeholders from `.env.example` and add values only to `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
VITE_SITE_URL=http://127.0.0.1:5173
```

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL from the project Connect dialog. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase publishable key. |
| `VITE_SITE_URL` | Application origin used to build safe auth callback URLs. |

Only use a Supabase publishable key in frontend `VITE_` variables. Never add `sb_secret_`, `service_role`, private keys, or other server credentials to this repository.

After changing `.env.local`, restart Vite because environment variables are read at startup. See [Supabase Auth setup](docs/SUPABASE_AUTH_SETUP.md) for callback URLs, email authentication, Google OAuth, and production security notes.

## Routes

### Public

| Route | Purpose |
| --- | --- |
| `/` | Landing page and public tool entry points |
| `/pricing` | Plan comparison |
| `/free-tools/merge` | Public Merge workspace |
| `/free-tools/split` | Public Split workspace |
| `/free-tools/compress` | Public Compress workspace |
| `/login` | Sign in and sign up |
| `/forgot-password` | Request a recovery link |
| `/update-password` | Set a new password from a recovery session |
| `/auth/callback` | Supabase OAuth callback |

### Authenticated workspace

| Route | Purpose |
| --- | --- |
| `/dashboard` | Workspace overview |
| `/tools` | Tools directory |
| `/tools/merge` | Authenticated Merge workspace |
| `/tools/split` | Authenticated Split workspace |
| `/tools/compress` | Authenticated Compress workspace |
| `/settings` | Appearance, language, notification, privacy, and account settings |
| `/profile` | Profile and account metadata |

## Project structure

```text
src/
  app/                    Router, protected routes, and interaction tests
  components/             Shared public and workspace layout components
  config/                 Shared PDF tool catalog
  features/
    auth/                  Supabase session provider and auth context
    pdf-tools/             Merge, Split, Compress, preview, and quota UI
  lib/                     PDF processing, compression, preferences, quota, and Supabase client
  pages/                   Route-level pages
  test/                    Test setup and generated PDF fixtures
docs/
  SUPABASE_AUTH_SETUP.md   Supabase dashboard and redirect configuration
```

## Quality checks

```bash
npm run lint
npm test
npm run build
```

`npm test` covers route protection, authentication interactions, settings, profile updates, free-plan limits, PDF merging, page extraction, split downloads, compression behavior, and download confirmation.

## PDF processing notes

- Files are held in browser memory only for the active workflow.
- Object URLs used for previews are revoked when previews or workspaces close.
- Merge and Compress create a result before showing a separate Download button.
- Split downloads the selected output after processing.
- Image optimization rasterizes PDF pages to JPEG. It can reduce image-heavy files, but searchable text, selectable text, forms, links, annotations, and vector detail may be flattened in the optimized output.
- Compression always compares the original, structural optimization, and optional image optimization candidates, then preserves the smallest result so a compressed file is not intentionally larger than its source.

## Security and privacy

- `.env.local`, build output, dependencies, logs, and coverage are ignored by Git.
- The repository must contain only the Supabase publishable key placeholder, never a real secret key.
- The React route guard is a user-experience boundary, not database authorization.
- Any future user-data or usage tables must enable Row Level Security and enforce ownership using the authenticated user's ID.
- Client-side Free-plan limits are not a security boundary; authoritative billing enforcement belongs on a trusted backend.

## Deployment

The included `vercel.json` rewrites application routes to `index.html` for client-side routing. For a production deployment:

1. Add the three `VITE_` environment variables to the hosting provider.
2. Set `VITE_SITE_URL` to the deployed HTTPS origin.
3. Add the production `/auth/callback` and `/update-password` URLs to Supabase Authentication URL Configuration.
4. Run `npm run build` and deploy the generated `dist` directory.

## Roadmap

The interface currently labels Rotate, Reorder, Delete Pages, Extract, Watermark, Page Numbers, and JPG to PDF as coming soon. Those cards are UI placeholders and are not yet processing tools.
