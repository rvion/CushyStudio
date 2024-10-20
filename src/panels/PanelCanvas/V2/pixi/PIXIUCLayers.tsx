import type { UC2$ } from '../ucV2'

import { observer } from 'mobx-react-lite'

import { useUnifiedCanvas } from '../../states/UnifiedCanvasCtx'
import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCLayers = observer(function UCLayers_(p: { uc2: UC2$['$Field'] }) {
    const uc1 = useUnifiedCanvas()
    const uc2 = p.uc2
    return (
        <>
            {/* all layers */}
            {uc2.Layers.items.map((layer) => {
                const content = layer.fields.content
                if (!layer.Visible.value) return null
                const placement = layer.fields.placement
                return content.match({
                    image: (image) => (
                        <PixiMediaImage //
                            key={layer.id}
                            layer={layer}
                            onClick={() => uc1.selectLayer(layer)}
                            placement={placement}
                            mediaImage={image.value}
                        />
                    ),
                    aiGeneration: (x) =>
                        x.Image.value_or_zero ? (
                            <PixiMediaImage //
                                key={layer.id}
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
