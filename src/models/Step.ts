import type { GraphID, GraphL } from 'src/models/Graph'
import type { WsMsgExecuted } from 'src/types/ComfyWsApi'
import type { FromExtension_Print, FromExtension_Prompt } from 'src/types/MessageFromExtensionToWebview'
import type { LiveInstance } from '../db/LiveInstance'
import type { Branded, Maybe } from '../utils/types'

import { nanoid } from 'nanoid'
import { Status } from '../back/Status'
import { Runtime } from '../back/Runtime'
import { LiveRef } from '../db/LiveRef'
import { asActionID } from './Action'
import { ToolID, ToolL } from './Tool'

export type FormPath = (string | number)[]

export type StepID = Branded<string, 'StepID'>
export const asStepID = (s: string): StepID => s as any

type StepOutput = FromExtension_Print | WsMsgExecuted | FromExtension_Prompt

export type StepT = {
    id: StepID
    /** form that lead to creating this step */
    toolID: ToolID
    /** tool params */
    params: object
    /** parent */
    parentGraphID: GraphID
    /** resulting graph */
    outputGraphID: GraphID
    /** outputs of the evaluated step */
    outputs?: Maybe<StepOutput[]>
    status: Status
}

/** a thin wrapper around a single Step somewhere in a .cushy.ts file */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    start = async () => {
        // this.data.outputGraphID = out.id
        this.runtime = new Runtime(this)
        this.update({ status: Status.Running })
        const res = await this.runtime.run()
        this.update({ status: res })
        if (res === Status.Success) {
            // create new action
            const nextAction = this.db.actions.create({
                id: asActionID(nanoid()),
                inputGraphID: this.outputGraph.id,
                params: {},
            })
        }
    }

    get actionParams() { return this.data.params } // prettier-ignore
    tool = new LiveRef<this, ToolL>(this, 'toolID', 'tools')
    parentGraph = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')
    outputGraph = new LiveRef<this, GraphL>(this, 'outputGraphID', 'graphs')
    runtime: Maybe<Runtime> = null

    append = (output: StepOutput) => this.update({ outputs: [...(this.data.outputs ?? []), output] })
}
