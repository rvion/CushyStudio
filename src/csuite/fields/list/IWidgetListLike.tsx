export type IWidgetListLike = {
   addItem(): void
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
