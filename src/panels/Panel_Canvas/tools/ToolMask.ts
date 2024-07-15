import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool, ToolMovePayload, ToolPressPayload } from '../utils/_ICanvasTool'

import Konva from 'konva'

import { bang } from '../../../csuite/utils/bang'

export class ToolMask implements ICanvasTool {
    id: 'mask' = 'mask'
    category: 'generate' = 'generate'
    icon: IconName = 'mdiTransitionMasked'
    description = 'draw a mask on the canvas'

    constructor(public canvas: UnifiedCanvas) {}

    onPress({ stroke }: ToolPressPayload) {
        // 1. ensure pointer
        const canvas = this.canvas
        const activeMask = canvas.activeMask
        if (activeMask == null) return console.log(`[⁉️] paint failed: no canvas.activeMask.layer`)
        canvas._lastLine = new Konva.Line({
            opacity: 0.5,
            stroke: activeMask.color, // canvas.maskColor, // 🔴
            strokeWidth: canvas.maskToolSize,
            lineCap: 'round',
            lineJoin: 'round',
            // add point twice, so we have some drawings even on a simple click
            points: [stroke.startX, stroke.startY, stroke.startX, stroke.startY],
        })
        canvas.tempLayer.add(canvas._lastLine)
    }

    onMove = ({ stroke, ev, infos }: ToolMovePayload) => {
        const canvas = this.canvas
        ev.evt.preventDefault() // prevent scrolling on touch devices
        const x = infos.viewPointerX
        const y = infos.viewPointerY
        canvas.brush.x(x).y(y)
        if (stroke == null) return
        // WTF 🔴
        /* 🔴 */ const newPoints = bang(canvas._lastLine).points().concat([x, y])
        /* 🔴 */ bang(canvas._lastLine).points(newPoints)
    }

    onRelease = () => {
        const canvas = this.canvas
        const lastLine = bang(canvas._lastLine)
        // ----------
        // conclude the draw, by re-caching the layer, and re-setting it's opacity to 0
        const maskLayer = canvas.activeMask!.layer
        lastLine.opacity(1)
        maskLayer.opacity(1)
        maskLayer.add(lastLine)
        maskLayer.opacity(0.5)
        maskLayer.cache()
        // ----------
        canvas.addToUndo(() => {
            lastLine.destroy()

            // 🔴 TODO: remove that, will cause bugs; sadness.
            if (!maskLayer.hasChildren()) {
                maskLayer.add(new Konva.Rect({ x: 0, y: 0, width: 1, height: 1, opacity: 0 }))
            }
            maskLayer.cache()
        })
    }
}

// {
//     onStart: () => {
//         const canvas = this.uc
//         // 1. ensure pointer
//         const activeMask = canvas.activeMask
//         if (activeMask == null) return console.log(`[⁉️] paint failed: no canvas.activeMask.layer`)
//         canvas._lastLine = new Konva.Line({
//             opacity: 0.5,
//             stroke: activeMask.color, // canvas.maskColor, // 🔴
//             strokeWidth: canvas.maskToolSize,
//             lineCap: 'round',
//             lineJoin: 'round',
//             // add point twice, so we have some drawings even on a simple click
//             points: [startPos.x, startPos.y, startPos.x, startPos.y],
//         })
//         canvas.tempLayer.add(canvas._lastLine)
//     },
//     onStop()
// }
