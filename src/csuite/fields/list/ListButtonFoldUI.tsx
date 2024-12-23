import type { IWidgetListLike } from './IWidgetListLike'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const ListButtonFoldUI = observer(function ListButtonFoldUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   return (
      <Button
         size='input'
         borderless
         subtle
         square
         icon='mdiUnfoldMoreHorizontal'
         onClick={(ev) => {
            field.touch()
            ev.stopPropagation()
            field.expandAllChildren()
         }}
      />
   )
})
