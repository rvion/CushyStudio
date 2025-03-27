import type { IWidgetListLike } from './IWidgetListLike'

import { Button } from '../../button/Button'

export const ListButtonFoldUI = obs(function ListButtonFoldUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   return (
      <Button
         size='input'
         borderless
         subtle
         square
         icon={IKONS.mdiUnfoldMoreHorizontal}
         onClick={(ev) => {
            field.zTouch()
            ev.stopPropagation()
            field.zExpandAllChildren()
         }}
      />
   )
})
