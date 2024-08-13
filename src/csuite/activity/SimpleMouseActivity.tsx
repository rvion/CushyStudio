import type { Activity } from './Activity'
import type { Routine } from './Routine'
import type { MouseEvent } from 'react'

/**
 * TODO:
 * we want to have some consistency between mouse activities
 * (right click to cancel, etc.)
 * this class handle the boring stuff
 */
export class SimpleMouseActivity implements Activity {
    constructor(
        public p: {
            //
            onStart?: (info: SimpleMouseActivity) => void
            onMove?: (info: SimpleMouseActivity) => void
            onCommit?: (info: SimpleMouseActivity) => void
            onCancel?: (info: SimpleMouseActivity) => void
            /** will be called after either onCommit or onCancel */
            onStop?: () => void
        },
    ) {}

    /** WILL BE Re-INITALIZED in onStart() */

    startX: number = 0
    startY: number = 0

    lastX: number = 0
    lastY: number = 0

    get x() {
        return this.lastX
    }
    get y() {
        return this.lastY
    }

    offsetFromStart = 0
    offsetFromLast = 0
    euclidianDistanceFromStart = 0
    shiftKey = false

    onStart() {
        // console.log(`[🐭🐭🐭] start`)
        this.startX = cushy.region.mouseX
        this.startY = cushy.region.mouseY

        this.lastX = cushy.region.mouseX
        this.lastY = cushy.region.mouseY

        this.p.onStart?.(this)
    }

    private _updateInfo = (event: MouseEvent): void => {
        this.offsetFromStart = event.clientX - this.startX
        this.offsetFromLast = event.clientX - this.startX
        this.euclidianDistanceFromStart = Math.sqrt((event.clientX - this.startX) ** 2 + (event.clientY - this.startY) ** 2)
        this.shiftKey = event.shiftKey
    }

    onMouseMove(event: MouseEvent, routine: Routine) {
        this._updateInfo(event)
        this.p.onMove?.(this)
    }

    onMouseUp(event: MouseEvent, routine: Routine) {
        const btn = event.button

        // const info = this._getInfo(event)
        // case 1. right click / middle click => CANCEL
        if (btn === 1 || btn === 2) {
            this.p.onCancel?.(this)
        }
        // case 2. left click => commit
        else {
            this.p.onCommit?.(this)
        }
        this.p.onStop?.()
        routine.stop()
    }
}
