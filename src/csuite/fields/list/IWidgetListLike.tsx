import type { Field } from '../../model/Field'

export type IWidgetListLike = {
   // list specific
   readonly items: readonly unknown[]
   readonly length: number
   addItem(): Maybe<Field>
   removeAllItems(): void

   // field specific
   zExpandAllChildren(): void
   zCollapseAllChildren(): void
   readonly zIsCollapsed?: boolean
   zSetCollapsed(value: boolean): void
   zTouch: () => void
   zConfig: {
      max?: number
      min?: number
   }
}
