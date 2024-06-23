import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ToolCommitPayload, ToolFinishPayload, ToolMovePayload } from '../tools/_ICanvasTool'
import type { KonvaEventObject } from 'konva/lib/Node'

import { Stage } from 'konva/lib/Stage'

import { MouseBtn } from '../../../csuite/types/MouseBtn'
import { moveBehaviour_dragView } from '../behaviours/moveBehaviour_dragView'
import { moveBehaviour_updatePointerInfos } from '../behaviours/moveBehaviour_updatePointerInfos'
import { scrollBehavior_zoomCanvas } from '../behaviours/scrollBehavior_zoomCanvas'
import { Stroke } from '../tools/_StrokeInfo'

export const setupStageForPainting = (canvas: UnifiedCanvas) => {
    const stage: Stage = canvas.stage
    let pressedButton: MouseBtn = MouseBtn.NONE
    const stroke = new Stroke()

    stage.on('wheel', (e: KonvaEventObject<WheelEvent>) => {
        scrollBehavior_zoomCanvas(canvas, e)
    })

    stage.on('mousedown touchstart', function (ev: KonvaEventObject<MouseEvent>) {
        pressedButton = ev.evt.button as MouseBtn
        const button = ev.evt.button as MouseBtn
        const infos = canvas.infos
        stroke.reset({ x: canvas.pointerPosition.x, y: canvas.pointerPosition.y })

        if (button === MouseBtn.MBMiddle) return
        canvas.currentTool.onPress?.({ stroke, infos, canvas, ev })
    })

    stage.on('mousemove touchmove', function (ev) {
        const button = ev.evt.button as MouseBtn
        moveBehaviour_updatePointerInfos(ev, canvas)
        if (button === MouseBtn.MBMiddle) {
            moveBehaviour_dragView(ev, canvas)
            return
        }
        const movePayload: ToolMovePayload = { stroke, canvas, infos: canvas.infos, ev }
        canvas.currentTool.onMove?.(movePayload)
    })

    stage.on('mouseup touchend', function (ev) {
        pressedButton = ev.evt.button as MouseBtn
        const button = ev.evt.button as MouseBtn
        if (button === MouseBtn.MBMiddle) return
        if (button === MouseBtn.MBRight) {
            const finish: ToolFinishPayload = { stroke, canvas, infos: canvas.infos, ev }
            canvas.currentTool.onCancel?.(finish)
            canvas.currentTool.onFinish?.(finish)
            return
        }
        if (button === MouseBtn.MBLeft) {
            const commit: ToolCommitPayload = { stroke, canvas, infos: canvas.infos, ev }
            canvas.currentTool.onCommit?.(commit)
            canvas.currentTool.onFinish?.(commit)
            return
        }
    })
}

// ⚪️ if (stableTool === 'mask') {
// ⚪️     e.evt.preventDefault() // prevent scrolling on touch devices
// ⚪️     const pos = { x: canvas.infos.viewPointerX, y: canvas.infos.viewPointerY }
// ⚪️     var newPoints = bang(canvas._lastLine).points().concat([pos.x, pos.y])
// ⚪️     // ⏸️ canvas.undoBuffer.push(() => bang(canvas._lastLine).points(bang(canvas._lastLine).points().slice(0, -2)))
// ⚪️     bang(canvas._lastLine).points(newPoints)
// ⚪️ }
// ⚪️ if (stableTool === 'mask') {
// ⚪️     const lastLine = bang(canvas._lastLine)
// ⚪️     // ----------
// ⚪️     // conclude the draw, by re-caching the layer, and re-setting it's opacity to 0
// ⚪️     const maskLayer = canvas.activeMask!.layer
// ⚪️     lastLine.opacity(1)
// ⚪️     maskLayer.opacity(1)
// ⚪️     maskLayer.add(lastLine)
// ⚪️     maskLayer.opacity(0.5)
// ⚪️     maskLayer.cache()
// ⚪️     // ----------
// ⚪️     canvas.undoBuffer.push(() => {
// ⚪️         lastLine.destroy()
// ⚪️         // 🔴 TODO: remove that, will cause bugs; sadness.
// ⚪️         if (!maskLayer.hasChildren()) maskLayer.add(new Konva.Rect({ x: 0, y: 0, width: 1, height: 1, opacity: 0 }))
// ⚪️         maskLayer.cache()
// ⚪️     })
// ⚪️ }
// reset stable tool and startPos
// stableTool = null
// startPos = null

// if (button === MouseBtn.MBLeft && canvas.tool === 'mask') {
//     stableTool = canvas.tool
// } else if (button === MouseBtn.MBRight) {
//     stableTool = 'drag'
// } else if (button === MouseBtn.MBLeft && canvas.tool === 'generate') {
//     stableTool = 'generate'
// }
