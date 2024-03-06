import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { UnifiedCanvasTool } from '../states/UnifiedCanvasTool'
import type { KonvaEventObject } from 'konva/lib/Node'

import Konva from 'konva'
import { Stage } from 'konva/lib/Stage'

import { UnifiedStep } from '../states/UnifiedStep'
import { bang } from 'src/utils/misc/bang'
import { toastError } from 'src/utils/misc/toasts'

enum MouseBtn {
    NONE = -1,
    MBLeft = 0,
    MBMiddle = 1,
    MBRight = 2,
}
export const setupStageForPainting = (canvas: UnifiedCanvas) => {
    const stage: Stage = canvas.stage

    let pressedButton: MouseBtn = MouseBtn.NONE
    let stableTool: Maybe<UnifiedCanvasTool | 'drag'> = null
    let startPos: Maybe<{ x: number; y: number }> = null
    stage.on('mousedown touchstart', function (e: KonvaEventObject<MouseEvent>) {
        pressedButton = e.evt.button as MouseBtn
        const button = e.evt.button
        if (button === MouseBtn.MBLeft && canvas.tool === 'mask') {
            stableTool = canvas.tool
        } else if (button === MouseBtn.MBRight) {
            stableTool = 'drag'
        } else if (button === MouseBtn.MBLeft && canvas.tool === 'generate') {
            stableTool = 'generate'
        }
        startPos = canvas.pointerPosition
        if (startPos == null) return console.log(`[⁉️] paint failed: no cursor position`)

        // ------------------------------------------------------------------------------
        // mask
        if (stableTool === 'mask') {
            // 1. ensure pointer
            const activeMask = canvas.activeMask
            if (activeMask == null) return console.log(`[⁉️] paint failed: no canvas.activeMask.layer`)
            canvas._lastLine = new Konva.Line({
                opacity: 0.5,
                stroke: activeMask.color, // canvas.maskColor, // 🔴
                strokeWidth: canvas.maskToolSize,
                lineCap: 'round',
                lineJoin: 'round',
                // add point twice, so we have some drawings even on a simple click
                points: [startPos.x, startPos.y, startPos.x, startPos.y],
            })
            canvas.tempLayer.add(canvas._lastLine)
        } else if (stableTool === 'generate') {
            e.cancelBubble = true
            e.evt.preventDefault()
            e.evt.stopPropagation()
            const res = canvas.activeSelection.saveImage()
            if (res == null) return toastError('❌ FAILED to canvas.activeSelection.saveImage')
            const { image, mask } = res
            if (image && canvas.currentDraft) {
                const step = canvas.currentDraft.start({
                    focusOutput: false,
                    imageToStartFrom: image,
                })
                const us = new UnifiedStep(canvas, step)
                canvas.steps.push(us)
            }
        }
    })

    // and core function - drawing
    stage.on('mousemove touchmove', function (e) {
        if (stableTool === 'drag') {
            const prevX = canvas.stage.x()
            const prevY = canvas.stage.y()
            canvas.stage.x(prevX + e.evt.movementX)
            canvas.stage.y(prevY + e.evt.movementY)
        }
        if (stableTool === 'mask') {
            e.evt.preventDefault() // prevent scrolling on touch devices
            const pos = { x: canvas.infos.viewPointerX, y: canvas.infos.viewPointerY }
            var newPoints = bang(canvas._lastLine).points().concat([pos.x, pos.y])
            // ⏸️ canvas.undoBuffer.push(() => bang(canvas._lastLine).points(bang(canvas._lastLine).points().slice(0, -2)))
            bang(canvas._lastLine).points(newPoints)
        }
    })

    stage.on('mouseup touchend', function () {
        if (stableTool === 'mask') {
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

        // reset stable tool and startPos
        stableTool = null
        startPos = null
    })
}
