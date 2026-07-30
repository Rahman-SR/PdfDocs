import {
  Combine,
  FileImage,
  FileOutput,
  Hash,
  ListOrdered,
  Minimize2,
  RotateCw,
  Scissors,
  Stamp,
  Trash2,
  type LucideIcon,
} from 'lucide-react'

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

// Roadmap metadata is shared by the tools directory and public mega-menu.
export type RoadmapPdfToolDefinition = {
  accentClass: string
  description: string
  icon: LucideIcon
  iconClass: string
  surfaceClass: string
  title: string
}

export const ROADMAP_PDF_TOOLS: RoadmapPdfToolDefinition[] = [
  { title: 'Rotate', description: 'Rotate pages to the correct orientation.', icon: RotateCw, iconClass: 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-200/70', accentClass: 'text-violet-700', surfaceClass: 'bg-gradient-to-br from-violet-100/90 via-violet-50/55 to-white hover:border-violet-300 hover:shadow-violet-200/60' },
  { title: 'Reorder', description: 'Rearrange pages with drag and drop.', icon: ListOrdered, iconClass: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-200/70', accentClass: 'text-cyan-700', surfaceClass: 'bg-gradient-to-br from-cyan-100/90 via-cyan-50/55 to-white hover:border-cyan-300 hover:shadow-cyan-200/60' },
  { title: 'Delete', description: 'Remove unwanted PDF pages safely.', icon: Trash2, iconClass: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-rose-200/70', accentClass: 'text-rose-700', surfaceClass: 'bg-gradient-to-br from-rose-100/90 via-rose-50/55 to-white hover:border-rose-300 hover:shadow-rose-200/60' },
  { title: 'Extract', description: 'Pull selected pages into a new PDF.', icon: FileOutput, iconClass: 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-200/70', accentClass: 'text-teal-700', surfaceClass: 'bg-gradient-to-br from-teal-100/90 via-teal-50/55 to-white hover:border-teal-300 hover:shadow-teal-200/60' },
  { title: 'Watermark', description: 'Add branded text or image overlays.', icon: Stamp, iconClass: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-200/70', accentClass: 'text-fuchsia-700', surfaceClass: 'bg-gradient-to-br from-fuchsia-100/90 via-fuchsia-50/55 to-white hover:border-fuchsia-300 hover:shadow-fuchsia-200/60' },
  { title: 'Page Numbers', description: 'Add flexible numbering to every page.', icon: Hash, iconClass: 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-lg shadow-amber-200/70', accentClass: 'text-amber-700', surfaceClass: 'bg-gradient-to-br from-amber-100/90 via-amber-50/55 to-white hover:border-amber-300 hover:shadow-amber-200/60' },
  { title: 'JPG to PDF', description: 'Turn images into a shareable PDF.', icon: FileImage, iconClass: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200/70', accentClass: 'text-pink-700', surfaceClass: 'bg-gradient-to-br from-pink-100/90 via-pink-50/55 to-white hover:border-pink-300 hover:shadow-pink-200/60' },
]
