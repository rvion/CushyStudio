import type { UnifiedCanvas } from '../../panels/Panel_Canvas/states/UnifiedCanvas'

import { UnifiedCanvasCtx } from '../../panels/Panel_Canvas/UnifiedCanvasCtx'
import { CommandContext } from '../Command'
import { regionMonitor } from '../RegionMonitor'
import { RET } from '../RET'

export const ctx_unifiedCanvas = new CommandContext<UnifiedCanvas>(
    'UnifiedCanvas',
    () => regionMonitor.isOver(UnifiedCanvasCtx) ?? RET.UNMATCHED,
)
