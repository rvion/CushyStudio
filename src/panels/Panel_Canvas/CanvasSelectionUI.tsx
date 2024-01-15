import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { Rect, Transformer } from 'react-konva'
import { PanelCanvasState } from './PanelCanvasState'

export const CanvasSelectionUI = observer(function CanvasSelectionUI_(p: { uist: PanelCanvasState }) {
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
            <Rect
                //
                ref={uist.refStable}
                opacity={0.8}
                // fill={'transparent'}
                stroke={'blue'}
                strokeWidth={4}
                {...stableData}
            />
            <Rect
                ref={uist.refLive}
                opacity={0.2}
                // fill={'blue'}
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
                    const { stable, live, snapSize, snapToGrid } = uist

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
                keepRatio={false}
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
