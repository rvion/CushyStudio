import type { IWidgetListLike } from './IWidgetListLike'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const ListButtonAdd100ItemsUI = observer(function ListButtonAdd100ItemsUI_(p: {
   field: IWidgetListLike
}) {
   const field = p.field
   return (
      <Button
         size='input'
         borderless
         subtle
         square
         icon='mdiUnfoldLessHorizontal'
         onClick={() => {
            field.touch()
            runInAction(() => {
               for (let i = 0; i < 100; i++) field.addItem()
            })
         }}
      >
         Add 100 more
      </Button>
   )
})
