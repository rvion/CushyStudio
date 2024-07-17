import type { CollapsibleProps } from './CollapsibleProps'

import { makeAutoObservable } from 'mobx'

export class CollapsibleState {
    constructor(public p: CollapsibleProps) {
        makeAutoObservable(this)
    }

    isCollapsed = this.p.startCollapsed ?? true

    get isExpanded(): boolean {
        return !this.isCollapsed
    }

    toggle(): void {
        if (this.p.onToggle) this.p.onToggle?.(this)
        else this.isCollapsed = !this.isCollapsed
    }

    open(): void {
        this.isCollapsed = false
    }

    close(): void {
        this.isCollapsed = true
    }
}
