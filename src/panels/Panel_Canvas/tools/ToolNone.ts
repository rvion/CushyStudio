import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'
import type { ICanvasTool } from './_ICanvasTool'

export class ToolNone implements ICanvasTool {
    id: 'none' = 'none'
    category: 'wft' = 'wft'
    icon: IconName = 'mdiWatchImport'
    description = '....'

    constructor(public canvas: UnifiedCanvas) {}
}
