import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { Tool } from './Tool'

export class ToolMove extends Tool {
    constructor(public uc: UnifiedCanvas) {
        super()
    }
}
