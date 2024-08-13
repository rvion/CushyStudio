import { command } from '../../../csuite/commands/Command'
import { Trigger } from '../../../csuite/trigger/Trigger'
import { ctx_unifiedCanvas } from '../../../operators/contexts/ctx_unifiedCanvas'
import { UnifiedCanvas } from '../states/UnifiedCanvas'

// TODO: Could/Should be a pie menu for toggling any of the shelfs in the panel/region.
export const cmd_canvas_toggleToolshelf = command<UnifiedCanvas>({
    id: 'canvas.toggleToolshelf',
    ctx: ctx_unifiedCanvas,
    combos: 't',
    description: 'Toggles the Toolshelf on the left side of the panel/region',
    label: 'Toggle Toolshelf',
    action: (uc) => {
        uc.toolShelf.visible = !uc.toolShelf.visible
        return Trigger.Success
    },
})
