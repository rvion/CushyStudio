import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

export const scrollBehavior_resizeBrush = (
    //
    canvas: UnifiedCanvas,
    e: KonvaEventObject<WheelEvent>,
) => {
    const newSize = Math.max(1, canvas.maskToolSize + e.evt.deltaY / 200)
    canvas.setBrushSize(newSize)
    return
}
