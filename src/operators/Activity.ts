import type { FC } from 'react'

import { makeAutoObservable } from 'mobx'

import { type DomId, Trigger } from './RET'

// ACTIVITY = global app state machine state you can be in;
// consume all events, and react to them
// may let some pass though; or not

class ActivityManager {
    /** currently active activities */
    stack: Activity[] = []

    push = (activity: Activity) => {
        this.stack.push(activity)
        activity.onStart?.()
        return Trigger.Success
    }
    pop = () => {
        const activity = this.stack.pop()
        activity?.onStop?.()
    }

    current = () => this.stack[this.stack.length - 1]

    constructor() {
        makeAutoObservable(this)
    }
}
export const activityManger = new ActivityManager()

export interface Activity {
    /** uniquer activity uid */
    uid: string
    /** if given, the activity is bound the the given ID */
    bound?: DomId | null
    onStart?: () => void
    onEvent?: (event: Event) => Trigger | null
    onStop?: () => void
    UI: FC<{}>
}
