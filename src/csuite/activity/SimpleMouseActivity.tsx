import type { Activity } from './Activity'
import type { Routine } from './Routine'
import type { KeyboardEvent, MouseEvent } from 'react'

export type SimpleMouseActivityProps = {
    //
    onStart?: (info: SimpleMouseActivity) => void
    onMove?: (info: SimpleMouseActivity, routine: Routine) => void
    onCommit?: (info: SimpleMouseActivity, routine: Routine) => void
    onCancel?: (info: SimpleMouseActivity, routine: Routine) => void
    /** will be called after either onCommit or onCancel */
    onStop?: () => void

    // onKeyUp?: (key: string, info: SimpleMouseActivity) => void
    onKeyDown?: (key: string, info: SimpleMouseActivity, routine: Routine) => void
}

/**
 * TODO:
 * we want to have some consistency between mouse activities
 * (right click to cancel, etc.)
 * this class handle the boring stuff
 */
export class SimpleMouseActivity implements Activity {
    constructor(public p: SimpleMouseActivityProps) {}

    /** WILL BE Re-INITALIZED in onStart() */

    startX: number = 0
    startY: number = 0

    lastX: number = 0
    lastY: number = 0

    get x(): number {
        return this.lastX
    }

    get y(): number {
        return this.lastY
    }

    offsetFromStart = 0
    offsetFromLast = 0
    euclidianDistanceFromStart = 0
    shiftKey = false

    // onKeyUp(ev: KeyboardEvent): void {
    //     // console.log(`[🐭🐭🐭] key up`)
    //     this.p.onKeyUp?.(ev.key, this)
    // }
    onKeyDown(ev: KeyboardEvent, routine: Routine): void {
        console.log(`[💩] SimpleMouseActivity is receiving an activity`)
        // console.log(`[🐭🐭🐭] key up`)
        this.p.onKeyDown?.(ev.key, this, routine)
    }

    onStart(): void {
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

    onMouseMove(event: MouseEvent, routine: Routine): void {
        this._updateInfo(event)
        this.p.onMove?.(this, routine)
    }

    onMouseUp(event: MouseEvent, routine: Routine): void {
        const btn = event.button

        // const info = this._getInfo(event)
        // case 1. right click / middle click => CANCEL
        if (btn === 1 || btn === 2) {
            this.p.onCancel?.(this, routine)
        }
        // case 2. left click => commit
        else {
            this.p.onCommit?.(this, routine)
        }
        this.p.onStop?.()
        routine.stop()
    }
}
