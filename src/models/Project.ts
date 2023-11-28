import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from './Graph'
import type { SchemaL } from './Schema'
import type { AppPath } from 'src/cards/CardPath'
import type { DraftID } from './Draft'

import { LiveRef } from '../db/LiveRef'

export type ProjectID = Branded<string, { ProjectID: true }>
export const asProjectID = (s: string): ProjectID => s as any

export type ProjectT = {
    id: ProjectID
    createdAt: number
    updatedAt: number
    name: string
    rootGraphID: GraphID
    currentApp?: Maybe<AppPath>
    currentDraftID?: Maybe<DraftID>
}

/** a thin wrapper around a single Project somewhere in a .ts file */
export interface ProjectL extends LiveInstance<ProjectT, ProjectL> {}
export class ProjectL {
    rootGraph = new LiveRef<this, GraphL>(this, 'rootGraphID', 'graphs')

    get schema(): SchemaL {
        return this.db.schema
    }
}
