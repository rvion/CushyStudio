import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolMask extends Tool {
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
