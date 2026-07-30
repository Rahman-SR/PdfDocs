import type { User } from '@supabase/supabase-js'

// Guest and account allowances are enforced locally before PDF bytes are processed.
export const FREE_DAILY_TASK_LIMIT = 5
export const SIGNED_IN_DAILY_TASK_LIMIT = 10
const FREE_DAILY_BYTES = 100 * 1024 * 1024
const FREE_DAILY_BYTES_LABEL = '100 MB'
const SIGNED_IN_DAILY_BYTES = 200 * 1024 * 1024
const SIGNED_IN_DAILY_BYTES_LABEL = '200 MB'
export const FREE_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024
export const FREE_MAX_FILE_SIZE_LABEL = '50 MB'
export const SIGNED_IN_LARGE_FILE_BYTES = 100 * 1024 * 1024
export const SIGNED_IN_LARGE_FILE_LABEL = '100 MB'
export const MAX_UPLOAD_BATCH_BYTES = 100 * 1024 * 1024
export const MAX_UPLOAD_BATCH_LABEL = '100 MB'
export const FREE_USAGE_STORAGE_KEY = 'pdf-toolkit-free-usage-v1'

type StoredFreeUsage = {
  completedTasks: number
  date: string
  largeFileUses: number
  processedBytes: number
}

export type UsagePlan = {
  dailyBytes: number
  dailyBytesLabel: string
  isSignedIn: boolean
  scope: string
  taskLimit: number
}

export type FreeUsageSnapshot = StoredFreeUsage & {
  remainingBytes: number
  remainingTasks: number
}

// Local calendar dates make the daily reset match the visitor's timezone.
export function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getUsagePlan(isSignedIn: boolean, userId?: string): UsagePlan {
  return isSignedIn
    ? { dailyBytes: SIGNED_IN_DAILY_BYTES, dailyBytesLabel: SIGNED_IN_DAILY_BYTES_LABEL, isSignedIn: true, scope: `account-${userId ?? 'signed-in'}`, taskLimit: SIGNED_IN_DAILY_TASK_LIMIT }
    : { dailyBytes: FREE_DAILY_BYTES, dailyBytesLabel: FREE_DAILY_BYTES_LABEL, isSignedIn: false, scope: 'guest', taskLimit: FREE_DAILY_TASK_LIMIT }
}

function storageKey(plan: UsagePlan) {
  return plan.scope === 'guest' ? FREE_USAGE_STORAGE_KEY : `${FREE_USAGE_STORAGE_KEY}:${plan.scope}`
}

function emptyUsage(date: Date): StoredFreeUsage {
  return { completedTasks: 0, date: getLocalDayKey(date), largeFileUses: 0, processedBytes: 0 }
}

function toSnapshot(usage: StoredFreeUsage, plan: UsagePlan): FreeUsageSnapshot {
  return {
    ...usage,
    remainingBytes: Math.max(0, plan.dailyBytes - usage.processedBytes),
    remainingTasks: Math.max(0, plan.taskLimit - usage.completedTasks),
  }
}

// Invalid, unavailable, or previous-day browser storage starts a fresh allowance.
export function loadFreeUsage(date = new Date(), plan = getUsagePlan(false)): FreeUsageSnapshot {
  const fallback = emptyUsage(date)

  try {
    const stored = window.localStorage.getItem(storageKey(plan))
    if (!stored) return toSnapshot(fallback, plan)

    const parsed = JSON.parse(stored) as Partial<StoredFreeUsage>
    if (parsed.date !== fallback.date) return toSnapshot(fallback, plan)

    const completedTasks = Number.isFinite(parsed.completedTasks)
      ? Math.min(plan.taskLimit, Math.max(0, Math.floor(parsed.completedTasks ?? 0)))
      : 0
    const largeFileUses = Number.isFinite(parsed.largeFileUses)
      ? Math.min(1, Math.max(0, Math.floor(parsed.largeFileUses ?? 0)))
      : 0
    const processedBytes = Number.isFinite(parsed.processedBytes)
      ? Math.min(plan.dailyBytes, Math.max(0, Math.floor(parsed.processedBytes ?? 0)))
      : 0

    return toSnapshot({ completedTasks, date: fallback.date, largeFileUses, processedBytes }, plan)
  } catch {
    return toSnapshot(fallback, plan)
  }
}

// A task and its input bytes are counted only after PDF processing succeeds.
export function recordFreeTask(date = new Date(), plan = getUsagePlan(false), inputBytes = 0, usedLargeFile = false): FreeUsageSnapshot {
  const current = loadFreeUsage(date, plan)
  const next = toSnapshot({
    completedTasks: Math.min(plan.taskLimit, current.completedTasks + 1),
    date: current.date,
    largeFileUses: Math.min(1, current.largeFileUses + (usedLargeFile ? 1 : 0)),
    processedBytes: Math.min(plan.dailyBytes, current.processedBytes + Math.max(0, inputBytes)),
  }, plan)

  try {
    window.localStorage.setItem(storageKey(plan), JSON.stringify({
      completedTasks: next.completedTasks,
      date: next.date,
      largeFileUses: next.largeFileUses,
      processedBytes: next.processedBytes,
    }))
  } catch {
    // Processing remains usable when browser storage is disabled.
  }

  return next
}

// File validation handles the signed-in once-per-day large-file allowance.
export function getFileSizeLimit(isSignedIn: boolean) {
  return isSignedIn
    ? { bytes: SIGNED_IN_LARGE_FILE_BYTES, label: SIGNED_IN_LARGE_FILE_LABEL }
    : { bytes: FREE_MAX_FILE_SIZE_BYTES, label: FREE_MAX_FILE_SIZE_LABEL }
}

export function isWithinFreeFileLimit(file: Pick<File, 'size'>, isSignedIn = false) {
  return isSignedIn
    ? file.size <= SIGNED_IN_LARGE_FILE_BYTES
    : file.size < FREE_MAX_FILE_SIZE_BYTES
}

export function isLargeAccountFile(file: Pick<File, 'size'>) {
  return file.size >= FREE_MAX_FILE_SIZE_BYTES
}

export function getFreeFileLimitMessage(file: Pick<File, 'name' | 'size'>, plan = getUsagePlan(false), usage = loadFreeUsage(new Date(), plan)) {
  if (!plan.isSignedIn && file.size >= FREE_MAX_FILE_SIZE_BYTES) {
    return `${file.name} must be smaller than ${FREE_MAX_FILE_SIZE_LABEL}. Sign in to use one file up to ${SIGNED_IN_LARGE_FILE_LABEL} per day.`
  }
  if (plan.isSignedIn && file.size > SIGNED_IN_LARGE_FILE_BYTES) {
    return `${file.name} exceeds the ${SIGNED_IN_LARGE_FILE_LABEL} signed-in maximum. Choose a smaller PDF.`
  }
  if (plan.isSignedIn && isLargeAccountFile(file) && usage.largeFileUses >= 1) {
    return `Your one large-file upload for today has already been used. Choose a PDF smaller than ${FREE_MAX_FILE_SIZE_LABEL}.`
  }
  if (file.size > usage.remainingBytes) {
    return `${file.name} exceeds your remaining daily processing allowance. Choose a smaller PDF or try again tomorrow.`
  }
  return null
}

export function getTaskLimitMessage(inputBytes: number, plan: UsagePlan, usage = loadFreeUsage(new Date(), plan)) {
  if (usage.remainingTasks <= 0) {
    return `You have used all ${plan.taskLimit} tasks for today. Try again tomorrow.`
  }
  if (inputBytes > usage.remainingBytes) {
    return `This task exceeds your ${plan.dailyBytesLabel} daily processing allowance. Remove files or try again tomorrow.`
  }
  return null
}

// Paid metadata can bypass the local free allowance when billing is connected later.
export function hasPaidPlan(user: User | null | undefined) {
  const paidPlanNames = new Set(['pro', 'professional', 'business', 'enterprise', 'paid'])
  const metadata = [user?.app_metadata, user?.user_metadata]

  return metadata.some((values) => {
    const plan = values?.plan ?? values?.subscription_plan ?? values?.subscription_tier
    return typeof plan === 'string' && paidPlanNames.has(plan.toLowerCase())
  })
}
