import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolStamp extends Tool {
    id: 'stamp' = 'stamp'
    category: 'draw' = 'draw'
    icon: IconName = 'mdiPlay'
    description = '....'

    constructor(public uc: UnifiedCanvas) {
        super()
    }
}
