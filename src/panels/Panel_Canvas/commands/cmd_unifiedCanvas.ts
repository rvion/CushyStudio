import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { command } from '../../../operators/Command'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'
import { Trigger } from '../../../operators/RET'

export const cmd_unifiedCanvas_activateGenerateTool = command<UnifiedCanvas>({
    id: 'unifiedCanvas.activateGenerateTool',
    label: 'activate Generate Tool',
    combos: '1',
    ctx: ctx_unifiedCanvas,
    action: (t) => {
        t.enable_generate()
        return Trigger.Success
    },
})

export const cmd_unifiedCanvas_activateMaskTOol = command<UnifiedCanvas>({
    id: 'unifiedCanvas.activateMaskTOol',
    label: 'activate Mask Tool',
    combos: '2',
    ctx: ctx_unifiedCanvas,
    action: (t) => {
        t.enable_mask()
        return Trigger.Success
    },
})
