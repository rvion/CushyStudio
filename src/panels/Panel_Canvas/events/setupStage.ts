import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool, ToolCommitPayload } from '../utils/_ICanvasTool'
import type { KonvaEventObject } from 'konva/lib/Node'

import { Stage } from 'konva/lib/Stage'
import { observable } from 'mobx'

import { MouseBtn } from '../../../csuite/types/MouseBtn'
import { Stroke } from '../utils/_StrokeInfo'
import { moveBehaviour_dragView } from './moveBehaviour_dragView'
import { moveBehaviour_updatePointerInfos } from './moveBehaviour_updatePointerInfos'
import { scrollBehavior_zoomCanvas } from './scrollBehavior_zoomCanvas'

export const setupStage = (canvas: UnifiedCanvas) => {
    const stage: Stage = canvas.stage
    let pressedButton: MouseBtn = MouseBtn.NONE

    const current: {
        stroke: Maybe<Stroke>
        tool: Maybe<ICanvasTool>
    } = observable({
        stroke: null,
        tool: null,
    })

    // scroll wheel is reserved for zooming, regardless which tool is used
    stage.on('wheel', (e: KonvaEventObject<WheelEvent>) => {
        scrollBehavior_zoomCanvas(canvas, e)
    })

    stage.on('mousedown touchstart', function (ev: KonvaEventObject<MouseEvent>) {
        pressedButton = ev.evt.button as MouseBtn
        const button = ev.evt.button as MouseBtn

        // middle button is reserved for dragging the view
        if (button === MouseBtn.MBMiddle) return

        // right button is reserved for context menu
        if (button === MouseBtn.MBRight) return

        // left button is reserved to start a new stroke
        if (button === MouseBtn.MBLeft) {
            const infos = canvas.infos
            const stroke = new Stroke({
                x: canvas.pointerPosition.x,
                y: canvas.pointerPosition.y,
            })
            current.stroke = stroke
            current.tool = canvas.currentTool
            current.tool.onPress?.({ stroke, infos, canvas, ev })
        }
    })

    stage.on('mousemove touchmove', function (ev) {
        /** this event DOES NOT HAVE BUTTON */
        // 1. always update the pointer position
        moveBehaviour_updatePointerInfos(ev, canvas)

        // 2. if middle button is pressed, drag the view
        if (pressedButton === MouseBtn.MBMiddle) {
            console.log(`[🤠] should drag view`)
            moveBehaviour_dragView(ev, canvas)
            return
        }

        // const tool = current.tool ?? canvas.currentTool
        const tool = canvas.currentTool
        tool.onMove?.({
            stroke: current?.stroke,
            canvas,
            infos: canvas.infos,
            ev,
        })
    })

    stage.on('mouseup touchend', function (ev) {
        pressedButton = MouseBtn.NONE
        const stroke = current.stroke
        if (stroke == null) return
        current.stroke = null
        canvas.currentTool.onRelease?.({
            stroke,
            canvas,
            infos: canvas.infos,
            ev,
        })
    })
}
