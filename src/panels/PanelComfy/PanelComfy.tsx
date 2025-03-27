import type { LiteGraphJSON } from '../../comfyui/litegraph/LiteGraphJSON'

import { toJS } from 'mobx'

import { nanoid } from 'nanoid'
import { useLayoutEffect } from 'react'

import { Button } from '../../csuite/button/Button'
import { PanelUI } from '../../csuite/panel/PanelUI'
import { Panel, type PanelHeader } from '../../router/Panel'
import { usePanel } from '../../router/usePanel'

export const PanelComfy = new Panel({
   name: 'ComfyUI',
   category: 'ComfyUI',
   widget: (): React.FC<PanelComfyUIProps> => PanelComfyUI,
   header: (p): PanelHeader => ({ title: 'ComfyUI' }),
   def: (): PanelComfyUIProps => ({}),
   icon: IKONS.mdiCabinAFrame,
})

export type PanelComfyUIProps = {
   // autoLoadLast?: boolean
   litegraphJson?: Maybe<LiteGraphJSON>
   className?: string
   hostID?: HostID
}

export const PanelComfyUI = obs(function PanelComfyUI_(p: PanelComfyUIProps) {
   const host = cushy.db.host.get(p.hostID) ?? cushy.mainHost
   const url = host.getServerHostHTTP()
   const conf = usePanel().usePersistentModel('uist', (ui) =>
      ui.fields({
         hash: ui.string({ default: '' }),
      }),
   )

   const loadFn = async (): Promise<void> => {
      // ensure we have a flow ready to load
      if (p.litegraphJson == null) return

      // ensure the iframe is ready
      const iframe = cushy.comfyUIIframeRef.current
      if (iframe == null) return

      let app: any = null
      let maxWait = 1000
      while (app == null && maxWait > 0) {
         // retrieve the subwindow
         const _subWindow = iframe.contentWindow
         const subWindow = _subWindow as any
         // console.log('🟢', x)
         app = subWindow.app
         // console.log(`${maxWait} waiting for ComfyUI to be ready...`) // { subWindow }, { app })
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
      if (!cushy.comfyUIIframeRef.current) return
      void loadFn()
   }, [cushy.comfyUIIframeRef.current])

   const finalURL = conf.ϟvalue.hash ? `${url}?hash=${conf.ϟvalue.hash}` : url
   return (
      <PanelUI>
         {/* <div className='absolute top-0 right-0'>
                <Button look='ghost' size='sm' disabled={p.litegraphJson == null} onClick={loadFn}>
                    Manual load in case it hasn't loaded
                </Button>
            </div> */}
         <PanelUI.Header>
            <Button
               onClick={() => {
                  conf.ϟvalue.hash = nanoid()
               }}
            >
               force-refresh {conf.ϟvalue.hash ? `${conf.ϟvalue.hash})` : null}
            </Button>
            {url}
         </PanelUI.Header>
         <iframe //
            ref={cushy.comfyUIIframeRef}
            src={finalURL}
            tw='disable-x-frame-options'
            className={p.className}
            // style={{ width: '100%', height: '100%', border: 'none' }}
         ></iframe>
      </PanelUI>
   )
})
