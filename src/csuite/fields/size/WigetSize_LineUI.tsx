import type { Field_size } from './FieldSize'

import { WidgetSizeX_LineUI } from './WidgetSizeX_LineUI'

export const WigetSize_LineUI = obs(function WigetSize_LineUI_(p: { field: Field_size }) {
   // 🔴❓ return <WidgetSizeX_LineUI size={p.field} bounds={p.field.config} />
   return (
      <div tw='flex flex-1 flex-col'>
         <WidgetSizeX_LineUI size={p.field} bounds={p.field.ϟconfig} />
         {/* {p.field.isCollapsed ? null : <WigetSizeXUI size={p.field} bounds={p.field.config} />} */}
      </div>
   )
   // return (
   //     <div>
   //         <pre>{JSON.stringify(p.field.serial)}</pre>
   //         <WidgetSizeX_LineUI size={p.field} bounds={p.field.config} />
   //     </div>
   // )
   return <></>
})
