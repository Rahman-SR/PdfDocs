import { useCallback, useContext, useEffect, useState } from 'react'

import { AuthContext } from '../auth/auth-context'
import {
  FREE_DAILY_LIMIT_MESSAGE,
  getFreeFileLimitMessage,
  hasPaidPlan,
  loadFreeUsage,
  recordFreeTask,
} from '../../lib/free-usage'

// One hook keeps plan detection, daily usage, and file validation consistent.
export function useFreeUsageQuota() {
  const auth = useContext(AuthContext)
  const isFreePlan = !hasPaidPlan(auth?.user)
  const [usage, setUsage] = useState(loadFreeUsage)

  useEffect(() => {
    const refreshUsage = () => setUsage(loadFreeUsage())
    window.addEventListener('storage', refreshUsage)
    window.addEventListener('focus', refreshUsage)
    return () => {
      window.removeEventListener('storage', refreshUsage)
      window.removeEventListener('focus', refreshUsage)
    }
  }, [])

  const canStartTask = useCallback(() => {
    if (!isFreePlan) return true
    const current = loadFreeUsage()
    setUsage(current)
    return current.remainingTasks > 0
  }, [isFreePlan])

  const completeTask = useCallback(() => {
    if (isFreePlan) setUsage(recordFreeTask())
  }, [isFreePlan])

  const validateFile = useCallback((file: File) => (
    isFreePlan ? getFreeFileLimitMessage(file) : null
  ), [isFreePlan])

  return {
    canStartTask,
    completeTask,
    dailyLimitMessage: FREE_DAILY_LIMIT_MESSAGE,
    isFreePlan,
    usage,
    validateFile,
  }
}
