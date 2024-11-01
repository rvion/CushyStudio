import { observer } from 'mobx-react-lite'
import React, { useMemo } from 'react'

import { mkPlacement } from '../../csuite/fields/core-prefabs/ShapeSchema'
import { RegionUI } from '../../csuite/regions/RegionUI'
import { useImageDrop } from '../../widgets/galleries/dnd'
import { CanvasToolbarUI } from './menu/CanvasToolbarUI'
import { UnifiedCanvasMenuUI } from './menu/UnifiedCanvasMenuUI'
import { PanelCanvasHeaderUI } from './PanelCanvasHeaderUI'
import { PixiUC } from './pixi/PixiUC'
import { UnifiedCanvas } from './states/UnifiedCanvas'
import { UnifiedCanvasCtx } from './states/UnifiedCanvasCtx'
import { useUCV2 } from './stateV2/ucV2'
import { useSize } from './utils/useSize'

export type PanelCanvasProps = {
   startingImgID?: MediaImageID
}

// https://github.com/devforth/painterro
export const PanelCanvasUI = observer(function Panel_Canvas_(p: PanelCanvasProps) {
   const uc2 = useUCV2()
   const canvas: UnifiedCanvas = useMemo(() => new UnifiedCanvas(cushy, uc2), [uc2])
   const [dropStyle, dropRef] = useImageDrop(cushy, (img) => {
      // runInAction(() => canvas.addImage(img))
      uc2.Layers.push({
         placement: mkPlacement({ x: 0, y: 0 }),
         name: img.id,
         visible: true,
         content: { image: img },
      })
   })
   const containerRef = React.useRef<HTMLDivElement>(null)
   const size = useSize(containerRef)
   // React.useEffect(() => {
   //     if (size == null) return
   //     // console.log(`[🧐] size.height=`, size.height, size.width)
   //     canvas.stage.width(size.width)
   //     canvas.stage.height(size.height)
   // }, [Math.round(size?.width ?? 100), Math.round(size?.height ?? 100)])

   // auto-mount canvas
   // React.useEffect(() => {
   //     if (canvas.rootRef.current == null) return
   //     canvas.rootRef.current.innerHTML = ''
   //     canvas.stage.container(canvas.rootRef.current)
   //     // canvas.rootRef.current.addEventListener('keydown', canvas.onKeyDown)
   //     // console.log(`[🟢] MOUNT`)
   //     return (): void => {
   //         // console.log(`[🔴] CLEANUP`, canvas.rootRef.current)
   //         if (canvas.rootRef.current == null) return
   //     }
   // }, [canvas.rootRef])

   // const scale = canvas.infos.scale * 100
   return (
      <div //
         tabIndex={0}
         ref={containerRef}
         className='flex size-full flex-1 overflow-hidden'
      >
         <RegionUI //
            tw='flex flex-1 flex-col'
            regionName='UnifiedCanvas2'
            regionCtx={UnifiedCanvasCtx}
            regionValue={canvas}
         >
            <PanelCanvasHeaderUI />
            <div
               style={dropStyle}
               ref={dropRef}
               className='DROP_IMAGE_HANDLER'
               tw='_Panel_Canvas relative !z-0 flex flex-grow flex-row'
               // key={canvas.stage.id()}
               // style={{ ...dropStyle, border: '4px solid red' }}
            >
               <PixiUC //
               // resizeTo={containerRef}
               // width={size?.width ?? 100}
               // height={size?.height ?? 100}
               />
               <div tw='absolute top-0 z-[999999] opacity-50'>
                  <uc2.UI />
               </div>
               <CanvasToolbarUI />
               <UnifiedCanvasMenuUI />
            </div>
         </RegionUI>
      </div>
   )
})
