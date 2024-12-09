import type { Field } from '../../model/Field'

export type IWidgetListLike = {
   addItem(): Maybe<Field>
   removeAllItems(): void
   expandAllChildren(): void
   collapseAllChildren(): void
   items: unknown[]
   readonly length: number
   readonly isCollapsed?: boolean
   setCollapsed(value: boolean): void
   touch: () => void
   config: {
      max?: number
      min?: number
   }
}
