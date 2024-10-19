import { Stage } from '@pixi/react'
import { observer } from 'mobx-react-lite'
import { type ForwardedRef, forwardRef } from 'react'

import { useUCV2 } from '../ucV2'
import { DragableSpritePixi } from './DragableSpritePixi'
import { GridPixi } from './GridPixi'
import { ViewportPixi } from './PixiViewport2'
import { RectPixi } from './RectPixi'

export const UnifiedCanvasPixi = observer(
    forwardRef(function UnifiedCanvasPixi(
        {
            width = 500,
            height = 500,
            ...rest
        }: {
            width?: number
            height?: number
        },
        ref2?: ForwardedRef<Stage>,
    ): JSX.Element {
        // const uc1 = useUnifiedCanvas()
        const uc2 = useUCV2()
        // const blurFilter = useMemo(() => new BlurFilter(2), [])
        // const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png'

        return (
            <Stage // stage root
                ref={ref2}
                width={width}
                height={height}
                options={{ background: 0x1099bb }}
            >
                <ViewportPixi // zoom/pan/pinch/scroll area
                    height={10_000}
                    width={10_000}
                    minScale={0.1}
                    maxScale={20}
                >
                    <GridPixi // background grid
                        height={10_000}
                        width={10_000}
                    />
                    <RectPixi // final frame of the image
                        {...uc2.Frame.value}
                    />
                    {/* all layers */}
                    {uc2.Layers.items.map((i) => {
                        const x = i.fields.content
                        if (!i.Visible.value) return null
                        const placement = i.fields.placement
                        return x.when1({
                            image: (image) => (
                                <DragableSpritePixi //
                                    key={i.id}
                                    placement={placement}
                                    image={image}
                                />
                            ),
                            aiGeneration: (x) => (
                                <DragableSpritePixi //
                                    key={i.id}
                                    placement={placement}
                                    image={x.Image}
                                />
                            ),
                        })
                    })}
                    {/* all masks */}
                    {uc2.Masks.items.map((i) => {
                        const image = i.fields.image
                        const placement = i.fields.placement
                        if (!i.Visible.value) return null
                        if (image == null) return null
                        return (
                            <DragableSpritePixi //
                                key={i.id}
                                placement={placement}
                                image={image}
                            />
                        )
                    })}
                </ViewportPixi>
            </Stage>
        )
    }),
)

// {/* <Sprite image={bunnyUrl} x={300} y={150} />
// <Sprite image={bunnyUrl} x={500} y={150} />
// <Sprite image={bunnyUrl} x={400} y={200} /> */}

// {/* <Container x={200} y={200}>
//     <Text
//         text='Hello World'
//         anchor={0.5}
//         x={220}
//         y={150}
//         filters={[blurFilter]}
//         style={
//             new TextStyle({
//                 align: 'center',
//                 fill: '0xffffff',
//                 fontSize: 50,
//                 letterSpacing: 20,
//                 dropShadow: true,
//                 dropShadowColor: '#E72264',
//                 dropShadowDistance: 6,
//             })
//         }
//     />
// </Container> */}
