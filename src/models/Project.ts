import type { LiveInstance } from '../db/LiveInstance'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { ComfySchemaL } from './Schema'

import { LiveRef } from '../db/LiveRef'
import { DraftL } from './Draft'
import { LiveRefOpt } from 'src/db/LiveRefOpt'
import { SQLITE_false, SQLITE_true } from 'src/db/SQLITE_boolean'
import { ProjectT } from 'src/db/TYPES.gen'

export type ProjectID = Branded<string, { ProjectID: true }>
export const asProjectID = (s: string): ProjectID => s as any

// export type ProjectT = {
//     id: ProjectID
//     createdAt: number
//     updatedAt: number
//     //
//     name: string
//     emptyComfyWorkflow: GraphID
//     currentApp?: Maybe<AppPath>
//     currentDraftID?: Maybe<DraftID>
// }

/** a thin wrapper around a single Project somewhere in a .ts file */
export interface ProjectL extends LiveInstance<ProjectT, ProjectL> {}
export class ProjectL {
    rootGraph = new LiveRef<this, ComfyWorkflowL>(this, 'rootGraphID', () => this.db.graphs)
    draft = new LiveRefOpt<this, DraftL>(this, 'currentDraftID', () => this.db.drafts)

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
