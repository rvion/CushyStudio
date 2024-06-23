import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool } from '../utils/_ICanvasTool'

export class ToolPaint implements ICanvasTool {
    id: 'paint' = 'paint'
    category: 'draw' = 'draw'
    icon: IconName = 'mdiBrush'
    description = 'draw on top of the canvas'

    constructor(public canvas: UnifiedCanvas) {}

    onMove() {
        const uc = this.canvas
        uc.brush //
            .x(uc.infos.viewPointerX)
            .y(uc.infos.viewPointerY)
        return true
    }
}
