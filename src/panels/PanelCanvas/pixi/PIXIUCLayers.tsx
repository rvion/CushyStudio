import type { UC2$ } from '../stateV2/ucV2'

import { useUnifiedCanvas } from '../states/UnifiedCanvasCtx'
import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCLayers = obs(function UCLayers_(p: { uc2: UC2$['$field'] }) {
   const uc1 = useUnifiedCanvas()
   const uc2 = p.uc2
   return (
      <>
         {/* all layers */}
         {uc2.Layers.items.map((layer) => {
            const content = layer.fields.content
            if (!layer.Visible.value) return null
            const placement = layer.fields.placement
            return content.matchExhaustive({
               image: (image) => (
                  <PixiMediaImage //
                     key={layer._uid}
                     layer={layer}
                     onClick={() => uc1.selectLayer(layer)}
                     placement={placement}
                     mediaImage={image.value}
                  />
               ),
               aiGeneration: (x) =>
                  x.Image.value_or_zero ? (
                     <PixiMediaImage //
                        key={layer._uid}
                        layer={layer}
                        onClick={() => uc1.selectLayer(layer)}
                        placement={placement}
                        mediaImage={x.Image.value_or_zero}
                     />
                  ) : null,
            })
         })}
      </>
   )
})
