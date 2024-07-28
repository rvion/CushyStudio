import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool } from '../utils/_ICanvasTool'

export class ToolStamp implements ICanvasTool {
    id: 'stamp' = 'stamp'
    category: 'draw' = 'draw'
    icon: IconName = 'mdiStamper'
    description = '....'

    constructor(public canvas: UnifiedCanvas) {}
}
