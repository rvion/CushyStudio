import type { IWidgetListLike } from './IWidgetListLike'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const ListButtonAddUI = observer(function ListButtonAddUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   const max: number | undefined = field.config.max
   const canAdd = max != null ? field.items.length < max : true
   return (
      <Button
         size='input'
         // borderless
         disabled={!canAdd}
         square
         icon='mdiPlus'
         onClick={(ev) => {
            field.touch()
            if (!canAdd) return
            ev.stopPropagation()
            field.addItem()
            if (field.isCollapsed) field.setCollapsed(false)
         }}
      />
   )
})
