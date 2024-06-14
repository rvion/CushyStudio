import type { Activity } from './Activity'

import { makeAutoObservable } from 'mobx'

import { Trigger } from '../trigger/Trigger'

// ACTIVITY = global app state machine state you can be in;
// consume all events, and react to them
// may let some pass though; or not
export class ActivityManager {
    /** currently active activities */
    _stack: Activity[] = []

    startActivity = (activity: Activity) => {
        this._stack.push(activity)
        activity.onStart?.()
        return Trigger.Success
    }

    stopActivity(activity: Activity): void {
        const ix = this._stack.indexOf(activity)
        if (ix === -1) return
        this._stack.splice(ix, 1)
        activity.onStop?.()
    }

    stopCurrentActivity = () => {
        const activity = this._stack.pop()
        activity?.onStop?.()
    }

    current = () => this._stack[this._stack.length - 1]

    constructor() {
        makeAutoObservable(this)
    }
}

export const activityManager = new ActivityManager()
