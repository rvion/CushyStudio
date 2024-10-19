import type { MediaImageL } from '../../models/MediaImage'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import { mkPlacement } from '../../csuite/fields/core-prefabs/ShapeSchema'
import { RegionUI } from '../../csuite/regions/RegionUI'
import { useImageDrop } from '../../widgets/galleries/dnd'
import { UnifiedCanvasMenuUI } from './menu/UnifiedCanvasMenuUI'
import { PanelCanvasHeaderUI } from './PanelCanvasHeaderUI'
import { UnifiedCanvas } from './states/UnifiedCanvas'
import { UnifiedCanvasCtx } from './states/UnifiedCanvasCtx'
import { useSize } from './utils/useSize'
import { UnifiedCanvasPixi } from './V2/pixi/UnifiedCanvasPixi'
import { useUCV2 } from './V2/ucV2'

export type PanelCanvasProps = {
    startingImgID?: MediaImageID
}

// https://github.com/devforth/painterro
export const PanelCanvasUI = observer(function Panel_Canvas_(p: PanelCanvasProps) {
    // TODO : shoudl go away
    const img0: Maybe<MediaImageL> = cushy.db.media_image.get(p.startingImgID!)

    const uc2 = useUCV2()

    const canvas: UnifiedCanvas = useMemo(() => {
        if (img0 == null) throw new Error('img0 is null')
        return new UnifiedCanvas(cushy, img0)
    }, [img0])

    if (img0 == null) return <>❌ error</>

    // add drop handlers
    const [dropStyle, dropRef] = useImageDrop(cushy, (img) => {
        runInAction(() => canvas.addImage(img))
        uc2.Layers.push({
            placement: mkPlacement({ x: 0, y: 0 }),
            content: { image: img },
        })
    })

    // auto-resize canvas
    const containerRef = React.useRef<HTMLDivElement>(null)
    const size = useSize(containerRef)
    React.useEffect(() => {
        if (size == null) return
        // console.log(`[🧐] size.height=`, size.height, size.width)
        canvas.stage.width(size.width)
        canvas.stage.height(size.height)
    }, [Math.round(size?.width ?? 100), Math.round(size?.height ?? 100)])

    // auto-mount canvas
    React.useEffect(() => {
        if (canvas.rootRef.current == null) return
        canvas.rootRef.current.innerHTML = ''
        canvas.stage.container(canvas.rootRef.current)
        // canvas.rootRef.current.addEventListener('keydown', canvas.onKeyDown)
        // console.log(`[🟢] MOUNT`)
        return (): void => {
            // console.log(`[🔴] CLEANUP`, canvas.rootRef.current)
            if (canvas.rootRef.current == null) return
        }
    }, [canvas.rootRef])

    // const scale = canvas.infos.scale * 100
    return (
        <div //
            tabIndex={0}
            // onKeyDown={canvas.onKeyDown}
            ref={containerRef}
            className='flex size-full flex-1 overflow-hidden'
        >
            <RegionUI //
                regionName='UnifiedCanvas2'
                regionCtx={UnifiedCanvasCtx}
                regionValue={canvas}
            >
                <PanelCanvasHeaderUI />
                <div
                    //
                    // key={canvas.stage.id()}
                    style={dropStyle}
                    ref={dropRef}
                    className='DROP_IMAGE_HANDLER'
                    tw='_Panel_Canvas relative !z-0 flex h-full flex-grow flex-row'
                >
                    {/* <GridTilingUI /> */}
                    {canvas.steps.map((s) => {
                        const infos = canvas.infos
                        const dx = infos.canvasX
                        const dy = infos.canvasY
                        const x = (s.image.x() + dx) / infos.scale
                        const y = (s.image.y() + dy) / infos.scale
                        return (
                            <div tw='absolute z-50' style={{ left: `${x}px`, top: `${y}px` }}>
                                <div className='joined'>
                                    <div tw='btn' onClick={() => s.index++}>
                                        {'<-'}
                                    </div>
                                    <div tw='btn' onClick={() => s.delete()}>
                                        ❌
                                    </div>
                                    <div tw='btn' onClick={() => s.accept()}>
                                        OK
                                    </div>
                                    <div tw='btn' onClick={() => s.index--}>
                                        {'->'}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <UnifiedCanvasPixi />
                    {/* <div //
                        id={canvas.uid}
                        ref={canvas.rootRef}
                        tw='flex-1'
                    ></div> */}
                    <div tw='absolute top-0 z-[999999] opacity-50'>
                        <uc2.UI />
                    </div>
                    {/* <CanvasToolbarUI /> */}
                    <UnifiedCanvasMenuUI />
                </div>
            </RegionUI>
        </div>
    )
})
