import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../../state/stateContext'

import * as React from 'react'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { UnifiedCanvasCtx } from './UnifiedCanvasCtx'
import { UnifiedCanvasMenuUI } from './menu/UnifiedCanvasMenuUI'
import { UnifiedCanvas } from './states/UnifiedCanvas'
import { useSize } from './useSize'

// https://github.com/devforth/painterro
export const Panel_Canvas = observer(function Panel_Canvas_(p: {
    //
    imgID?: MediaImageID
}) {
    const st = useSt()
    const containerRef = React.useRef<HTMLDivElement>(null)
    const img0 = st.db.media_images.get(p.imgID!)
    const canvas = useMemo(() => {
        if (img0 == null) throw new Error('img0 is null')
        return new UnifiedCanvas(st, img0)
    }, [img0])

    if (img0 == null) return <>❌ error</>

    // add drop handlers
    const [dropStyle, dropRef] = useImageDrop(st, (img) => runInAction(() => canvas.addImage(img)))

    // auto-resize canvas
    const size = useSize(containerRef)
    React.useEffect(() => {
        if (size == null) return
        // console.log(`[👙] size.height=`, size.height, size.width)
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
        return () => {
            // console.log(`[🔴] CLEANUP`, canvas.rootRef.current)
            if (canvas.rootRef.current == null) return
        }
    }, [canvas.rootRef])

    // const scale = canvas.infos.scale * 100
    return (
        <div //
            tabIndex={0}
            onKeyDown={canvas.onKeyDown}
            onWheel={canvas.onWheel}
            ref={containerRef}
            className='flex flex-1 w-full h-full bd'
        >
            <UnifiedCanvasCtx.Provider value={canvas}>
                <UnifiedCanvasMenuUI />
                {/* <CanvasToolbarUI /> */}
                <div
                    //
                    // key={canvas.stage.id()}
                    style={dropStyle}
                    ref={dropRef}
                    className='DROP_IMAGE_HANDLER'
                    tw='_Panel_Canvas flex-grow flex flex-row h-full relative'
                >
                    {/* <GridTilingUI /> */}
                    <div ref={canvas.rootRef} tw='flex-1'></div>
                </div>
            </UnifiedCanvasCtx.Provider>
        </div>
    )
})
