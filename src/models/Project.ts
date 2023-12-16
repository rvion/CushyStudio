import type { LiveInstance } from '../db/LiveInstance'
import type { ComfyWorkflowL } from './Graph'
import type { ComfySchemaL } from './Schema'

import { LiveRef } from '../db/LiveRef'
import { ProjectT } from 'src/db/TYPES.gen'
import { LiveRefOpt } from 'src/db/LiveRefOpt'
import { DraftL } from './Draft'

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

    get schema(): ComfySchemaL {
        return this.st.schema
    }
}
