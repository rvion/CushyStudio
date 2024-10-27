import type { BaseSchema } from '../../model/BaseSchema'
import type { Field_board } from './Field_board'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { Layer, Stage } from 'react-konva'

import { InputNumberUI } from '../../input-number/InputNumberUI'
import { ReactKonvaRectangleUI } from './ReactKonvaRectangleUI'

export const WidgetListExt_KonvaBoardUI = observer(function WidgetListExt_KonvaBoardUI(p: {
   field: Field_board<any>
}) {
   const RG = p.field
   const entries = RG.fields.items.childrenActive.map((i) => i.fields)
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
               width: RG.fields.area.width * uist.scale,
               height: RG.fields.area.height * uist.scale,
               transformOrigin: 'top left',
               display: 'block',
               border: '1px solid red',
            }}
         >
            <Stage
               //
               width={RG.fields.area.width}
               height={RG.fields.area.height}
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
                           shape.runInValueTransaction(() => {
                              const v = shape.value
                              Object.assign(v, p)
                           })
                           value.applyValueUpdateEffects()
                        }}
                        isSelected={shape.value.isSelected}
                        shape={shape.value}
                        // shape={{ x: 10, y: 10, width: 100, height: 100, fill: 'red', z: 0, depth: 0 }}
                     />
                  ))}
               </Layer>
            </Stage>
         </div>
      </>
   )
})
