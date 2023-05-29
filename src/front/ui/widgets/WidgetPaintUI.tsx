import { observer, useLocalObservable } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useLayoutEffect, useMemo } from 'react'
import { Button } from 'rsuite'
import { STATE } from '../../FrontState'
import { useSt } from '../../FrontStateCtx'

const getLayers = (): any => {
    return (document as any).getElementById('miniPaint').contentWindow.Layers
}
class MinipaintState {
    constructor(public st: STATE) {}
    loadImage(p: { uri: string }) {
        // window.getElemnt
        const image = document.createElement('img')
        image.crossOrigin = 'Anonymous'
        image.src = p.uri
        image.onload = function () {
            const iframe = document.getElementById('miniPaint') as any
            var Layers = iframe.contentWindow.Layers
            var new_layer = {
                name: nanoid(),
                type: 'image',
                data: image,
                width: image.naturalWidth || image.width,
                height: image.naturalHeight || image.height,
                width_original: image.naturalWidth || image.width,
                height_original: image.naturalHeight || image.height,
            }
            Layers.insert(new_layer)
        }
    }
    saveImage() {
        var Layers = getLayers()
        var tempCanvas = document.createElement('canvas')
        var tempCtx = tempCanvas.getContext('2d')
        var dim = Layers.get_dimensions()
        tempCanvas.width = dim.width
        tempCanvas.height = dim.height
        Layers.convert_layers_to_canvas(tempCtx)

        // if (is_edge_or_ie() == false) {
        //update image using blob (faster)
        // tempCanvas.toBlob(function (blob) {
        //     if (blob == null) throw new Error('no blob')
        //     console.log('Data length: ' + blob.size)
        //     console.log(blob)
        // }, 'image/png')
        // } else {
        //     //slow way for IE, Edge
        var data = tempCanvas.toDataURL()
        // alert('Data length: ' + data.length)
        console.log(`${data.length} bytes`)
        const imageID = nanoid()
        // 🔴🔴
        // this.st.sendMessageToExtension({ type: 'image', base64: data, imageID })
        // }
    }
}
// https://github.com/devforth/painterro
export const WidgetPaintUI = observer(function PaintUI_(p: { uri: string }) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({ img: '', locked: false }))
    const k = useMemo(() => new MinipaintState(st), [])
    useLayoutEffect(() => {
        setTimeout(() => k.loadImage(p), 100)
    }, [])

    return uiSt.locked ? (
        <img src={uiSt.img} alt='' />
    ) : (
        <div className='flex-grow flex flex-col'>
            <div>
                <Button
                    appearance='primary'
                    color='green'
                    onClick={() => {
                        k.saveImage()
                        st.currentAction = null
                    }}
                >
                    OK
                </Button>
                <Button onClick={() => (st.currentAction = null)}>Close</Button>
            </div>
            <iframe
                style={{
                    flexGrow: 1,
                    // resize: 'both',
                    minWidth: '200px',
                    // minHeight: '100%',
                    width: '100%',
                    // height: '612px',
                }}
                id='miniPaint'
                src={'http://localhost:5173/minipaint/index.html'}
                allow='camera'
            ></iframe>

            {/* <div id={uid} ref={ref} style={{ position: 'relative', minWidth: '100%', minHeight: '800px', maxHeight: '800px' }}>
                <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
            </div> */}
        </div>
    )
})
