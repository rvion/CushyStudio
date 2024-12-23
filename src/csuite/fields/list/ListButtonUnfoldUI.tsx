import type { IWidgetListLike } from './IWidgetListLike'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const ListButtonUnfoldUI = observer(function ListButtonUnfoldUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   return (
      <Button
         size='input'
         borderless
         subtle
         square
         icon='mdiUnfoldLessHorizontal'
         onClick={(ev) => {
            ev.stopPropagation()
            field.collapseAllChildren()
         }}
      />
   )
})
