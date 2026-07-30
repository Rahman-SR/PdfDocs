import type { User } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  FREE_DAILY_TASK_LIMIT,
  FREE_MAX_FILE_SIZE_BYTES,
  FREE_USAGE_STORAGE_KEY,
  SIGNED_IN_DAILY_TASK_LIMIT,
  SIGNED_IN_LARGE_FILE_BYTES,
  getFreeFileLimitMessage,
  getLocalDayKey,
  getUsagePlan,
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

  it('keeps guests under 50 MB and gives accounts one file up to 100 MB daily', () => {
    const signedPlan = getUsagePlan(true, 'test-user')
    expect(isWithinFreeFileLimit({ size: FREE_MAX_FILE_SIZE_BYTES - 1 })).toBe(true)
    expect(isWithinFreeFileLimit({ size: FREE_MAX_FILE_SIZE_BYTES })).toBe(false)
    expect(isWithinFreeFileLimit({ size: FREE_MAX_FILE_SIZE_BYTES - 1 }, true)).toBe(true)
    expect(isWithinFreeFileLimit({ size: SIGNED_IN_LARGE_FILE_BYTES }, true)).toBe(true)

    recordFreeTask(new Date(), signedPlan, SIGNED_IN_LARGE_FILE_BYTES, true)
    const usage = loadFreeUsage(new Date(), signedPlan)
    expect(getFreeFileLimitMessage({ name: 'Another-large.pdf', size: FREE_MAX_FILE_SIZE_BYTES }, signedPlan, usage)).toContain('already been used')
  })

  it('tracks ten signed-in tasks and a 200 MB daily byte allowance separately', () => {
    const date = new Date(2026, 6, 14, 12)
    const signedPlan = getUsagePlan(true, 'account-one')

    for (let task = 0; task < SIGNED_IN_DAILY_TASK_LIMIT; task += 1) {
      recordFreeTask(date, signedPlan, 10 * 1024 * 1024)
    }

    expect(loadFreeUsage(date, signedPlan)).toMatchObject({
      completedTasks: 10,
      processedBytes: 100 * 1024 * 1024,
      remainingTasks: 0,
    })
  })

  it('recognizes paid plan metadata while keeping ordinary signed-in users free', () => {
    const freeUser = { app_metadata: {}, user_metadata: {} } as unknown as User
    const proUser = { app_metadata: { plan: 'pro' }, user_metadata: {} } as unknown as User

    expect(hasPaidPlan(null)).toBe(false)
    expect(hasPaidPlan(freeUser)).toBe(false)
    expect(hasPaidPlan(proUser)).toBe(true)
  })
})
