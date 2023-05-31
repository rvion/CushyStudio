import type { GraphID, GraphL } from 'src/models/Graph'
import type { LiveInstance } from '../db/LiveInstance'
import type { Branded, Maybe } from '../utils/types'
import type { ActionID, ActionL } from './Action'
import type { ProjectID, ProjectL } from './Project'
import type { WsMsgExecuted } from 'src/types/ComfyWsApi'
import type { FromExtension_Print, FromExtension_Prompt } from 'src/types/MessageFromExtensionToWebview'

import { toJS } from 'mobx'
import { nanoid } from 'nanoid'
import { LiveRef } from '../db/LiveRef'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { Runtime } from '../back/Runtime'

export type FormPath = (string | number)[]

export type StepID = Branded<string, 'StepID'>
export const asStepID = (s: string): StepID => s as any

type StepOutput = FromExtension_Print | WsMsgExecuted | FromExtension_Prompt

export type StepT = {
    id: StepID
    /** project this step belongs to */
    projectID: ProjectID
    /** parent step, only null for the root step */
    parent?: Maybe<StepID>
    /** action the step should run on evaluation */
    actionID?: Maybe<ActionID>
    /** action input value */
    value?: Maybe<any>
    /** starting graph */
    graphID: GraphID
    /** outputs of the evaluated step */
    outputs?: Maybe<StepOutput[]>
}

/** a thin wrapper around a single Step somewhere in a .cushy.ts file */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    onUpdate = (prev: Maybe<StepT>, next: StepT) => {
        if (prev == null) return
        if (prev.actionID !== next.actionID) this.reset()
    }

    action = new LiveRefOpt<ActionL>(this, 'actionID', 'actions')
    graph = new LiveRef<GraphL>(this, 'graphID', 'graphs')
    project = new LiveRef<ProjectL>(this, 'projectID', 'projects')

    /** proxy to this.db.schema */
    get schema() {
        return this.db.schema
    }

    runtime: Maybe<Runtime> = null
    submit = async () => {
        if (this.action == null) return console.log('❌ no action yet')
        // if (this.data.value != null) return console.log('❌ already submitted')

        this.update({ value: this.draft })
        this.runtime = new Runtime(this)
        await this.runtime.run()
        // const finalGraph = this.runtime.graph
        // this.st.run
        this.db.steps.create({
            id: asStepID(nanoid()),
            graphID: this.runtime.graph.id,
            projectID: this.data.projectID,
            actionID: this.action.id,
            parent: this.id,
        })
    }

    append = (output: StepOutput) => this.update({ outputs: [...(this.data.outputs ?? []), output] })

    /** this value is the root response object
     * the form will progressively fill */
    draft: Maybe<any> = null

    onCreate = (data: StepT) => {
        this.draft = data.value ?? {}
    }

    reset = () => (this.draft = {})

    getAtPath(path: FormPath): any {
        if (this.draft == null) this.draft = {}
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
        if (this.draft == null) this.draft = {}
        // console.log(path, value, toJS(this.draft))
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
