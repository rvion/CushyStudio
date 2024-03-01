import type { LiteGraphJSON } from 'src/core/LiteGraph'

import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { useSt } from '../state/stateContext'

export const Panel_ComfyUI = observer(function Panel_ComfyUI_(p: {
    //
    // autoLoadLast?: boolean
    litegraphJson?: Maybe<LiteGraphJSON>
    className?: string
    hostID?: HostID
}) {
    const st = useSt()
    const host = st.db.hosts.get(p.hostID) ?? st.mainHost
    const url = host.getServerHostHTTP()

    const loadFn = async () => {
        // ensure we have a flow ready to load
        if (p.litegraphJson == null) return

        // ensure the iframe is ready
        const iframe = st.comfyUIIframeRef.current
        if (iframe == null) return

        let app: any = null
        let maxWait = 1000
        while (app == null && maxWait > 0) {
            // retrieve the subwindow
            const _subWindow = iframe.contentWindow
            const subWindow = _subWindow as any
            // console.log('🟢', x)
            app = subWindow.app
            console.log(`${maxWait} waiting for ComfyUI to be ready...`) // { subWindow }, { app })
            if (app == null) await new Promise((resolve) => setTimeout(resolve, 100))
            else break
            maxWait--
        }
        if (app == null) return console.log('❌ error loading app')
        // await new Promise((resolve) => setTimeout(resolve, 4000))
        // console.log('🟢', app)
        // const json
        // y.app.handleFile
        const flowJson = toJS(p.litegraphJson)
        const flowJsonStr = JSON.stringify(flowJson)
        // console.log(flowJsonStr)
        // https://github.com/comfyanonymous/ComfyUI/blob/ba7dfd60f2ad80d436322b59f456409087a4a1c1/web/scripts/app.js#L1648C1-L1648C3
        // console.log(Object.keys(app))
        // console.log(Object.keys(app.graph))
        // app.loadGraphData(toJS(flowJson))
        const method: 'viaFile' | 'viaJSON' = 'viaFile'
        if (method === 'viaFile') {
            // console.log(Object.keys(app))
            app.handleFile(new File([flowJsonStr], 'flow.json'))
        } else {
            app.loadGraphData(toJS(flowJson))
        }
        // for debug purpose, onw may want to uncomment next two lines
    }

    useLayoutEffect(() => {
        if (!st.comfyUIIframeRef.current) return
        loadFn()
    }, [st.comfyUIIframeRef.current])

    return (
        <>
            {/* <div className='absolute top-0 right-0'>
                <Button appearance='ghost' size='sm' disabled={p.litegraphJson == null} onClick={loadFn}>
                    Manual load in case it hasn't loaded
                </Button>
            </div> */}
            <iframe //
                ref={st.comfyUIIframeRef}
                src={url}
                className={p.className}
                // style={{ width: '100%', height: '100%', border: 'none' }}
            ></iframe>
        </>
    )
})
