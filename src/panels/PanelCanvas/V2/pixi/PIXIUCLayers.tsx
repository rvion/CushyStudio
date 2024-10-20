import type { UC2$ } from '../ucV2'

import { observer } from 'mobx-react-lite'

import { PixiMediaImage } from './PixiMediaImage'

export const PIXIUCLayers = observer(function UCLayers_(p: { uc2: UC2$['$Field'] }) {
    const uc2 = p.uc2
    return (
        <>
            {/* all layers */}
            {uc2.Layers.items.map((i) => {
                const x = i.fields.content
                if (!i.Visible.value) return null
                const placement = i.fields.placement
                return x.when1({
                    image: (image) => (
                        <PixiMediaImage //
                            key={i.id}
                            placement={placement}
                            mediaImage={image.value}
                        />
                    ),
                    aiGeneration: (x) =>
                        x.Image.value_or_zero ? (
                            <PixiMediaImage //
                                key={i.id}
                                placement={placement}
                                mediaImage={x.Image.value_or_zero}
                            />
                        ) : null,
                })
            })}
        </>
    )
})
