import type { UnifiedCanvas } from '../states/UnifiedCanvas'

import { command } from '../../../csuite/commands/Command'
import { Trigger } from '../../../csuite/trigger/Trigger'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'

export const cmd_canvas_undo = command<UnifiedCanvas>({
    id: 'unifiedCanvas.undo',
    label: 'activate Mask Tool',
    combos: 'mod+z',
    ctx: ctx_unifiedCanvas,
    action: (uc) => {
        uc.undo()
        return Trigger.Success
    },
})
