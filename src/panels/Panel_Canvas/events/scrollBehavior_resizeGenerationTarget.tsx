import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { KonvaEventObject } from 'konva/lib/Node'

import { runInAction } from 'mobx'

export const scrollBehavior_resizeGenerationTarget = (
    //
    canvas: UnifiedCanvas,
    e: KonvaEventObject<WheelEvent>,
) => {
    if (canvas.tool === 'generate') {
        let direction = e.evt.deltaY > 0 ? -1 : 1
        runInAction(() => {
            const sel = canvas.activeSelection
            const size = canvas.snapSize
            const data = sel.stableData
            data.width += 2 * size * direction
            data.height += 2 * size * direction
            data.x -= size * direction
            data.y -= size * direction
            sel.applyStableData()
        })
    }
}
