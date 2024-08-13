import type { Activity } from './Activity'

import { makeAutoObservable } from 'mobx'

import { Trigger } from '../trigger/Trigger'
import { Routine } from './Routine'

// ACTIVITY = global app state machine state you can be in;
// consume all events, and react to them
// may let some pass though; or not
export class ActivityManager {
    constructor() {
        makeAutoObservable(this)
    }

    // ACCESSING ---------------------------------------------------------------
    /** currently active activities */
    routines: Routine[] = []

    current = (): Maybe<Routine> => this.routines[this.routines.length - 1]

    // STARTING ---------------------------------------------------------------
    startFromClass = <Ctx extends any>(
        //
        ActivityKls: { new (ctx: Ctx): Activity },
        ctx: NoInfer<Ctx>,
    ) => {
        const activity = new ActivityKls(ctx)
        const routine = new Routine(this, activity)
        this.routines.push(routine)
        activity.onStart?.()
        return Trigger.Success
    }

    /**
     * start an activity, return the created routine
     */
    start = (activity: Activity): Routine => {
        const routine = new Routine(this, activity)
        this.routines.push(routine)
        activity.onStart?.()
        return routine
    }

    /**
     * similar to `start`.
     * start an activity, return Trigger.Success */
    start_ = (activity: Activity): Trigger => {
        const routine = new Routine(this, activity)
        this.routines.push(routine)
        activity.onStart?.()
        return Trigger.Success
    }

    // STOPPING ---------------------------------------------------------------
    stop(routine: Routine): Trigger {
        const ix = this.routines.indexOf(routine)
        if (ix === -1) return Trigger.UNMATCHED
        this.routines.splice(ix, 1)
        routine.activity.onStop?.()
        return Trigger.Success
    }

    stopLast = (): Trigger => {
        const routine = this.routines.pop()
        if (routine == null) return Trigger.UNMATCHED
        routine.activity.onStop?.()
        return Trigger.Success
    }
}

export const activityManager = new ActivityManager()
