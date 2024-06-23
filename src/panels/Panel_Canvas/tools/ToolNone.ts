import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolNone extends Tool {
    constructor(public uc: UnifiedCanvas) {
        super()
    }
}
