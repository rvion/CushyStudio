import type { UnifiedCanvas } from './UnifiedCanvas'

import { command } from '../../../operators/Command'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'
import { RET } from '../../../operators/RET'

export const cmd_unifiedCanvas_activateGenerateTool = command<UnifiedCanvas>({
    id: 'unifiedCanvas.activateGenerateTool',
    label: 'activate Generate Tool',
    combos: 'mod+1',
    ctx: ctx_unifiedCanvas,
    action: (t) => {
        t.enable_generate()
        return RET.SUCCESS
    },
})

export const cmd_unifiedCanvas_activateMaskTOol = command<UnifiedCanvas>({
    id: 'unifiedCanvas.activateMaskTOol',
    label: 'activate Mask Tool',
    combos: 'mod+2',
    ctx: ctx_unifiedCanvas,
    action: (t) => {
        t.enable_generate()
        return RET.SUCCESS
    },
})
