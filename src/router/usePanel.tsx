import type { CushyLayoutManager } from './Layout'
import type * as FL from 'flexlayout-react'

import React from 'react'

export type PanelID = string

export class PanelState {
    constructor(
        public node: FL.TabNode,
        public id: PanelID,
    ) {}

    setProps(p: any): void {
        throw new Error('❌ setProps not implemented')
        // this.node.getext({ props: p })
    }

    get layout(): CushyLayoutManager {
        return cushy.layout
    }

    getExtraData(): any {
        return this.node.getExtraData()
    }

    getConfig(): any {
        return this.node.getConfig()
    }

    stores: Map<string, PersistentStore> = new Map<string, PersistentStore>()
    usePersistentStore = <X extends any>(key: string): PersistentStore => {
        const prev = this.stores.get(key)
        if (prev != null) return prev
        const next = new PersistentStore(this, key)
        this.stores.set(key, next)
        return next
    }
}

class PersistentStore {
    constructor(
        //
        public ps: PanelState,
        public key: string,
    ) {}

    get(): void {
        // 🔴 UNFINISHED
        // return this.ps.node.getConfig()
    }
}

export const panelContext = React.createContext<PanelState | null>(null)

/**
 * THIS IS A KEY HOOK OF CushyStudio
 * it returns a stable helper instance that allow various things like
 *   - manipulate panel props
 *   - access panel position
 *   - allocate persistent resources
 *   -
 */
export const usePanel = (): PanelState => {
    const data = React.useContext(panelContext)
    if (data == null) throw new Error('❌ usePanel has been called not in a Panel')
    return data
}
