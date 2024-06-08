import { useEffect } from 'react'

import { activityManager } from './activity/Activity'
import { DemoActivityUI } from './DemoActivityUI'

export const useDemoActivity = () =>
    useEffect(() => {
        activityManager.startActivity(DEMO_ACTIVITY)
    }, [])

export const DEMO_ACTIVITY = {
    uid: 'debug',
    UI: DemoActivityUI,
}
