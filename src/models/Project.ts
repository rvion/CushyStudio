import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfySchemaL } from './ComfySchema'
import type { ComfyWorkflowL } from './ComfyWorkflow'

import { SQLITE_false, SQLITE_true } from '../csuite/types/SQLITE_boolean'
import { LiveRef } from '../db/LiveRef'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { DraftL } from './Draft'

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
