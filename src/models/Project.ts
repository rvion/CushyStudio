import type { LiveInstance } from '../db/LiveInstance'
import type { GraphL } from './Graph'
import type { SchemaL } from './Schema'

import { LiveRef } from '../db/LiveRef'
import { ProjectT } from 'src/db2/TYPES.gen'

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
    rootGraph = new LiveRef<this, GraphL>(this, 'rootGraphID', () => this.db.graphs)

    get schema(): SchemaL {
        return this.db.schema
    }
}
