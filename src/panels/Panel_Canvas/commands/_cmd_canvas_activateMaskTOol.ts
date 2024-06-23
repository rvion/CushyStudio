import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { command } from '../../../csuite/commands/Command'
import { Trigger } from '../../../csuite/trigger/Trigger'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'

export const cmd_canvas_activateMaskTOol = command<UnifiedCanvas>({
    id: 'unifiedCanvas.activateMaskTOol',
    label: 'activate Mask Tool',
    combos: '2',
    ctx: ctx_unifiedCanvas,
    action: (t) => {
        t.currentTool = t.toolMask
        return Trigger.Success
    },
})
