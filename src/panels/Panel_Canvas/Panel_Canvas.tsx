import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../../state/stateContext'

import * as React from 'react'
import { useImageDrop } from 'src/widgets/galleries/dnd'
import { UnifiedCanvas } from './states/UnifiedCanvas'
import { useSize } from './useSize'
import { UnifiedCanvasCtx } from './UnifiedCanvasCtx'
import { UnifiedCanvasMenuUI } from './menu/UnifiedCanvasMenuUI'
import { GridTilingUI } from './GridTilingUI'

// https://github.com/devforth/painterro
export const Panel_Canvas = observer(function Panel_Canvas_(p: {
    //
    imgID?: MediaImageID
}) {
    const st = useSt()
    const img0 = st.db.media_images.get(p.imgID!)

    const canvas = useMemo(() => {
        if (img0 == null) throw new Error('img0 is null')
        return new UnifiedCanvas(st, img0)
    }, [img0])

    if (img0 == null) return <>❌ error</>

    // add drop handlers
    const [dropStyle, dropRef] = useImageDrop(st, (img) => runInAction(() => canvas.addImage(img)))

    // auto-resize canvas
    const size = useSize(canvas.rootRef)
    React.useEffect(() => {
        if (size == null) return
        canvas.stage.width(size.width)
        canvas.stage.height(size.width)
    }, [size?.width, size?.height])

    // auto-mount canvas
    React.useEffect(() => {
        if (canvas.rootRef.current == null) return
        canvas.stage.container(canvas.rootRef.current)
    }, [canvas.rootRef])

    const scale = canvas.infos.scale * 100
    return (
        <UnifiedCanvasCtx.Provider value={canvas}>
            <div className='flex'>
                <UnifiedCanvasMenuUI />
                <div
                    //
                    style={dropStyle}
                    ref={dropRef}
                    className='DROP_IMAGE_HANDLER'
                    tw='_Panel_Canvas flex-grow flex flex-row h-full relative'
                >
                    {/* <GridTilingUI /> */}
                    <div ref={canvas.rootRef} tw='flex-1'></div>
                </div>
            </div>
        </UnifiedCanvasCtx.Provider>
    )
})
