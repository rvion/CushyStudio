import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

export const moveBehaviour_dragView = (e: KonvaEventObject<MouseEvent>, canvas: UnifiedCanvas): void => {
    const prevX = canvas.stage.x()
    const prevY = canvas.stage.y()
    canvas.stage.x(prevX + e.evt.movementX)
    canvas.stage.y(prevY + e.evt.movementY)
}
