import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolPaint extends Tool {
    id: 'paint' = 'paint'
    category: 'draw' = 'draw'
    icon: IconName = 'mdiPlay'
    description = '....'

    constructor(public uc: UnifiedCanvas) {
        super()
    }

    onMouseMove() {
        const uc = this.uc
        uc.brush //
            .x(uc.infos.viewPointerX)
            .y(uc.infos.viewPointerY)
        return true
    }
}
