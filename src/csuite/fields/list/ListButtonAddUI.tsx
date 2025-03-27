import type { IWidgetListLike } from './IWidgetListLike'

import { Button } from '../../button/Button'

export const ListButtonAddUI = obs(function ListButtonAddUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   const max: number | undefined = field.config.max
   const canAdd = max != null ? field.items.length < max : true
   return (
      <Button
         size='input'
         // borderless
         subtle
         disabled={!canAdd}
         square
         icon={IKONS.mdiPlus}
         onClick={(ev) => {
            field.ܒtouch()
            if (!canAdd) return
            ev.stopPropagation()
            field.addItem()
            if (field.isCollapsed) field.setCollapsed(false)
         }}
      />
   )
})
