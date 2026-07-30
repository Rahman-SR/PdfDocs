import { FileUp, Gauge, LoaderCircle, LockKeyhole } from 'lucide-react'

import { FREE_MAX_FILE_SIZE_LABEL, MAX_UPLOAD_BATCH_LABEL, SIGNED_IN_LARGE_FILE_LABEL } from '../../lib/free-usage'

// Compact entitlement summary shown in every public PDF workspace.
export function FreeUsageNotice({
  isFreePlan,
  isSignedIn,
  largeFileUses,
  plan,
  remainingTasks,
  showBatchLimit = false,
}: {
  isFreePlan: boolean
  isSignedIn: boolean
  largeFileUses: number
  plan: { dailyBytesLabel: string; taskLimit: number }
  remainingTasks: number
  showBatchLimit?: boolean
}) {
  if (!isFreePlan) return null

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-primary" aria-live="polite">
      <span className="inline-flex items-center gap-1.5 font-medium"><Gauge className="size-4" aria-hidden />{isSignedIn ? 'Signed-in access' : 'Guest access'}</span>
      <span>{remainingTasks} of {plan.taskLimit} tasks left today</span>
      <span>{plan.dailyBytesLabel} daily processing</span>
      <span>{isSignedIn ? `One ${SIGNED_IN_LARGE_FILE_LABEL} file daily: ${largeFileUses ? 'used' : 'available'}` : `Each PDF under ${FREE_MAX_FILE_SIZE_LABEL}`}</span>
      {showBatchLimit && <span>{MAX_UPLOAD_BATCH_LABEL} maximum merge batch</span>}
      <span>Web only</span>
    </div>
  )
}

// Square browser preview used consistently by Merge, Split, and Compress.
export function PdfPreviewFrame({ title, url }: { title: string; url: string }) {
  return (
    <div
      data-pdf-preview-surface
      className="grid w-full max-w-[500px] place-items-center rounded-xl border border-line bg-[#e9edf2] p-3 sm:p-5"
    >
      <iframe
        title={title}
        src={`${url}#toolbar=1&navpanes=0&view=FitH`}
        className="aspect-square w-full max-w-[460px] rounded-lg border border-line bg-white shadow-lg"
      />
    </div>
  )
}

// Source, loading, and empty preview states share one renderer across workspaces.
export function PdfPreviewContent({
  emptyDescription,
  emptyTitle,
  loading,
  onChoose,
  previewTitle,
  source,
}: {
  emptyDescription: string
  emptyTitle: string
  loading: boolean
  onChoose: () => void
  previewTitle: string
  source: { url: string } | null
}) {
  if (loading) {
    return (
      <div className="grid aspect-square w-full max-w-[500px] place-items-center rounded-xl border border-line bg-[#e9edf2] text-center text-muted">
        <div><LoaderCircle className="mx-auto size-8 animate-spin text-primary" aria-hidden /><p className="mt-3 text-sm">Preparing PDF preview...</p></div>
      </div>
    )
  }

  if (source) return <PdfPreviewFrame title={previewTitle} url={source.url} />

  return <PdfUploadEmptyState title={emptyTitle} description={emptyDescription} buttonLabel="Choose PDF" onChoose={onChoose} />
}

// Empty state shown before a visitor selects a PDF from their device.
function PdfUploadEmptyState({
  buttonLabel,
  description,
  disabled = false,
  onChoose,
  title,
}: {
  buttonLabel: string
  description: string
  disabled?: boolean
  onChoose: () => void
  title: string
}) {
  return (
    <div className="grid aspect-square w-full max-w-[500px] place-items-center rounded-xl border-2 border-dashed border-[#b9c3d5] bg-[#fbfcfd] p-6 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-blue-50 text-primary">
          <FileUp className="size-6" aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-lg font-medium">{title}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted">{description}</p>
        <button
          type="button"
          disabled={disabled}
          onClick={onChoose}
          className="mt-5 min-h-10 rounded-lg bg-primary px-5 text-sm font-medium text-white transition hover:bg-primary-strong disabled:cursor-wait disabled:opacity-60"
        >
          {buttonLabel}
        </button>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-emerald-700">
          <LockKeyhole className="size-3.5" aria-hidden /> Processed locally
        </p>
      </div>
    </div>
  )
}

// Small form controls shared by the settings panels.
export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label>
      <span className="mb-2 block text-xs text-[#333b49]">{label}</span>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="precision-input"
      />
    </label>
  )
}

export function SwitchRow({ label, value, setValue }: { label: string; value: boolean; setValue: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => setValue(!value)}
        aria-label={label}
        aria-pressed={value}
        className={`relative h-7 w-12 rounded-full ${value ? 'bg-primary' : 'bg-[#cfd5de]'}`}
      >
        <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  )
}
