import type { CSchema } from '../../model/CSchema'
import type { Field_board } from './Field_board'

import { Button } from '../../button/Button'

export const WidgetListExt_ValuesUI = obs(function WidgetListExtValuesUI_<T extends CSchema>(p: {
   //
   field: Field_board<T>
}) {
   const listExt = p.field
   const { items } = listExt.ϟfields
   const values = listExt.ϟfields.items.ϟchildrenAll
   const len = values.length
   const indexWidth = len < 10 ? 1 : len < 100 ? 2 : 3
   const min = items.ϟconfig.min
   return (
      <div tw='flex flex-col gap-1'>
         {values.map((sub2, ix) => {
            const sub = sub2.ϟfields
            const subWidget = sub.value
            const shape = sub.shape
            return (
               <div key={subWidget.ϟuid} tw='flex items-start'>
                  <div style={{ width: `${indexWidth}rem` }}>{ix}</div>
                  <input
                     value={shape.ϟvalue.fill}
                     onChange={(ev) => (shape.ϟvalue.fill = ev.target.value)}
                     type='color'
                     tw='w-7'
                  ></input>
                  <Button
                     style={{ width: `${indexWidth}rem` }}
                     look='subtle'
                     size='sm'
                     onClick={() => subWidget.ϟsetCollapsed(!Boolean(subWidget.ϟserial.collapsed))}
                  >
                     {subWidget.ϟserial.collapsed ? '▸' : '▿'}
                  </Button>
                  <subWidget.UI />
                  <shape.UI />
                  <Button
                     look='subtle'
                     disabled={min ? items.length <= min : undefined}
                     tw='self-start'
                     onClick={() => items.removeItem(sub2)}
                     size='sm'
                  >
                     X
                  </Button>
               </div>
            )
         })}
      </div>
   )
})
