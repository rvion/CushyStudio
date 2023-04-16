import type { MessageFromExtensionToWebview_askPaint } from '../core-types/MessageFromExtensionToWebview'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'

// https://github.com/devforth/painterro
export const PaintUI = observer(function PaintUI_(p: { step: MessageFromExtensionToWebview_askPaint }) {
    const uiSt = useLocalObservable(() => ({
        img: '',
        locked: false,
    }))

    const uid = useMemo(() => nanoid(), [])
    return uiSt.locked ? (
        <img src={uiSt.img} alt='' />
    ) : (
        <>
            <button>OK</button>
            <div
                style={{ position: 'relative', minWidth: '300px', minHeight: '300px', width: '100%', height: '100%' }}
                ref={(a) => {
                    console.log('🔥 mounting paint', a)
                    if (a == null) return null
                    setTimeout(() => {
                        console.log('🔥 mounting paint', a)
                        // setTimeout(())
                        // @ts-ignore
                        Painterro({
                            id: uid,
                            saveHandler: function (image: PainteroImage, done: (a: boolean) => void) {
                                // const formData = new FormData()
                                const txt = image.asDataURL('image/png')
                                console.log(txt)
                                uiSt.img = txt
                                uiSt.locked = true
                                done(true)
                            },
                        }).show(p.step.uri)
                    }, 1000)
                }}
            >
                <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
            </div>
        </>
    )
})

type PainteroImage = {
    asBlob(type: any, quality: any): Blob
    asDataURL(type?: any, quality?: any): string // returns e.g. "data:image/jpeg;base64,/9j/4AAQS...."
    suggestedFileName(type: any): string // returns string
    hasAlphaChannel(): boolean // returns true or false
    getOriginalMimeType(): 'image/jpeg' | 'image/png' // e.g. image/jpeg;
    getWidth(): number // integer
    getHeight(): number // integer
}
