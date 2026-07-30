import { Link } from 'react-router-dom'

interface BrandProps {
  compact?: boolean
  premium?: boolean
}

// Shared product mark used by both public and authenticated layouts.
export function Brand({ compact = false, premium = false }: BrandProps) {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-3 rounded-xl text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
      aria-label="PdfDocs home"
    >
      <span className="relative shrink-0">
        {premium && <span className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-60 blur-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-95" />}
        <span className={`relative grid place-items-center overflow-hidden rounded-xl text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-105 ${premium ? 'size-10 border border-white/65 bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-700 shadow-[0_0_24px_rgba(37,99,235,0.55)]' : 'size-9 bg-primary shadow-sm shadow-primary/20'}`}>
          {premium && <span className="absolute inset-x-1 top-0 h-1/2 rounded-full bg-white/20 blur-sm" />}
          <svg className="relative size-6 drop-shadow-sm" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M7 4.5h7l3 3V18a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M14 4.5V8h3.5M8.5 11h5.5M8.5 14h7M8.5 17H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 7.5H3.5A1.5 1.5 0 0 0 2 9v9.5A3.5 3.5 0 0 0 5.5 22H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".75" />
          </svg>
        </span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-[16px] font-bold tracking-[-0.03em] ${premium ? 'bg-gradient-to-r from-cyan-200 via-white to-violet-200 bg-clip-text text-transparent' : ''}`}>PdfDocs</span>
          {premium && <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">Private PDF workspace</span>}
        </span>
      )}
    </Link>
  )
}
