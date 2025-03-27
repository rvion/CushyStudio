import type { UC2$ } from '../stateV2/ucV2'

import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'
import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCLayers = obs(function UCLayers_(p: { uc2: UC2$['Ҩfield'] }) {
   const uc1 = useUnifiedCanvas()
   const uc2 = p.uc2
   return (
      <>
         {/* all layers */}
         {uc2.layers.items.map((layer) => {
            const content = layer.ϟfields.content
            if (!layer.visible.ϟvalue) return null
            const placement = layer.ϟfields.placement
            return content.matchExhaustive({
               image: (image) => (
                  <PixiMediaImage //
                     key={layer.ϟuid}
                     layer={layer}
                     onClick={() => uc1.selectLayer(layer)}
                     placement={placement}
                     mediaImage={image.ϟvalue}
                  />
               ),
               aiGeneration: (x) =>
                  x.image.ϟvalue_or_zero ? (
                     <PixiMediaImage //
                        key={layer.ϟuid}
                        layer={layer}
                        onClick={() => uc1.selectLayer(layer)}
                        placement={placement}
                        mediaImage={x.image.ϟvalue_or_zero}
                     />
                  ) : null,
            })
         })}
      </>
   )
})
