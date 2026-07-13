import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="page-grid grid min-h-screen place-items-center bg-paper px-5 text-center text-ink dark:bg-slate-950 dark:text-white">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-emerald-100 text-leaf dark:bg-emerald-950 dark:text-emerald-300">
          <FileQuestion className="size-7" aria-hidden />
        </span>
        <p className="mt-6 text-sm font-black uppercase tracking-[0.2em] text-leaf dark:text-emerald-400">404 error</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Page not found</h1>
        <p className="mt-3 text-ink/55 dark:text-slate-400">The page you requested does not exist.</p>
        <Link
          to="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-leaf px-5 py-2.5 font-extrabold text-white hover:bg-leaf-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}
