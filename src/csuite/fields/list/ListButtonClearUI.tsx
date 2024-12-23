import type { IWidgetListLike } from './IWidgetListLike'

import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const ListButtonClearUI = observer(function ListButtonClearUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   const min: number | undefined = field.config.min
   const canClear = min != null ? field.items.length > min : true
   return (
      <Button
         size='input'
         borderless
         subtle
         disabled={!canClear}
         square
         icon='mdiDeleteSweep'
         onClick={(ev) => {
            field.touch()
            if (!canClear) return
            ev.stopPropagation()
            field.removeAllItems()
         }}
      />
   )
})
