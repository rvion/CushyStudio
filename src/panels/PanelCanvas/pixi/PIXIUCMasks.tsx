import type { UC2$ } from '../stateV2/ucV2'

import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCMasks = obs(function UCMasks_(p: { uc2: UC2$['$field'] }) {
   const uc2 = p.uc2
   return (
      <>
         {uc2.Masks.items.map((i) => {
            const image = i.fields.image
            const placement = i.fields.placement
            if (!i.Visible.value) return null
            if (image == null) return null
            return (
               <PixiMediaImage //
                  key={i._uid}
                  placement={placement}
                  mediaImage={image.value}
                  alpha={0.5}
               />
            )
         })}
      </>
   )
})
