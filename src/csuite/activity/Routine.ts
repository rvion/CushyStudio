import type { Activity } from './Activity'
import type { ActivityManager } from './ActivityManager'

import { nanoid } from 'nanoid'

/**
 * we want to support activities defined inline as simple minimalist objects
 * but we also want a common API to maniuplate them, or to make sure we have
 * some unique ID we can refer, even when one single activity is
 * instanciated multiple times.
 * so we need a proper class to wrap them;
 * Routine is that class.
 * */
export class Routine {
    uid = nanoid()
    constructor(
        //
        public manager: ActivityManager,
        public activity: Activity,
    ) {
        // makeAutoObservable(this)
    }

    stop() {
        this.manager.stop(this)
    }
}
