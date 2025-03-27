import type { UC2$ } from '../stateV2/ucV2'

import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCMasks = obs(function UCMasks_(p: { uc2: UC2$['Ҩfield'] }) {
   const uc2 = p.uc2
   return (
      <>
         {uc2.masks.items.map((i) => {
            const image = i.ϟfields.image
            const placement = i.ϟfields.placement
            if (!i.visible.ϟvalue) return null
            if (image == null) return null
            return (
               <PixiMediaImage //
                  key={i.ϟuid}
                  placement={placement}
                  mediaImage={image.ϟvalue}
                  alpha={0.5}
               />
            )
         })}
      </>
   )
})
