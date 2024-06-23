import type { IconName } from '../../../csuite/icons/icons'
import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { snap } from '../utils/snap'
import { Tool } from './Tool'

export class ToolGenerate extends Tool {
    id: 'generate' = 'generate'
    category: 'generate' = 'generate'
    icon: IconName = 'mdiPlay'
    description = '....'

    constructor(public uc: UnifiedCanvas) {
        super()
    }

    onStart(): void {
        this.uc.activeSelection.show()
    }

    onStop(): void {
        this.uc.activeSelection.hide()
    }

    onMouseMove() {
        const uc = this.uc
        const sel = uc.activeSelection
        Object.assign(sel.stableData, {
            x: snap(uc.infos.viewPointerX - sel.stableData.width / 2, uc.snapSize),
            y: snap(uc.infos.viewPointerY - sel.stableData.height / 2, uc.snapSize),
        })
        sel.applyStableData()
        return true
    }
}
