import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { command } from '../../../csuite/commands/Command'
import { Trigger } from '../../../csuite/trigger/Trigger'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'

export const cmd_canvas_activateGenerateTool = command<UnifiedCanvas>({
    id: 'unifiedCanvas.activateGenerateTool',
    label: 'activate Generate Tool',
    combos: '1',
    ctx: ctx_unifiedCanvas,
    action: (t) => {
        t.currentTool = t.toolGenerate
        return Trigger.Success
    },
})
