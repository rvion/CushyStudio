import type { Field } from '../../model/Field'

import { useCSuite } from '../../ctx/useCSuite'
import { ListButtonAddUI } from './ListButtonAddUI'
import { ListButtonClearUI } from './ListButtonClearUI'
import { ListButtonFoldUI } from './ListButtonFoldUI'
import { ListButtonUnfoldUI } from './ListButtonUnfoldUI'

export type IWidgetListLike = {
   addItem(): Maybe<Field>
   removeAllItems(): void
   expandAllChildren(): void
   collapseAllChildren(): void
   readonly items: readonly unknown[]
   readonly length: number
   readonly isCollapsed?: boolean
   setCollapsed(value: boolean): void
   touch: () => void
   config: {
      max?: number
      min?: number
   }
}

export const ListControlsUI = obs(function ListControlsUI_({
   field,
   children,
   ...rest
}: {
   //
   field: IWidgetListLike
   children?: React.ReactNode
}) {
   const csuite = useCSuite()
   return (
      <div
         tw='sticky top-0 z-[50] flex w-full items-center gap-0.5'
         onMouseDown={(ev) => {
            ev.preventDefault()
            ev.stopPropagation()
         }}
         {...rest}
      >
         <ListButtonAddUI field={field} />
         {children}
         <div tw='flex-1' />
         <ListButtonClearUI field={field} />
         {csuite.showFoldButtons && <ListButtonFoldUI field={field} />}
         {csuite.showFoldButtons && <ListButtonUnfoldUI field={field} />}
         {/* <ListButtonAdd100ItemsUI field={field} /> */}
      </div>
   )
})
