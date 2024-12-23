import { CommandContext } from '../../csuite/commands/Command'
import { Trigger } from '../../csuite/trigger/Trigger'
import { MediaImageL } from '../../models/MediaImage'

export const ctx_image = new CommandContext<MediaImageL>('over image', () => {
   if (
      // cushy.layout.currentTabIs('Gallery') && //
      cushy.layout.currentHoveredTabIs('Gallery') && //
      // regionMonitorcurrentHoveredTabIs
      cushy.hovered instanceof MediaImageL
   )
      return cushy.hovered
   return Trigger.UNMATCHED
})
