import type { UIActionComfy } from 'src/front/UIAction'
import { observer } from 'mobx-react-lite'
import { useSt } from '../../../front/FrontStateCtx'
import { useLayoutEffect } from 'react'
import { Button } from 'rsuite'
import { toJS } from 'mobx'

export const ComfyUIUI = observer(function ComfyUIUI_(p: { action: UIActionComfy }) {
    const st = useSt()
    const url = st.getServerHostHTTP()
    useLayoutEffect(() => {
        const k = st.comfyUIIframeRef.current
        if (k == null) return
        console.log('🟢', k)
        const x = k.contentWindow
        const y = x as any
        console.log('🟢', x)
        console.log('🟢', y.app)
        ;(window as any).cf = k
    }, [st.comfyUIIframeRef.current])
    return (
        <>
            {/* <Button
                disabled={p.action.json == null}
                onClick={() => {
                    const k = st.comfyUIIframeRef.current
                    if (k == null) return
                    console.log('🟢', k)
                    const x = k.contentWindow
                    const y = x as any
                    console.log('🟢', x)
                    console.log('🟢', y.app)
                    ;(window as any).cf = k
                    // const json
                    // y.app.handleFile
                    if (p.action.json == null) return
                    const flowJson = toJS(p.action.json)
                    console.log(flowJson)
                    // https://github.com/comfyanonymous/ComfyUI/blob/ba7dfd60f2ad80d436322b59f456409087a4a1c1/web/scripts/app.js#L1648C1-L1648C3
                    y.app.loadGraphData(flowJson)
                }}
            >
                Test
            </Button> */}
            <iframe //
                ref={st.comfyUIIframeRef}
                src={url}
                style={{ width: '100%', height: '100%' }}
            ></iframe>
        </>
    )
})
