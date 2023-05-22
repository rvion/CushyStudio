import type { LiveInstance } from '../db/LiveInstance'
import type { Branded } from '../utils/types'
import type { StepID, StepL } from './Step'

import { bang } from '../utils/bang'

export type ProjectID = Branded<string, 'ProjectID'>
export const asProjectID = (s: string): ProjectID => s as any

export type ProjectT = {
    id: ProjectID
    name: string
    rootStepID: StepID
}

/** a thin wrapper around a single Project somewhere in a .cushy.ts file */
export interface ProjectL extends LiveInstance<ProjectT, ProjectL> {}
export class ProjectL {
    get rootStep(): StepL {
        return bang(this.db.steps.get(this.data.rootStepID))
    }
    get steps(): StepL[] {
        return this.db.steps.values().filter((s) => s.data.projectID === this.id)
    }
    get lastStep(): StepL {
        return this.steps[this.steps.length - 1]
    }
    get schema() {
        return this.db.schema
    }
}
