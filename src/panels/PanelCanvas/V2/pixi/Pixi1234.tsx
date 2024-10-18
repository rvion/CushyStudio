import type { UnifiedImage } from '../../states/UnifiedImage'

import { Container, Graphics, type InteractionEvents, Sprite, Stage, Text } from '@pixi/react'
import { makeAutoObservable, set } from 'mobx'
import { observer } from 'mobx-react-lite'
import { BlurFilter, type DisplayObject, Sprite as Foo, TextStyle } from 'pixi.js'
import { useEffect, useMemo, useRef } from 'react'

import { useUnifiedCanvas } from '../../states/UnifiedCanvasCtx'
import { useUCV2 } from '../stateV2'
import { DraggableSpriteUI } from './DragableSprite'
import { PixiViewport } from './PixiViewport2'
import { ResizeTestUI } from './ResizeTest'

export const PixiApp1234 = observer((): JSX.Element => {
    const uc1 = useUnifiedCanvas()
    const uc2 = useUCV2()
    const blurFilter = useMemo(() => new BlurFilter(2), [])
    const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png'
    // const ref = useRef<Stage>(null)
    // useEffect(() => {
    //     if (ref.current == null) return
    //     ref.current.
    // })

    return (
        <Stage //
            width={500}
            height={500}
            options={{ background: 0x1099bb }}
        >
            {/* <ResizeTestUI /> */}
            <PixiViewport height={2000} width={2000}>
                <Graphics
                    draw={(g) => {
                        // draw a white and black grid
                        g.lineStyle(0, 0x0, 0)
                        for (let x = 0; x < 20; x++) {
                            for (let y = 0; y < 20; y++) {
                                g.beginFill((x + y) % 2 ? 0x656565 : 0x333333)
                                g.drawRect(x * 50, y * 50, 50, 50)
                                g.endFill()
                            }
                        }
                    }}
                />
                {/* <Sprite image={bunnyUrl} x={300} y={150} />
                <Sprite image={bunnyUrl} x={500} y={150} />
                <Sprite image={bunnyUrl} x={400} y={200} /> */}
                {uc2.Layers.items.map((i) => {
                    const x = i.fields.content.fields
                    const placement = i.fields.placement
                    // TODO: need a map funciton here;
                    // if (x.aiGeneration) return <DraggableSpriteUI i={i} />
                    if (x.image != null)
                        return (
                            <DraggableSpriteUI //
                                placement={placement}
                                image={x.image}
                                // image={x.image}
                            />
                        )
                    return null
                })}

                <Container x={200} y={200}>
                    <Text
                        text='Hello World'
                        anchor={0.5}
                        x={220}
                        y={150}
                        filters={[blurFilter]}
                        style={
                            new TextStyle({
                                align: 'center',
                                fill: '0xffffff',
                                fontSize: 50,
                                letterSpacing: 20,
                                dropShadow: true,
                                dropShadowColor: '#E72264',
                                dropShadowDistance: 6,
                            })
                        }
                    />
                </Container>
            </PixiViewport>
        </Stage>
    )
})
