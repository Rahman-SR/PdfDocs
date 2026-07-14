import type { User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  FREE_DAILY_TASK_LIMIT,
  FREE_MAX_FILE_SIZE_BYTES,
  FREE_USAGE_STORAGE_KEY,
  getLocalDayKey,
  hasPaidPlan,
  isWithinFreeFileLimit,
  loadFreeUsage,
  recordFreeTask,
} from './free-usage'

describe('free usage limits', () => {
  beforeEach(() => window.localStorage.clear())

  it('records five successful tasks and prevents the allowance from becoming negative', () => {
    const date = new Date(2026, 6, 14, 12)

    for (let task = 0; task < FREE_DAILY_TASK_LIMIT + 2; task += 1) recordFreeTask(date)

    expect(loadFreeUsage(date)).toMatchObject({ completedTasks: 5, remainingTasks: 0 })
  })

  it('starts a fresh allowance on the next local calendar day', () => {
    window.localStorage.setItem(FREE_USAGE_STORAGE_KEY, JSON.stringify({
      completedTasks: 5,
      date: getLocalDayKey(new Date(2026, 6, 13, 23, 59)),
    }))

    expect(loadFreeUsage(new Date(2026, 6, 14, 0, 1))).toMatchObject({ completedTasks: 0, remainingTasks: 5 })
  })

  it('accepts exactly 50 MB and rejects anything larger', () => {
    expect(isWithinFreeFileLimit({ size: FREE_MAX_FILE_SIZE_BYTES })).toBe(true)
    expect(isWithinFreeFileLimit({ size: FREE_MAX_FILE_SIZE_BYTES + 1 })).toBe(false)
  })

  it('recognizes paid plan metadata while keeping ordinary signed-in users free', () => {
    const freeUser = { app_metadata: {}, user_metadata: {} } as unknown as User
    const proUser = { app_metadata: { plan: 'pro' }, user_metadata: {} } as unknown as User

    expect(hasPaidPlan(null)).toBe(false)
    expect(hasPaidPlan(freeUser)).toBe(false)
    expect(hasPaidPlan(proUser)).toBe(true)
  })
})
