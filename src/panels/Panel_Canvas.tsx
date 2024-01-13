import type { ItemExt } from 'src/controls/Widget'
import type { STATE } from 'src/state/state'

import { Image, Layer, Stage } from 'react-konva'

import { makeAutoObservable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../state/stateContext'

import { KonvaEventObject } from 'konva/lib/Node'
import * as React from 'react'
import { Rect, Transformer } from 'react-konva'
import { Shape } from 'konva/lib/Shape'
import { Vector2d } from 'konva/lib/types'
import { MediaImageL } from 'src/models/MediaImage'
import { createMediaImage_fromDataURI, createMediaImage_fromPath } from 'src/models/createMediaImage_fromWebFile'
import { nanoid } from 'nanoid'

type RectSimple = {
    x: number
    y: number
    width: number
    height: number
    scaleX: number
    scaleY: number
}
class PanelCanvasState {
    // immutable base for calculations
    readonly base = Object.freeze({
        width: 512,
        height: 512,
    })

    // the draggable / resizable selection
    stableData: RectSimple = {
        x: 100,
        y: 100,
        width: 512,
        height: 512,
        scaleX: 1,
        scaleY: 1,
    }

    // the real current selectio
    liveData: RectSimple = {
        ...this.stableData,
    }

    refLive = React.createRef<any>()
    refStable = React.createRef<any>()
    refTransform = React.createRef<any>()

    get live(): Shape {
        return this.refLive.current as Shape
    }
    get stable(): Shape {
        return this.refStable.current as Shape
    }
    constructor(public st: STATE) {
        makeAutoObservable(this, {
            refLive: false,
            refStable: false,
            refTransform: false,
        })
    }
}

// https://github.com/devforth/painterro
export const Panel_Canvas = observer(function Panel_Canvas_(p: {
    //
    imgID?: MediaImageID
}) {
    // const action = p.action
    const st = useSt()
    const uist = useMemo(() => new PanelCanvasState(st), [])
    const img = st.db.media_images.get(p.imgID!)
    if (img == null) return <>❌ error</>
    const w = img.data.width
    const h = img.data.width

    const imgs = [img]
    return (
        <div className='flex-grow flex flex-col h-full'>
            {JSON.stringify(uist.stableData)}
            <div className='flex'>
                <div tw='virtualBorder flex flex-col gap-2'>
                    <section>
                        <div
                            tw='btn'
                            onClick={() => {
                                // 1. get stage
                                const stage = uist.live.getStage()
                                if (stage == null) return null
                                // 2. hide select widget
                                uist.live.visible(false)
                                uist.stable.visible(false)
                                // 3. convert canva to HTMLCanvasElement
                                const fullCanvas = stage.toCanvas()
                                // 4. create a smaller and cropped stage
                                const subCanvas = document.createElement('canvas')
                                subCanvas.width = uist.stableData.width
                                subCanvas.height = uist.stableData.height
                                const subCtx = subCanvas.getContext('2d')!
                                subCtx.drawImage(
                                    fullCanvas,
                                    uist.stableData.x,
                                    uist.stableData.y,
                                    uist.stableData.width,
                                    uist.stableData.height,
                                    0,
                                    0,
                                    uist.stableData.width,
                                    uist.stableData.height,
                                )
                                // 5. convert to dataURL
                                const dataURL = subCanvas.toDataURL()
                                uist.live.getStage
                                createMediaImage_fromDataURI(st, dataURL!, `outputs/canvas/${nanoid()}.png`)
                                uist.live.visible(true)
                                uist.stable.visible(true)
                                // console.log(dataURL)
                            }}
                        >
                            saveImage
                        </div>
                    </section>
                    <section>
                        <div tw='bg-primary text-primary-content'>Selections</div>
                        <div>Selectio 0</div>
                    </section>
                    <section>
                        <div tw='bg-primary text-primary-content'>Images</div>
                        {imgs.map((img: MediaImageL) => {
                            return <div key={img.id}>{img.filename}</div>
                        })}
                    </section>
                </div>
                <Stage
                    //
                    width={img.width}
                    height={img.height}
                    onContextMenu={(e) => {
                        e.evt.preventDefault()
                        console.log('context menu')
                        // get image from stage
                        const dataURL = e.target.toDataURL()
                        console.log(dataURL)
                    }}
                >
                    {imgs.map((i) => (
                        <Layer key={i?.id}>
                            {/* <Text text='Try to drag a star' /> */}
                            {i?.url ? ( //
                                <Image image={i.asHTMLImageElement} />
                            ) : null}
                            <SelectionUI uist={uist} />
                        </Layer>
                    ))}
                </Stage>
            </div>
        </div>
    )
})

export const SelectionUI = observer(function RectangleUI_(p: { uist: PanelCanvasState }) {
    const uist = p.uist
    const liveData = uist.liveData
    const stableData = uist.stableData

    React.useEffect(() => {
        if (true) {
            // we need to attach transformer manually
            uist.refTransform.current.nodes([uist.refLive.current])
            uist.refTransform.current.getLayer().batchDraw()
        }
    }, [true])

    return (
        <React.Fragment>
            <Rect ref={uist.refStable} opacity={0.8} fill={'transparent'} stroke={'blue'} strokeWidth={4} {...stableData} />
            <Rect
                ref={uist.refLive}
                opacity={0.2}
                fill={'blue'}
                strokeWidth={4}
                {...liveData}
                draggable
                onDragEnd={(e) => {
                    runInAction(() => {
                        Object.assign(uist.liveData, uist.stableData)
                        uist.live.setAttrs({ ...uist.stableData })
                        uist.stable.getStage()!.batchDraw()
                    })
                }}
                onTransformEnd={(e) => {
                    runInAction(() => {
                        Object.assign(uist.liveData, uist.stableData)
                        uist.live.setAttrs({ ...uist.stableData })
                        uist.stable.getStage()!.batchDraw()
                    })
                }}
                onDragMove={(e) => {
                    const { stable, live } = uist
                    console.log(`[👙] onDragMove`, stable)
                    runInAction(() => {
                        const xx = Math.round(live.x()! / 64) * 64
                        const yy = Math.round(live.y()! / 64) * 64
                        uist.stableData.x = xx
                        uist.stableData.y = yy
                        stable.x(xx)
                        stable.y(yy)
                        // e.target.getStage()!.batchDraw()
                        stable.getStage()!.batchDraw()
                    })
                }}
                onTransform={(e) => {
                    const { stable, live } = uist
                    console.log(`[👙] onTransform`, stable)
                    const xx = Math.round(live.x()! / 64) * 64
                    const yy = Math.round(live.y()! / 64) * 64
                    const scaleX = live.scaleX()
                    const scaleY = live.scaleY()
                    const ww = Math.round((live.width() * scaleX) / 64) * 64
                    const hh = Math.round((live.height() * scaleY) / 64) * 64
                    console.log(`[👙] WW ${ww} x HH ${hh}`)
                    runInAction(() => {
                        uist.stableData.width = ww
                        uist.stableData.height = hh
                        uist.stableData.x = xx
                        uist.stableData.y = yy
                        stable.setAttrs({ width: ww, height: hh, x: xx, y: yy })
                        stable.getStage()!.batchDraw()
                    })
                }}
            />
            <Transformer
                rotateEnabled={false}
                flipEnabled={false}
                ref={uist.refTransform}
                boundBoxFunc={(oldBox, newBox) => {
                    // limit resize
                    if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                        return oldBox
                    }
                    return newBox
                }}
            />
        </React.Fragment>
    )
})
