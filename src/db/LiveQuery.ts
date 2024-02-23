import type { BaseInstanceFields, LiveInstance } from './LiveInstance'

import { makeAutoObservable } from 'mobx'

import { DEPENDS_ON } from './LiveHelpers'
import { LiveTable } from './LiveTable'

export class LiveFind<
    //
    T extends BaseInstanceFields,
    L extends LiveInstance<T, L>,
> {
    constructor(
        public p: {
            remoteTable: () => LiveTable<T, any, L>
            remoteQuery: () => Partial<T>
            cache?: () => boolean
        },
    ) {
        makeAutoObservable(this)
    }

    get items(): L[] {
        const remoteTable = this.p.remoteTable()
        const shouldCache = this.p.cache?.() ?? false
        if (!shouldCache) {
            // console.log(`<<< ${remoteTable.name} has size ${remoteTable.liveEntities.size} >>>`)
            DEPENDS_ON(remoteTable.liveEntities.size)
        }
        return remoteTable.find(this.p.remoteQuery())
    }

    map = <T>(fn: (l: L) => T): T[] => this.items.map(fn)
}
