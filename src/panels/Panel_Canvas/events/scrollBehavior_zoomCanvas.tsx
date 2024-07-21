import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

export const scrollBehavior_zoomCanvas = (
    //
    canvas: UnifiedCanvas,
    e: KonvaEventObject<WheelEvent>,
) => {
    const stage = e.target.getStage()
    if (stage == null) return console.warn(`🔶 missing stage`)
    // console.log(`[🧐😀] stage`, stage)
    // if (e.evt.ctrlKey) {
    const scaleBy = 1.15
    // stop default scrolling
    e.evt.preventDefault()

    var oldScale = stage.scaleX()
    var pointer = stage.getPointerPosition()
    if (pointer == null) return console.log(`[❌] nope`)

    var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
    }

    // how to scale? Zoom in? Or zoom out?
    let direction = e.evt.deltaY > 0 ? -1 : 1

    // when we zoom on trackpad, e.evt.ctrlKey is true
    // in that case lets revert direction
    if (e.evt.ctrlKey) {
        direction = -direction
    }

    var newScale =
        direction > 0 //
            ? oldScale * scaleBy
            : oldScale / scaleBy

    stage.scale({ x: newScale, y: newScale })

    var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    }
    canvas.infos.canvasX = newPos.x
    canvas.infos.canvasY = newPos.y
    console.log(`[🧐] newPos`, newPos)
    stage.position(newPos)
    return
}
