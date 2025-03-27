import type { Field_board } from './Field_board'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { Layer, Stage } from 'react-konva'

import { InputNumberUI } from '../../input-number/InputNumberUI'
import { ReactKonvaRectangleUI } from './ReactKonvaRectangleUI'

export const WidgetListExt_KonvaBoardUI = obs(function WidgetListExt_KonvaBoardUI(p: {
   field: Field_board<any>
}) {
   const RG = p.field
   const entries = RG.zFields.items.map((i) => i.zFields)
   const uist = useLocalObservable(() => ({ scale: 1 }))
   return (
      <>
         <InputNumberUI
            mode='float'
            min={0}
            max={1}
            value={uist.scale}
            onValueChange={(v) => {
               uist.scale = v
            }}
         />
         <div
            style={{
               transform: `scale(${uist.scale})`,
               width: RG.zFields.area.width * uist.scale,
               height: RG.zFields.area.height * uist.scale,
               transformOrigin: 'top left',
               display: 'block',
               border: '1px solid red',
            }}
         >
            <Stage
               //
               width={RG.zFields.area.width}
               height={RG.zFields.area.height}
               onContextMenu={(e) => {
                  e.evt.preventDefault()
                  console.log('context menu')
                  // get image from stage
                  const dataURL = e.target.toDataURL()
                  console.log(dataURL)
               }}
            >
               <Layer>
                  {/* <Text text='Try to drag a star' /> */}
                  {entries.map(({ shape, value }) => (
                     <ReactKonvaRectangleUI
                        key={`rect-${value.id}`}
                        onChange={(p) => {
                           shape.zRunInTransaction(() => {
                              const v = shape.zValue
                              Object.assign(v, p)
                           })
                           value.applyValueUpdateEffects()
                        }}
                        isSelected={shape.zValue.isSelected}
                        shape={shape.zValue}
                        // shape={{ x: 10, y: 10, width: 100, height: 100, fill: 'red', z: 0, depth: 0 }}
                     />
                  ))}
               </Layer>
            </Stage>
         </div>
      </>
   )
})
