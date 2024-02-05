import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { Rect, Transformer } from 'react-konva'
import { UnifiedSelection } from '../states/UnifiedSelection'

export const CanvasSelectionUI = observer(function CanvasSelectionUI_(p: { uniSel: UnifiedSelection }) {
    const uniSel = p.uniSel
    const liveData = uniSel.liveData
    const stableData = uniSel.stableData

    React.useEffect(() => {
        if (true) {
            // we need to attach transformer manually
            if (uniSel.refTransform.current == null) return
            uniSel.refTransform.current.nodes([uniSel.refLive.current])
            uniSel.refTransform.current.getLayer().batchDraw()
        }
    }, [true, uniSel.refTransform.current !== null])

    if (!uniSel.isActive) return null

    return (
        <React.Fragment>
            <Rect
                //
                ref={uniSel.refStable}
                opacity={0.8}
                // fill={'transparent'}
                stroke={'blue'}
                strokeWidth={4}
                {...stableData}
            />
            <Rect
                ref={uniSel.refLive}
                opacity={0.2}
                // fill={'blue'}
                strokeWidth={4}
                {...liveData}
                draggable
                onDragEnd={(e) => {
                    runInAction(() => {
                        Object.assign(uniSel.liveData, uniSel.stableData)
                        uniSel.live.setAttrs({ ...uniSel.stableData })
                        uniSel.stable.getStage()!.batchDraw()
                    })
                }}
                onTransformEnd={(e) => {
                    runInAction(() => {
                        Object.assign(uniSel.liveData, uniSel.stableData)
                        uniSel.live.setAttrs({ ...uniSel.stableData })
                        uniSel.stable.getStage()!.batchDraw()
                    })
                }}
                onDragMove={(e) => {
                    const { stable, live } = uniSel
                    console.log(`[👙] onDragMove`, stable)
                    runInAction(() => {
                        const xx = Math.round(live.x()! / 64) * 64
                        const yy = Math.round(live.y()! / 64) * 64
                        uniSel.stableData.x = xx
                        uniSel.stableData.y = yy
                        stable.x(xx)
                        stable.y(yy)
                        // e.target.getStage()!.batchDraw()
                        stable.getStage()!.batchDraw()
                    })
                }}
                onTransform={(e) => {
                    const { stable, live } = uniSel
                    const { snapSize, snapToGrid } = uniSel.canvas

                    console.log(`[👙] onTransform`, stable)
                    const xx = Math.round(live.x()! / 64) * 64
                    const yy = Math.round(live.y()! / 64) * 64
                    const scaleX = live.scaleX()
                    const scaleY = live.scaleY()
                    const ww = Math.round((live.width() * scaleX) / 64) * 64
                    const hh = Math.round((live.height() * scaleY) / 64) * 64
                    console.log(`[👙] WW ${ww} x HH ${hh}`)
                    runInAction(() => {
                        uniSel.stableData.width = ww
                        uniSel.stableData.height = hh
                        uniSel.stableData.x = xx
                        uniSel.stableData.y = yy
                        stable.setAttrs({ width: ww, height: hh, x: xx, y: yy })
                        stable.getStage()!.batchDraw()
                    })
                }}
            />
            <Transformer
                rotateEnabled={false}
                flipEnabled={false}
                keepRatio={false}
                ref={uniSel.refTransform}
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
