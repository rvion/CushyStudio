import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolNone extends Tool {
    id: 'noe' = 'noe'
    category: 'wft' = 'wft'
    icon: IconName = 'mdiPlay'
    description = '....'

    constructor(public uc: UnifiedCanvas) {
        super()
    }
}
