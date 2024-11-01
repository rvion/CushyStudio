import { extend } from '@pixi/react'
import { runInAction, trace } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Viewport } from 'pixi-viewport'
import React, { useState } from 'react'

import { useUnifiedCanvas } from '../../states/UnifiedCanvasCtx'
// import { ViewportCtx, ViewportWrapper } from './PixiViewportCtx'
import { useApplication2 } from './workaround/useApplication/PixiApplicationContext2'

extend({ Viewport })

export type PixiViewportProps = {
   worldWidth?: number
   worldWeight?: number
   children: React.ReactNode[]
   onSetup?: (viewport: Viewport) => void
}

// https://github.com/davidfig/pixi-viewport/issues/488#issuecomment-2156417301

let max: number = 20
export const PixiViewport = observer(function PixiViewport_(p: PixiViewportProps) {
   const uc = useUnifiedCanvas()
   // const app = useApplication2()
   const [wrapper, setWrapper] = useState<Viewport | null>(null)
   if (max-- < 0) return null
   if (uc.app == null) return
   // if (!isInitialised) return null
   console.log(`[✅] FINAL:`, wrapper)
   return (
      <viewport // zoom/pan/pinch/scroll area
         events={uc.app.renderer.events}
         ref={(viewport) => {
            if (wrapper != null) return
            if (viewport == null) return
            console.log(`[✅] setWrapper!`)
            runInAction(() => {
               setWrapper(viewport)
               p.onSetup?.(viewport)
            })
         }}
         worldHeight={p.worldWidth}
         worldWidth={p.worldWeight}
         // height={10_000}
         // width={10_000}
         // minScale={0.1}
      >
         {p.children}
         {/* {wrapper && <ViewportCtx.Provider value={wrapper}>{p.children}</ViewportCtx.Provider>} */}
      </viewport>
   )
})

// https://github.com/davidfig/pixi-viewport/issues/488#issuecomment-2156417301
// For those who are struggling, here is a simple example for V8.
//
//| ```ts
//| const app = new Pixi();
//|
//| await app.init({
//|   backgroundColor: "#FFF5D4",
//|   resizeTo: window,
//|   antialias: true,
//|   autoDensity: true, // !!!
//|   resolution: 2,
//| });
//|
//| const viewport = new Viewport({
//|   passiveWheel: false,
//|   events: app.renderer.events
//| })
//|
//| // activate plugins
//| viewport
//|   .drag()
//|   .pinch()
//|   .wheel()
//|   .decelerate()
//|
//| // add the viewport to the stage
//| app.stage.addChild(viewport)
//| ```
