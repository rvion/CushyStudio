import type { UC2$ } from '../stateV2/ucV2'

import { observer } from 'mobx-react-lite'

import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCMasks = observer(function UCMasks_(p: { uc2: UC2$['$Field'] }) {
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
                  key={i.id}
                  placement={placement}
                  mediaImage={image.value}
                  alpha={0.5}
               />
            )
         })}
      </>
   )
})
