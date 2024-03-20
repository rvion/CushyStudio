import type { LiveInstance } from '../db/LiveInstance'
import type { ComfySchemaL } from './ComfySchema'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { TABLES } from 'src/db/TYPES.gen'

import { LiveRef } from '../db/LiveRef'
import { DraftL } from './Draft'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { SQLITE_false, SQLITE_true } from '../db/SQLITE_boolean'

export type ProjectID = Branded<string, { ProjectID: true }>
export const asProjectID = (s: string): ProjectID => s as any

/** a thin wrapper around a single Project somewhere in a .ts file */
export interface ProjectL extends LiveInstance<TABLES['project']> {}
export class ProjectL {
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
