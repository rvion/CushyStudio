import type { LiveInstance } from '../db/LiveInstance'
import type { Branded, Maybe } from '../utils/types'
import type { ActionID, ActionL } from './Action'
import type { ProjectID, ProjectL } from './Project'

import { bang } from '../utils/bang'

export type StepID = Branded<string, 'StepID'>
export const asStepID = (s: string): StepID => s as any

export type StepT = {
    id: StepID
    projectID: ProjectID
    parent?: Maybe<StepID>
    actionID?: Maybe<ActionID>
    /** action input */
    value?: Maybe<any>
    // history: AbsolutePath
    // form?: Maybe<FormDefinition>
}

/** a thin wrapper around a single Step somewhere in a .cushy.ts file */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    get action(): Maybe<ActionL> {
        if (this.data.actionID == null) return null
        return bang(this.db.actions.get(this.data.actionID))
    }
    get project(): ProjectL {
        return bang(this.db.projects.get(this.data.projectID))
    }
    get schema() {
        return this.db.schema
    }
}
