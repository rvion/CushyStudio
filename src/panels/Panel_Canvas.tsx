import { Image, Layer, Stage } from 'react-konva'

import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useSt } from '../state/stateContext'
import { STATE } from 'src/state/state'

class PanelCanvasState {
    constructor(public st: STATE) {
        makeAutoObservable(this)
    }
}

// https://github.com/devforth/painterro
export const Panel_Canvas = observer(function Panel_Canvas_(p: {
    //
    imgID?: MediaImageID
}) {
    // const action = p.action
    const st = useSt()
    const minipaintState = useMemo(() => new PanelCanvasState(st), [])
    const img = st.db.media_images.get(p.imgID!)
    if (img == null) return <>❌ error</>
    const w = img.data.width
    const h = img.data.width

    return (
        <div className='flex-grow flex flex-col h-full'>
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
                {[img].map((i) => (
                    <Layer key={i?.id}>
                        {/* <Text text='Try to drag a star' /> */}
                        {i?.url && <Image image={i.asHTMLImageElement} />}
                        {/* {shapes.map((shape) => (
                            <RectangleUI
                                key={`rect-${shape.item.id}`}
                                onChange={(p) => Object.assign(shape, p)}
                                isSelected={shape.isSelected}
                                shape={shape}
                            />
                        ))} */}
                    </Layer>
                ))}
            </Stage>
        </div>
    )
})
