import type { IWidgetListLike } from './ListControlsUI'

import { Button } from '../../button/Button'

export const ListButtonUnfoldUI = obs(function ListButtonUnfoldUI_(p: { field: IWidgetListLike }) {
   const field = p.field
   return (
      <Button
         size='input'
         borderless
         subtle
         square
         icon={IKONS.mdiUnfoldLessHorizontal}
         onClick={(ev) => {
            field.touch()
            ev.stopPropagation()
            field.collapseAllChildren()
         }}
      />
   )
})
