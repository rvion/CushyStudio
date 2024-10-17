import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfySchemaL } from './ComfySchema'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { DraftL } from './Draft'

import { SQLITE_false, SQLITE_true } from '../csuite/types/SQLITE_boolean'
import { BaseInst } from '../db/BaseInst'
import { LiveRef } from '../db/LiveRef'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { LiveTable } from '../db/LiveTable'

export type ProjectID = Branded<string, { ProjectID: true }>
export const asProjectID = (s: string): ProjectID => s as any

export class ProjectRepo extends LiveTable<TABLES['project'], typeof ProjectL> {
    constructor(liveDB: LiveDB) {
        super(liveDB, 'project', '🤠', ProjectL)
        this.init()
    }
}

/** a thin wrapper around a single Project somewhere in a .ts file */
export class ProjectL extends BaseInst<TABLES['project']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined

    rootGraph = new LiveRef<this, ComfyWorkflowL>(this, 'rootGraphID', 'comfy_workflow')
    draft = new LiveRefOpt<this, DraftL>(this, 'currentDraftID', 'draft')

    get filterNSFW(): boolean {
        return this.data.filterNSFW ? true : false
    }
    set filterNSFW(v: boolean) {
        this.update({ filterNSFW: v ? SQLITE_true : SQLITE_false })
    }
    get schema(): ComfySchemaL {
        return this.st.schema
    }
}
