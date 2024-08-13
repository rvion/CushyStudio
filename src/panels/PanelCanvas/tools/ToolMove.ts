import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool } from '../utils/_ICanvasTool'

export class ToolMove implements ICanvasTool {
    id: 'move' = 'move'
    category: 'composition' = 'composition'
    icon: IconName = 'mdiMoveResize'
    description = 'move / resize any items in the canvas'
    constructor(public canvas: UnifiedCanvas) {}
}
