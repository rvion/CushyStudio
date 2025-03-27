import type { IWidgetListLike } from './IWidgetListLike'
import { runInAction } from 'mobx'

import { Button } from '../../button/Button'

export const ListButtonAdd100ItemsUI = obs(function ListButtonAdd100ItemsUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   return (
      <Button
         size='input'
         borderless
         subtle
         square
         icon={IKONS.mdiUnfoldLessHorizontal}
         onClick={() => {
            field.ϟtouch()
            runInAction(() => {
               for (let i = 0; i < 100; i++) field.addItem()
            })
         }}
      >
         Add 100 more
      </Button>
   )
})
