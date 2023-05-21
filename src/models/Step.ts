import type { LiveInstance } from '../db/LiveInstance'
import type { Branded, Maybe } from '../utils/types'
import type { ActionID, ActionL } from './Action'
import type { ProjectID, ProjectL } from './Project'

import { toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { bang } from '../utils/bang'

export type FormPath = (string | number)[]

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
    onUpdate = (prev: Maybe<StepT>, next: StepT) => {
        if (prev == null) return
        console.log({ prev, next })
        if (prev.actionID !== next.actionID) this.reset()
    }

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

    submit = () => {
        if (this.action == null) return
        this.update({ value: this.draft })
        this.db.steps.create({
            id: asStepID(nanoid()),
            projectID: this.data.projectID,
            actionID: this.action!.id,
            parent: this.id,
        })
    }

    /** this value is the root response object
     * the form will progressively fill */
    draft: any = {}

    reset = () => (this.draft = {})

    getAtPath(path: FormPath): any {
        let current = this.draft
        for (const key of path) {
            if (!current.hasOwnProperty(key)) {
                return undefined
            }
            current = current[key]
        }
        return current
    }

    setAtPath = (path: FormPath, value: any) => {
        console.log(path, value, toJS(this.draft))
        let current = this.draft
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = typeof path[i + 1] === 'number' ? [] : {}
            current = current[key]
        }
        current[path[path.length - 1]] = value
        console.log(this.draft)
    }
}
