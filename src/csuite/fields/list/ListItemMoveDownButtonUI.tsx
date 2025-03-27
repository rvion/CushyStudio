import type { Field_list } from './FieldList'

import { Button } from '../../button/Button'

export const ListItemMoveDownButtonUI = obs(function ListItemMoveDownButtonUI_({
   listField,
   ix,
}: {
   listField: Field_list<any>
   ix: number
}) {
   return (
      <Button
         //
         disabled={ix === listField.length - 1}
         onClick={(ev) => {
            listField.moveItem(ix, ix + 1)
            listField.ܒtouch()
            ev.preventDefault()
            ev.stopPropagation()
         }}
         square
         borderless
         subtle
         size='xs'
         icon={IKONS.mdiArrowDown}
      />
   )
})
