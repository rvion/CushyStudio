import type { MediaImageL } from 'src/models/MediaImage'
import type { STATE } from '../state/state'

import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { join } from 'pathe'
import { useLayoutEffect, useMemo } from 'react'
import { Button } from 'src/rsuite/shims'
import { useSt } from '../state/stateContext'
import { asRelativePath } from '../utils/fs/pathUtils'
import { CUSHY_PORT } from 'src/state/PORT'

// export type UIPagePaint = {
//     type: 'paint'
//     imageID?: ImageID
//     // mask?: boolean
// }

const getLayers = (): any => {
    // console.log('🟢', (document as any).getElementById('miniPaint').contentWindow.Layers)
    return (document as any).getElementById('miniPaint').contentWindow.Layers
}
class MinipaintState {
    constructor(
        //
        public st: STATE,
    ) {}

    // { uri: img.comfyURL }
    // { uri: string }
    loadImage(iamgeL: MediaImageL) {
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

            // if (true) {
            //     var mask_layer = {
            //         name: 'MASK',
            //         type: 'image',
            //         data: '',
            //         width: img.naturalWidth || img.width,
            //         height: img.naturalHeight || img.height,
            //         width_original: img.naturalWidth || img.width,
            //         height_original: img.naturalHeight || img.height,
            //     }
            //     Layers.insert(mask_layer)
            // }
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
        // console.log(Layers.get_layer('MASK'))

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
            const filename = imageID + '.png'

            // create minipaint folder
            const subfolder = 'minipaint'
            const subFoldePath = join(this.st.outputFolderPath, subfolder)
            mkdirSync(subFoldePath, { recursive: true })

            //  create image
            const relPath = asRelativePath(join(subfolder, filename))
            const absPath = this.st.resolve(this.st.outputFolderPath, relPath)
            const buff = await blob.arrayBuffer()
            // console.log({ relPath })
            // console.log({ absPath })
            // console.log({ byteLength: buff.byteLength })
            const dirExists = existsSync(this.st.outputFolderPath)
            if (!dirExists) {
                console.log(`creating dir ${this.st.outputFolderPath}`)
                mkdirSync(this.st.outputFolderPath, { recursive: true })
            }
            writeFileSync(absPath, Buffer.from(buff))
            console.log(`saved`)
            this.st.db.media_images.create({ infos: { type: 'image-local', absPath: absPath } })
        })
        // console.log('f')
        // writeFileSync()
        // 🔴🔴
        // this.st.sendMessageToExtension({ type: 'image', base64: data, imageID })
        // }
    }
}
// https://github.com/devforth/painterro
export const Panel_Minipaint = observer(function PaintUI_(p: { imgID?: MediaImageID }) {
    // const action = p.action
    const st = useSt()
    const minipaintState = useMemo(() => new MinipaintState(st), [])

    // load image once the widget is ready
    useLayoutEffect(() => {
        if (p.imgID == null) return
        const img: MediaImageL = st.db.media_images.getOrThrow(p.imgID)
        setTimeout(() => minipaintState.loadImage(img), 100)
    }, [p.imgID])

    return (
        <div className='flex-grow flex flex-col h-full'>
            <div className='absolute top-1 right-2'>
                <Button
                    size='sm'
                    icon={<span className='material-symbols-outlined'>save</span>}
                    appearance='primary'
                    color='green'
                    onClick={() => {
                        runInAction(() => {
                            minipaintState.saveImage()
                        })
                    }}
                >
                    Save
                </Button>
            </div>
            <iframe
                style={{
                    border: 'none',
                    flexGrow: 1,
                    minWidth: '200px',
                    width: '100%',
                    // resize: 'both',
                    // minHeight: '100%',
                    // height: '612px',
                }}
                id='miniPaint'
                src={`http://localhost:${CUSHY_PORT}/public/minipaint/index.html`}
                allow='camera'
            ></iframe>

            {/* <div id={uid} ref={ref} style={{ position: 'relative', minWidth: '100%', minHeight: '800px', maxHeight: '800px' }}>
                <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
            </div> */}
        </div>
    )
})
