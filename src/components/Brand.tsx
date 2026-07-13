import { FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BrandProps {
  compact?: boolean
  plan?: string
}

export function Brand({ compact = false, plan }: BrandProps) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-3 rounded-lg text-ink outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
      aria-label="PDF Toolkit home"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-white shadow-sm shadow-primary/20">
        <FileText className="size-5" strokeWidth={2.1} aria-hidden />
      </span>
      {!compact && (
        <span>
          <span className="block font-display text-[15px] font-semibold tracking-[-0.02em]">PDF Toolkit</span>
          {plan && <span className="mt-0.5 block text-xs text-muted">{plan}</span>}
        </span>
      )}
    </Link>
  )
}
