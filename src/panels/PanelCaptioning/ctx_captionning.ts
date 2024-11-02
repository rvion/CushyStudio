import type { UnifiedCanvas } from '../../panels/PanelCanvas/states/UnifiedCanvas'
import type { CaptioningDoc } from './PanelCaptioningState'
import type { PanelCaptioningState } from './PanelCaptioningUI'

import { command, CommandContext } from '../../csuite/commands/Command'
import { regionMonitor } from '../../csuite/regions/RegionMonitor'
import { Trigger } from '../../csuite/trigger/Trigger'
import { PanelCaptioningCtx } from './PanelCaptioningCtx'

export const ctx_captionning = new CommandContext<PanelCaptioningState>('Captioning', () => {
   console.log('[FD] LOLLLLL', regionMonitor.isOver(PanelCaptioningCtx))
   return regionMonitor.isOver(PanelCaptioningCtx) ?? Trigger.UNMATCHED
})

export const cmd_captioning_selectPreviousImage = command({
   id: 'captioning.select_previous_image',
   ctx: ctx_captionning,
   combos: 'pageup',
   description: '',
   label: 'Select Previous Image',
   action: (/* HERE --> */ ctx) => {
      ctx.doc.value.activeImage.index -= 1
      ctx.update()
      return Trigger.Success
   },
})

export const cmd_captioning_selectNextImage = command({
   id: 'captioning.select_next_image',
   ctx: ctx_captionning,
   combos: 'pagedown',
   description: '',
   label: 'Select Previous Image',
   action: (/* HERE --> */ ctx) => {
      ctx.doc.value.activeImage.index += 1
      ctx.update()
      return Trigger.Success
   },
})

export const cmd_captioningDeleteActiveCaption = command({
   id: 'captioning.delete_active_caption',
   ctx: ctx_captionning,
   combos: 'delete',
   description: '',
   label: 'Delete Active Caption',
   action: (/* HERE --> */ ctx) => {
      console.log('[FD] YOOO', ctx)
      ctx.doc.ActiveImage.Captions.removeItemAt(ctx.doc.ActiveImage.Index.value)
      return Trigger.Success
   },
})
