import { observer, useLocalObservable } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useLayoutEffect, useMemo } from 'react'
import { Button } from 'rsuite'
import { STATE } from '../../state'
import { useSt } from '../../FrontStateCtx'
import { UIActionPaint } from 'src/front/UIAction'
import { runInAction } from 'mobx'
import { writeFileSync } from 'fs'
import { asRelativePath } from '../../../utils/fs/pathUtils'
import { ImageL } from 'src/models/Image'

const getLayers = (): any => {
    return (document as any).getElementById('miniPaint').contentWindow.Layers
}
class MinipaintState {
    constructor(
        //
        public st: STATE,
    ) {}

    // { uri: img.comfyURL }
    // { uri: string }
    loadImage(iamgeL: ImageL) {
        // window.getElemnt
        const img = document.createElement('img')
        img.crossOrigin = 'Anonymous'
        img.src = iamgeL.url
        img.onload = function () {
            const iframe = document.getElementById('miniPaint') as any
            var Layers = iframe.contentWindow.Layers
            var new_layer = {
                name: nanoid(),
                type: 'image',
                data: img,
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
                width_original: img.naturalWidth || img.width,
                height_original: img.naturalHeight || img.height,
            }
            Layers.insert(new_layer)
        }
    }
    saveImage() {
        console.log('a')
        var Layers = getLayers()
        var tempCanvas = document.createElement('canvas')
        console.log('b')
        var tempCtx = tempCanvas.getContext('2d')
        var dim = Layers.get_dimensions()
        console.log('c')
        tempCanvas.width = dim.width
        tempCanvas.height = dim.height
        console.log('d')
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
        console.log('e')
        var data = tempCanvas.toDataURL()
        // alert('Data length: ' + data.length)
        console.log(`${data.length} bytes`)
        const imageID = nanoid()
        tempCanvas.toBlob(async (blob) => {
            if (blob == null) throw new Error(`❌ blob is null`)
            const relPath = asRelativePath(imageID + '.png')
            console.log({ relPath })
            const absPath = this.st.resolve(this.st.outputFolderPath, relPath)
            console.log({ absPath })
            const buff = await blob.arrayBuffer()
            console.log({ byteLength: buff.byteLength })
            writeFileSync(absPath, Buffer.from(buff))
            console.log(`saved`)
            this.st.db.images.create({
                localFolderPath: absPath,
            })
        })
        // console.log('f')
        // writeFileSync()
        // 🔴🔴
        // this.st.sendMessageToExtension({ type: 'image', base64: data, imageID })
        // }
    }
}
// https://github.com/devforth/painterro
export const WidgetPaintUI = observer(function PaintUI_(p: { action: UIActionPaint }) {
    const a = p.action
    const st = useSt()
    const k = useMemo(() => new MinipaintState(st), [])
    useLayoutEffect(() => {
        const img: ImageL = st.db.images.getOrThrow(a.imageID)
        setTimeout(() => k.loadImage(img), 100)
    }, [p.action.imageID])

    return (
        <div className='flex-grow flex flex-col'>
            <div>
                <Button
                    appearance='primary'
                    color='green'
                    onClick={() => {
                        runInAction(() => {
                            k.saveImage()
                            st.currentAction = null
                        })
                    }}
                >
                    OK
                </Button>
                <Button
                    onClick={() => {
                        runInAction(() => {
                            st.currentAction = null
                        })
                    }}
                >
                    Close
                </Button>
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
