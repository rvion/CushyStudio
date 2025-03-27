import type { Field } from '../../model/Field'

export type IWidgetListLike = {
   // list specific
   readonly items: readonly unknown[]
   readonly length: number
   addItem(): Maybe<Field>
   removeAllItems(): void

   // field specific
   ϟexpandAllChildren(): void
   ϟcollapseAllChildren(): void
   readonly ϟisCollapsed?: boolean
   ϟsetCollapsed(value: boolean): void
   ϟtouch: () => void
   ϟconfig: {
      max?: number
      min?: number
   }
}
