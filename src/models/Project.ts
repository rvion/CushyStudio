import type { LiveInstance } from '../db/LiveInstance'
import type { Branded } from '../utils/types'
import type { GraphID, GraphL } from './Graph'

import { LiveRef } from '../db/LiveRef'

export type ProjectID = Branded<string, 'ProjectID'>
export const asProjectID = (s: string): ProjectID => s as any

export type ProjectT = {
    id: ProjectID
    name: string
    rootGraphID: GraphID
    // rootStepID: StepID
}

/** a thin wrapper around a single Project somewhere in a .cushy.ts file */
export interface ProjectL extends LiveInstance<ProjectT, ProjectL> {}
export class ProjectL {
    rootGraph = new LiveRef<this, GraphL>(this, 'rootGraphID', 'graphs')
    get schema() {
        return this.db.schema
    }
}
