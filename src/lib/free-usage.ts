import type { User } from '@supabase/supabase-js'

// Free-plan entitlements are shared by anonymous and signed-in free users.
export const FREE_DAILY_TASK_LIMIT = 5
export const FREE_MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024
export const FREE_MAX_FILE_SIZE_LABEL = '50 MB'
export const FREE_USAGE_STORAGE_KEY = 'pdf-toolkit-free-usage-v1'
export const FREE_DAILY_LIMIT_MESSAGE = 'You have used all 5 free tasks for today. Try again tomorrow or upgrade your plan.'

type StoredFreeUsage = {
  completedTasks: number
  date: string
}

export type FreeUsageSnapshot = StoredFreeUsage & {
  remainingTasks: number
}

// Local calendar dates make the daily reset match the visitor's timezone.
export function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function emptyUsage(date = new Date()): StoredFreeUsage {
  return { completedTasks: 0, date: getLocalDayKey(date) }
}

function toSnapshot(usage: StoredFreeUsage): FreeUsageSnapshot {
  return {
    ...usage,
    remainingTasks: Math.max(0, FREE_DAILY_TASK_LIMIT - usage.completedTasks),
  }
}

// Invalid, unavailable, or previous-day browser storage starts a fresh allowance.
export function loadFreeUsage(date = new Date()): FreeUsageSnapshot {
  const fallback = emptyUsage(date)

  try {
    const stored = window.localStorage.getItem(FREE_USAGE_STORAGE_KEY)
    if (!stored) return toSnapshot(fallback)

    const parsed = JSON.parse(stored) as Partial<StoredFreeUsage>
    if (parsed.date !== fallback.date) return toSnapshot(fallback)

    const completedTasks = Number.isFinite(parsed.completedTasks)
      ? Math.min(FREE_DAILY_TASK_LIMIT, Math.max(0, Math.floor(parsed.completedTasks ?? 0)))
      : 0

    return toSnapshot({ completedTasks, date: fallback.date })
  } catch {
    return toSnapshot(fallback)
  }
}

// A task is counted only after PDF processing succeeds.
export function recordFreeTask(date = new Date()): FreeUsageSnapshot {
  const current = loadFreeUsage(date)
  const next = toSnapshot({
    completedTasks: Math.min(FREE_DAILY_TASK_LIMIT, current.completedTasks + 1),
    date: current.date,
  })

  try {
    window.localStorage.setItem(FREE_USAGE_STORAGE_KEY, JSON.stringify({
      completedTasks: next.completedTasks,
      date: next.date,
    }))
  } catch {
    // Processing remains usable when browser storage is disabled.
  }

  return next
}

// File-size validation happens before a PDF is read into memory.
export function isWithinFreeFileLimit(file: Pick<File, 'size'>) {
  return file.size <= FREE_MAX_FILE_SIZE_BYTES
}

export function getFreeFileLimitMessage(file: Pick<File, 'name' | 'size'>) {
  return isWithinFreeFileLimit(file)
    ? null
    : `${file.name} exceeds the ${FREE_MAX_FILE_SIZE_LABEL} free-plan limit.`
}

// Paid metadata can bypass the Free allowance when billing is connected later.
export function hasPaidPlan(user: User | null | undefined) {
  const paidPlanNames = new Set(['pro', 'professional', 'business', 'enterprise', 'paid'])
  const metadata = [user?.app_metadata, user?.user_metadata]

  return metadata.some((values) => {
    const plan = values?.plan ?? values?.subscription_plan ?? values?.subscription_tier
    return typeof plan === 'string' && paidPlanNames.has(plan.toLowerCase())
  })
}
