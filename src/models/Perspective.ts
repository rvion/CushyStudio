import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { AnnotationMapEntry } from 'mobx'

import { BaseInst } from '../db/BaseInst'
import { LiveTable } from '../db/LiveTable'
import { perspectiveHelper } from '../router/DefaultPerspective'

export class PerspectiveRepo extends LiveTable<TABLES['perspective'], typeof PerspectiveL> {
    getOrCreate = (name: string): PerspectiveL => {
        const x = this.selectOne((t) => t.where('name', '=', name))
        if (x) return x
        return this.create({
            priority: 100,
            name,
            layout: perspectiveHelper.default(),
        })
    }

    get all(): PerspectiveL[] {
        return this.findMany()
    }

    constructor(liveDB: LiveDB) {
        super(liveDB, 'perspective', '🗂️', PerspectiveL)
        this.init()
    }
}

export class PerspectiveL extends BaseInst<TABLES['perspective']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: Record<string, AnnotationMapEntry> = {
        layout: false,
        layoutDefault: false,
    }
    open(): void {
        cushy.layout.openPerspective(this)
    }

    get isActive(): boolean {
        return cushy.layout.perspective === this
    }

    resetToDefault(): void {
        this.update({ layout: perspectiveHelper.default() })
        cushy.layout.openPerspective(this)
    }

    saveSnapshot(): void {}
    resetToSnapshot(): void {}
    duplicate(): void {}
}
