import type { CollapsibleProps } from './CollapsibleProps'

import { makeAutoObservable } from 'mobx'

export class CollapsibleState {
   constructor(public p: CollapsibleProps) {
      makeAutoObservable(this)
   }

   isCollapsed: boolean = this.p.startCollapsed ?? true

   get isExpanded(): boolean {
      return !this.isCollapsed
   }

   toggle(): void {
      this.isCollapsed = !this.isCollapsed
      this.p.onToggle?.(this)
   }

   open(): void {
      this.isCollapsed = false
   }

   close(): void {
      this.isCollapsed = true
   }
}
