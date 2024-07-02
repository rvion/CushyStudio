import type { UnifiedCanvas } from '../../panels/Panel_Canvas/states/UnifiedCanvas'

import { CommandContext } from '../../csuite/commands/Command'
import { regionMonitor } from '../../csuite/regions/RegionMonitor'
import { Trigger } from '../../csuite/trigger/Trigger'
import { UnifiedCanvasCtx } from '../../panels/Panel_Canvas/states/UnifiedCanvasCtx'

export const ctx_unifiedCanvas = new CommandContext<UnifiedCanvas>(
    'UnifiedCanvas',
    () => regionMonitor.isOver(UnifiedCanvasCtx) ?? Trigger.UNMATCHED,
)
