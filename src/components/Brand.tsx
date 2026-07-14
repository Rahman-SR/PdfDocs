import { FileText } from 'lucide-react'
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
      aria-label="PDF Toolkit home"
    >
      <span className="relative shrink-0">
        {premium && <span className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-violet-600 opacity-60 blur-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-95" />}
        <span className={`relative grid place-items-center overflow-hidden rounded-xl text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-105 ${premium ? 'size-10 border border-white/65 bg-gradient-to-br from-cyan-400 via-blue-600 to-violet-700 shadow-[0_0_24px_rgba(37,99,235,0.55)]' : 'size-9 bg-primary shadow-sm shadow-primary/20'}`}>
          {premium && <span className="absolute inset-x-1 top-0 h-1/2 rounded-full bg-white/20 blur-sm" />}
          <FileText className="relative size-5 drop-shadow-sm" strokeWidth={2.1} aria-hidden />
        </span>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-[15px] font-semibold tracking-[-0.025em] ${premium ? 'bg-gradient-to-r from-[#10233f] via-blue-700 to-violet-700 bg-clip-text text-transparent' : ''}`}>PDF Toolkit</span>
          {premium && <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.18em] text-blue-600/65">Private document studio</span>}
        </span>
      )}
    </Link>
  )
}
