import type { UC2$ } from '../stateV2/ucV2'

import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCMasks = obs(function UCMasks_(p: { uc2: UC2$['z$Field'] }) {
   const uc2 = p.uc2
   return (
      <>
         {uc2.masks.items.map((i) => {
            const image = i.zFields.image
            const placement = i.zFields.placement
            if (!i.visible.zValue) return null
            if (image == null) return null
            return (
               <PixiMediaImage //
                  key={i.zUid}
                  placement={placement}
                  mediaImage={image.zValue}
                  alpha={0.5}
               />
            )
         })}
      </>
   )
})
