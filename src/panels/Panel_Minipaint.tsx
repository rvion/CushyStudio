import type { STATE } from '../state/state'
import type { MediaImageL } from 'src/models/MediaImage'

import { action, makeObservable, observable, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useLayoutEffect, useMemo } from 'react'

import { useSt } from '../state/stateContext'
import { createMediaImage_fromBlobObject } from 'src/models/createMediaImage_fromWebFile'
import { Button } from 'src/rsuite/shims'
import { CUSHY_PORT } from 'src/state/PORT'

const getLayers = (): any => {
    // console.log('🟢', (document as any).getElementById('miniPaint').contentWindow.Layers)
    return (document as any).getElementById('miniPaint').contentWindow.Layers
}
class MinipaintState {
    constructor(
        //
        public st: STATE,
    ) {
        makeObservable(this, {
            autoSave: observable,
            toggleAutoSave: action,
        })
    }

    autoSave: Maybe<NodeJS.Timeout> = null
    toggleAutoSave() {
        if (this.autoSave != null) {
            clearInterval(this.autoSave)
            this.autoSave = null
            return
        }
        this.autoSave = setInterval(() => {
            this.saveImage()
        }, 1000)
    }
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
                name: nanoid(8),
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

    fileName = nanoid(8)

    get fileNameWithExt() {
        return this.fileName + '.png'
    }

    saveImage() {
        var Layers = getLayers()
        var dim = Layers.get_dimensions()
        var tempCanvas = document.createElement('canvas')
        var tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = dim.width
        tempCanvas.height = dim.height
        Layers.convert_layers_to_canvas(tempCtx)

        var data = tempCanvas.toDataURL()
        console.log(`${data.length} bytes`)
        tempCanvas.toBlob(async (blob) => {
            if (blob == null) throw new Error(`❌ blob is null`)
            const relPath = `outputs/minipaint/${this.fileNameWithExt}`
            createMediaImage_fromBlobObject(this.st, blob, relPath)
        })
    }
}

// https://github.com/devforth/painterro
export const Panel_Minipaint = observer(function PaintUI_(p: { imgID?: MediaImageID }) {
    // const action = p.action
    const st = useSt()
    const uist = useMemo(() => new MinipaintState(st), [])
    // load image once the widget is ready
    useLayoutEffect(() => {
        if (p.imgID == null) return
        const img: MediaImageL = st.db.media_images.getOrThrow(p.imgID)
        setTimeout(() => uist.loadImage(img), 100)
    }, [p.imgID])

    return (
        <div className='flex-grow flex flex-col h-full'>
            <div className='top-1 right-2'>
                <div className='flex items-center gap-2'>
                    <Button
                        tw='join-item'
                        size='sm'
                        icon={<span className='material-symbols-outlined'>save</span>}
                        appearance='primary'
                        color='green'
                        onClick={() => {
                            runInAction(() => {
                                uist.saveImage()
                            })
                        }}
                    >
                        Save
                    </Button>
                    <div
                        tw={['btn btn-sm virtualBorder self-start', uist.autoSave ? 'btn-active' : null]}
                        // color={uist.autoSave ? 'green' : undefined}
                        onClick={() => uist.toggleAutoSave()}
                    >
                        AutoSave
                        {uist.autoSave ? (
                            <div className='loading loading-spinner loading-sm' />
                        ) : (
                            <span className='material-symbols-outlined'>repeat</span>
                        )}
                        {/* Auto */}
                    </div>
                    <div>
                        outputs/minipaint/
                        <input
                            onChange={(ev) => (uist.fileName = ev.target.value)}
                            value={uist.fileName}
                            tw='input input-sm join-item input-bordered'
                            type='text'
                        />
                        .png
                    </div>
                </div>
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
                src={`http://localhost:${CUSHY_PORT}/minipaint/index.html`}
                allow='camera'
            ></iframe>

            {/* <div id={uid} ref={ref} style={{ position: 'relative', minWidth: '100%', minHeight: '800px', maxHeight: '800px' }}>
                <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
            </div> */}
        </div>
    )
})
