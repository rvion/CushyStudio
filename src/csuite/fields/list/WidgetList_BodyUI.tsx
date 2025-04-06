import type { CSchema } from '../../model/CSchema'
import type { Field_list } from './FieldList'

import { Button } from '../../button/Button'
import { ListItemMoveDownButtonUI } from './ListItemMoveDownButtonUI'
import { ListItemMoveUpButtonUI } from './ListItemMoveUpButtonUI'

export const WidgetList_BodyUI = obs(function WidgetList_BodyUI_<T extends CSchema>(p: {
   field: Field_list<T>
   forLabelUse: 'key' | 'index'
   className?: string
}) {
   const listField = p.field
   const subFields = listField.items
   const min = listField.zConfig.min
   return (
      <div /* SortableList */
         // onSortEnd={(s, e) => p.field.moveItem(s, e)}
         // draggedItemClassName='dragged'
         tw={p.className}
         className='list'
      >
         {subFields.map((subField, ix) => {
            const title =
               p.forLabelUse === undefined
                  ? ix.toString()
                  : p.forLabelUse === 'key'
                    ? subField.zMountKey
                    : ix.toString()
            return (
               <div /* SortableItem */ key={subField.zUid}>
                  <subField.UI
                     Title={title}
                     // slotDragKnob={
                     //     <div tw='flex'>
                     //         <SortableKnob>
                     //             <ListDragHandleUI field={subField} ix={ix} />
                     //         </SortableKnob>
                     //     </div>
                     // }
                     DeleteBtn={
                        listField.isAuto ? null : (
                           <Button
                              disabled={min != null && listField.items.length <= min}
                              square
                              size='input'
                              subtle
                              icon={IKONS.mdiDeleteOutline}
                              onClick={(ev) => {
                                 listField.removeItem(subField)
                                 listField.zTouch()
                                 ev.preventDefault()
                                 ev.stopPropagation()
                              }}
                              onBlur={() => listField.zTouch()}
                           />
                        )
                     }
                     UpDownBtn={
                        listField.isAuto ? null : (
                           <div tw='flex'>
                              <ListItemMoveUpButtonUI listField={listField} ix={ix} />
                              <ListItemMoveDownButtonUI listField={listField} ix={ix} />
                           </div>
                        )
                     }
                  />
               </div>
            )
         })}
      </div>
   )
})
