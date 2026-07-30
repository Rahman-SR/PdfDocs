import { useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { AuthContext } from '../auth/auth-context'
import {
  getFileSizeLimit,
  getFreeFileLimitMessage,
  getTaskLimitMessage,
  getUsagePlan,
  hasPaidPlan,
  isLargeAccountFile,
  loadFreeUsage,
  recordFreeTask,
} from '../../lib/free-usage'

// One hook keeps identity-aware daily tasks, bytes, and file validation consistent.
export function useFreeUsageQuota() {
  const auth = useContext(AuthContext)
  const isFreePlan = !hasPaidPlan(auth?.user)
  const isSignedIn = auth?.status === 'authenticated'
  const plan = useMemo(() => getUsagePlan(isSignedIn, auth?.user?.id), [auth?.user?.id, isSignedIn])
  const fileSizeLimit = getFileSizeLimit(isSignedIn)
  const [usage, setUsage] = useState(() => loadFreeUsage(new Date(), plan))

  useEffect(() => {
    const refreshUsage = () => setUsage(loadFreeUsage(new Date(), plan))
    refreshUsage()
    window.addEventListener('storage', refreshUsage)
    window.addEventListener('focus', refreshUsage)
    return () => {
      window.removeEventListener('storage', refreshUsage)
      window.removeEventListener('focus', refreshUsage)
    }
  }, [plan])

  const taskLimitMessage = useCallback((inputBytes: number) => {
    if (!isFreePlan) return null
    const current = loadFreeUsage(new Date(), plan)
    setUsage(current)
    return getTaskLimitMessage(inputBytes, plan, current)
  }, [isFreePlan, plan])

  const completeTask = useCallback((inputBytes: number, usedLargeFile = false) => {
    if (isFreePlan) setUsage(recordFreeTask(new Date(), plan, inputBytes, usedLargeFile))
  }, [isFreePlan, plan])

  const validateFile = useCallback((file: File) => {
    if (!isFreePlan) return null
    const current = loadFreeUsage(new Date(), plan)
    return getFreeFileLimitMessage(file, plan, current)
  }, [isFreePlan, plan])

  return {
    completeTask,
    fileSizeLimit,
    isFreePlan,
    isLargeFile: isLargeAccountFile,
    isSignedIn,
    plan,
    taskLimitMessage,
    usage,
    validateFile,
  }
}
