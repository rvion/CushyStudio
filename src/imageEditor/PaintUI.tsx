import { observer } from 'mobx-react-lite'
import { nanoid } from 'nanoid'
// @ts-ignore

// import * as Painterro from 'painterro'

import { useMemo } from 'react'
import { MessageFromExtensionToWebview_askPaint } from '../core-types/MessageFromExtensionToWebview'
console.log('oks')
// https://github.com/devforth/painterro
export const PaintUI = observer(function PaintUI_(p: { step: MessageFromExtensionToWebview_askPaint }) {
    const uid = useMemo(() => nanoid(), [])
    return (
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
                        // saveHandler: function (image, done) {
                        //     var formData = new FormData()
                        //     formData.append('image', image.asBlob())
                        //     // you can also pass suggested filename
                        //     // formData.append('image', image.asBlob(), image.suggestedFileName());
                        //     var xhr = new XMLHttpRequest()
                        //     xhr.open('POST', 'http://127.0.0.1:5000/save-as-binary/', true)
                        //     xhr.onload = xhr.onerror = function () {
                        //         // after saving is done, call done callback
                        //         done(true) //done(true) will hide painterro, done(false) will leave opened
                        //     }
                        //     xhr.send(formData)
                        // },
                    }).show()
                }, 1000)
            }}
        >
            <div dangerouslySetInnerHTML={{ __html: `<div id="${uid}">🟢</div>` }}></div>
        </div>
    )
})
