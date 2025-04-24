import type { IWidgetListLike } from './IWidgetListLike'

import { Button } from '../../button/Button'

export const ListButtonClearUI = obs(function ListButtonClearUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   const min: number | undefined = field.zConfig.min
   const canClear = min != null ? field.items.length > min : true
   return (
      <Button
         size='input'
         borderless
         subtle
         disabled={!canClear}
         square
         icon={IKONS.mdiDeleteSweep}
         onClick={(ev) => {
            field.zTouch()
            if (!canClear) return
            ev.stopPropagation()
            field.removeAllItems()
         }}
      />
   )
})
