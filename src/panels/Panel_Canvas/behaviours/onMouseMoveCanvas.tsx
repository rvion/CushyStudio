import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

export const onMouseMoveCanvas = (uc: UnifiedCanvas, e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage()
    if (stage == null) return console.warn(`🔶 missing stage`)
    console.log(`[👙] stage`, stage)
    const scaleBy = 1.15
    // stop default scrolling
    e.evt.preventDefault()

    var scale = stage.scaleX()
    var pointer = stage.getPointerPosition()
    if (pointer == null) return console.log(`[❌] nope`)
    const canvasX = stage.x()
    const canvasY = stage.y()
    uc.infos = {
        canvasX,
        canvasY,
        viewPointerX: (pointer.x - stage.x()) / scale,
        viewPointerY: (pointer.y - stage.y()) / scale,
        viewportPointerX: pointer.x,
        viewportPointerY: pointer.y,
        isDown: e.evt.buttons === 1,
        scale: scale,
    }

    // how to scale? Zoom in? Or zoom out?
    // stage.position(newPos)
}