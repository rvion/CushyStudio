import type { Activity } from '../csuite/activity/Activity'

import { useEffect } from 'react'

import { activityManager } from '../csuite/activity/ActivityManager'
import { DemoActivityUI } from './DemoActivityUI'

export const useDemoActivity = () => useEffect(() => void activityManager.start(DEMO_ACTIVITY), [])
export const DEMO_ACTIVITY: Activity = { UI: DemoActivityUI }
