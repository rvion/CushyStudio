import type { UC2$ } from '../stateV2/ucV2'

import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'
import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCLayers = obs(function UCLayers_(p: { uc2: UC2$['{field}'] }) {
   const uc1 = useUnifiedCanvas()
   const uc2 = p.uc2
   return (
      <>
         {/* all layers */}
         {uc2.layers.items.map((layer) => {
            const content = layer.zFields.content
            if (!layer.visible.zValue) return null
            const placement = layer.zFields.placement
            return content.matchExhaustive({
               image: (image) => (
                  <PixiMediaImage //
                     key={layer.zUid}
                     layer={layer}
                     onClick={() => uc1.selectLayer(layer)}
                     placement={placement}
                     mediaImage={image.zValue}
                  />
               ),
               aiGeneration: (x) =>
                  x.image.zValueOrZero ? (
                     <PixiMediaImage //
                        key={layer.zUid}
                        layer={layer}
                        onClick={() => uc1.selectLayer(layer)}
                        placement={placement}
                        mediaImage={x.image.zValueOrZero}
                     />
                  ) : null,
            })
         })}
      </>
   )
})
