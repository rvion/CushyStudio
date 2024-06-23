import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolMove extends Tool {
    id: 'move' = 'move'
    category: 'compositio' = 'compositio'
    icon: IconName = 'mdiPlay'
    description = '....'

    constructor(public uc: UnifiedCanvas) {
        super()
    }
}
