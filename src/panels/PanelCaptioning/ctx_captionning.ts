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
   action: (ctx) => {
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
   label: 'Select Next Image',
   action: (ctx) => {
      ctx.doc.value.activeImage.index += 1
      ctx.update()
      return Trigger.Success
   },
})

export const cmd_captioning_selectPreviousCaption = command({
   id: 'captioning.select_previous_caption',
   ctx: ctx_captionning,
   combos: 'up',
   description: '',
   label: 'Select Previous Caption',
   action: (ctx) => {
      ctx.doc.value.activeCaption.index -= 1
      ctx.update()
      return Trigger.Success
   },
})

export const cmd_captioning_selectNextCaption = command({
   id: 'captioning.select_next_caption',
   ctx: ctx_captionning,
   combos: 'down',
   description: '',
   label: 'Select Next Caption',
   action: (ctx) => {
      ctx.doc.value.activeCaption.index += 1
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
   action: (ctx) => {
      ctx.doc.ActiveImage.Captions.removeItemAt(ctx.doc.ActiveCaption.Index.value)
      ctx.updateCaptionFile()
      ctx.update()
      return Trigger.Success
   },
})
