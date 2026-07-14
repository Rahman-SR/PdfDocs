import { CompressWorkspace } from '../features/pdf-tools/CompressWorkspace'
import { MergeWorkspace } from '../features/pdf-tools/MergeWorkspace'
import { SplitWorkspace } from '../features/pdf-tools/SplitWorkspace'

// This page is the route-level dispatcher for the three implemented PDF tools.
export type WorkspaceMode = 'compress' | 'merge' | 'split'

export function ToolWorkspacePage({ mode }: { mode: WorkspaceMode }) {
  if (mode === 'split') return <SplitWorkspace />
  if (mode === 'compress') return <CompressWorkspace />
  return <MergeWorkspace />
}
