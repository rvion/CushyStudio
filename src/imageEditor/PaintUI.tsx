import type { MessageFromExtensionToWebview_askPaint } from '../core-types/MessageFromExtensionToWebview'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useSt } from '../core-front/stContext'
import { Panel } from 'rsuite'

// https://github.com/devforth/painterro
export const PaintUI = observer(function PaintUI_(p: { step: MessageFromExtensionToWebview_askPaint }) {
    const st = useSt()
    const uiSt = useLocalObservable(() => ({ img: '', locked: false }))

    useLayoutEffect(() => {
        setTimeout(() => {
            // window.getElemnt
            const image = document.createElement('img')
            image.crossOrigin = 'Anonymous'
            image.src = p.step.uri
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
        }, 1000)
    }, [])

    return uiSt.locked ? (
        <img src={uiSt.img} alt='' />
    ) : (
        <Panel>
            <iframe
                style={{
                    resize: 'both',
                    minWidth: '200px',
                    minHeight: '200px',
                    width: '100%',
                    height: '1000px',
                }}
                id='miniPaint'
                src={'http://localhost:5173/minipaint/index.html'}
                allow='camera'
            ></iframe>

            {/* <div id={uid} ref={ref} style={{ position: 'relative', minWidth: '100%', minHeight: '800px', maxHeight: '800px' }}>
                <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
            </div> */}
        </Panel>
    )
})
