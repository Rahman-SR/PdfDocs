import { Combine, Minimize2, Scissors, type LucideIcon } from 'lucide-react'

// Shared metadata keeps the public landing page, dashboard, and tools directory consistent.
export type PdfToolDefinition = {
  cardAccentClass: string
  cardSurfaceClass: string
  description: string
  icon: LucideIcon
  iconClass: string
  id: 'compress' | 'merge' | 'split'
  landingGradient: string
  publicPath: string
  title: string
  workspacePath: string
  workspaceTitle: string
}

export const PDF_TOOLS: Record<PdfToolDefinition['id'], PdfToolDefinition> = {
  merge: {
    cardAccentClass: 'text-blue-700',
    cardSurfaceClass: 'bg-gradient-to-br from-blue-100/90 via-blue-50/55 to-white hover:border-blue-300 hover:shadow-blue-200/60',
    description: 'Combine multiple PDF files in the exact order you need.',
    icon: Combine,
    iconClass: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200/70',
    id: 'merge',
    landingGradient: 'from-blue-500 to-indigo-600',
    publicPath: '/free-tools/merge',
    title: 'Merge PDF',
    workspacePath: '/tools/merge',
    workspaceTitle: 'Merge',
  },
  split: {
    cardAccentClass: 'text-emerald-700',
    cardSurfaceClass: 'bg-gradient-to-br from-emerald-100/90 via-emerald-50/55 to-white hover:border-emerald-300 hover:shadow-emerald-200/60',
    description: 'Extract page ranges or individual pages into new PDF files.',
    icon: Scissors,
    iconClass: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200/70',
    id: 'split',
    landingGradient: 'from-emerald-500 to-teal-600',
    publicPath: '/free-tools/split',
    title: 'Split PDF',
    workspacePath: '/tools/split',
    workspaceTitle: 'Split',
  },
  compress: {
    cardAccentClass: 'text-orange-700',
    cardSurfaceClass: 'bg-gradient-to-br from-orange-100/90 via-orange-50/55 to-white hover:border-orange-300 hover:shadow-orange-200/60',
    description: 'Reduce PDF size with adjustable output quality.',
    icon: Minimize2,
    iconClass: 'bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-200/70',
    id: 'compress',
    landingGradient: 'from-orange-500 to-rose-500',
    publicPath: '/free-tools/compress',
    title: 'Compress PDF',
    workspacePath: '/tools/compress',
    workspaceTitle: 'Compress',
  },
}

// Stable ordering is used anywhere the three implemented tools are listed together.
export const CORE_PDF_TOOLS = [PDF_TOOLS.merge, PDF_TOOLS.split, PDF_TOOLS.compress]
