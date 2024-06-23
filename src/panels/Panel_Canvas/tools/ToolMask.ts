import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool, ToolMovePayload, ToolPressPayload } from './_ICanvasTool'

import Konva from 'konva'

import { bang } from '../../../csuite/utils/bang'

export class ToolMask implements ICanvasTool {
    id: 'mask' = 'mask'
    category: 'generate' = 'generate'
    icon: IconName = 'mdiFaceMask'
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

    onMove = ({ stroke }: ToolMovePayload) => {
        const uc = this.canvas

        // update brush preview position
        uc.brush //
            .x(uc.infos.viewPointerX)
            .y(uc.infos.viewPointerY)

        if (stroke == null) return
        // return true

        const canvas = this.canvas
        // ⏸️ e.evt.preventDefault() // prevent scrolling on touch devices
        const pos = {
            x: canvas.infos.viewPointerX,
            y: canvas.infos.viewPointerY,
        }
        // console.log(`[🤠] onMove`, pos)
        var newPoints = bang(canvas._lastLine) //
            .points()
            .concat([pos.x, pos.y])
        // ⏸️ canvas.undoBuffer.push(() => bang(canvas._lastLine).points(bang(canvas._lastLine).points().slice(0, -2)))
        bang(canvas._lastLine).points(newPoints)
        return false
    }

    onCancel = () => {
        // TODO
        return false
    }

    onCommit = () => {
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
        canvas.undoBuffer.push(() => {
            lastLine.destroy()
            // 🔴 TODO: remove that, will cause bugs; sadness.
            if (!maskLayer.hasChildren()) maskLayer.add(new Konva.Rect({ x: 0, y: 0, width: 1, height: 1, opacity: 0 }))
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
