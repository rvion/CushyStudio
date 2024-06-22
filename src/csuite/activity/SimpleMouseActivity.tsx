import type { Activity } from './Activity'
import type { Routine } from './Routine'
import type { MouseEvent } from 'react'

type Info = {
    offsetFromStart: number
    offsetFromLast: number
    euclidianDistanceFromStart: number
    shiftKey: boolean
}

export class SimpleMouseActivity implements Activity {
    constructor(
        public p: {
            //
            onMove?: (info: Info) => void
            onCommit?: (info: Info) => void
            onCancel?: (info: Info) => void
        },
    ) {}

    startX: number = 0
    startY: number = 0

    lastX: number = 0
    lastY: number = 0

    onStart() {
        // console.log(`[🐭🐭🐭] start`)
        this.startX = cushy.region.mouseX
        this.startY = cushy.region.mouseY

        this.lastX = cushy.region.mouseX
        this.lastY = cushy.region.mouseY
    }

    private _getInfo = (event: MouseEvent): Info => {
        return {
            offsetFromStart: event.clientX - this.startX,
            offsetFromLast: event.clientX - this.startX,
            euclidianDistanceFromStart: Math.sqrt((event.clientX - this.startX) ** 2 + (event.clientY - this.startY) ** 2),
            shiftKey: event.shiftKey,
        }
    }
    onMouseMove(event: MouseEvent, routine: Routine) {
        const info = this._getInfo(event)
        this.p.onMove?.(info)
    }

    onMouseUp(event: MouseEvent, routine: Routine) {
        const btn = event.button

        const info = this._getInfo(event)
        // case 1. right click / middle click => CANCEL
        if (btn === 1 || btn === 2) {
            this.p.onCancel?.(info)
        }
        // case 2. left click => commit
        else {
            this.p.onCommit?.(info)
        }
        routine.stop()
    }
}
