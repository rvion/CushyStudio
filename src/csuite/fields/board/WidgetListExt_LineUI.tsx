import type { Field_board } from './Field_board'

import { observer } from 'mobx-react-lite'

import { ListControlsUI } from '../list/ListControlsUI'

export const WidgetListExt_LineUI = observer(function WidgetList_LineUI_(p: { field: Field_board<any> }) {
   return (
      <div tw='flex flex-1 items-center'>
         <div tw='text-sm italic text-gray-500'>{p.field.fields.items.length} items</div>
         <div tw='ml-auto'>
            <ListControlsUI field={p.field.fields.items} />
         </div>
      </div>
   )
})
