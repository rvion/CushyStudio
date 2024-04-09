import { MediaImageL } from '../../models/MediaImage'
import { CommandContext } from '../Command'
import { RET } from '../RET'

export const ctx_image = new CommandContext<MediaImageL>('image', () => {
    if (
        // cushy.layout.currentTabIs('Gallery') && //
        cushy.layout.currentHoveredTabIs('Gallery') && //
        // regionMonitorcurrentHoveredTabIs
        cushy.hovered instanceof MediaImageL
    )
        return cushy.hovered
    return RET.UNMATCHED
})
