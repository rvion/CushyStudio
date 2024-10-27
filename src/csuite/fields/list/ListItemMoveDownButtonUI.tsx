import type { Field_list } from './FieldList'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const ListItemMoveDownButtonUI = observer(function ListItemMoveDownButtonUI_({
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
         onClick={() => {
            listField.moveItem(ix, ix + 1)
            listField.touch()
         }}
         square
         borderless
         subtle
         size='xs'
         icon='mdiArrowDown'
      />
   )
})
