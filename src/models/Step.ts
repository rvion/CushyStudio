import type { FromExtension_Print, FromExtension_Prompt, FromExtension_ShowHtml } from 'src/types/MessageFromExtensionToWebview'
import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from '../models/Graph'
import type { WsMsgExecuted } from '../types/ComfyWsApi'
import type { Branded, Maybe } from '../utils/types'

import { Runtime } from '../back/Runtime'
import { Status } from '../back/Status'
import { LiveRef } from '../db/LiveRef'
import { LiveCollection } from '../db/LiveCollection'

import { ToolID, ToolL } from './Tool'
import { PromptL } from './Prompt'

export type FormPath = (string | number)[]

export type StepID = Branded<string, 'StepID'>
export const asStepID = (s: string): StepID => s as any

export type StepOutput = FromExtension_Print | WsMsgExecuted | FromExtension_Prompt | FromExtension_ShowHtml

export type StepT = {
    id: StepID
    /** form that lead to creating this step */
    toolID: ToolID
    /** tool params */
    params: Maybe<any>
    /** parent */
    parentGraphID: GraphID
    /** resulting graph */
    outputGraphID: GraphID
    /** outputs of the evaluated step */
    outputs?: Maybe<StepOutput[]>
    /** step status */
    status: Status
}

/** a thin wrapper around a single Step somewhere in a .cushy.ts file */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    start = async () => {
        // this.data.outputGraphID = out.id
        this.runtime = new Runtime(this)
        this.update({ status: Status.Running })
        const scriptExecutionStatus = await this.runtime.run()

        if (this.prompts.items.every((p: PromptL) => p.data.executed)) {
            this.update({ status: scriptExecutionStatus })
            if (scriptExecutionStatus === Status.Success) {
                // this.parentGraph.item.createDraft(this).focus()
                this.outputGraph.item.createStep().focus()
            }
        }
    }

    prompts = new LiveCollection<PromptL>(this, 'stepID', 'prompts')
    get generatedImages() { return this.prompts.items.map((p) => p.images.items).flat() } // prettier-ignore

    focus() {
        this.parentGraph.item.update({ focusedStepID: this.id })
    }

    get actionParams() { return this.data.params } // prettier-ignore
    tool = new LiveRef<this, ToolL>(this, 'toolID', 'tools')
    parentGraph = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')
    outputGraph = new LiveRef<this, GraphL>(this, 'outputGraphID', 'graphs')
    runtime: Maybe<Runtime> = null
    append = (output: StepOutput) => this.update({ outputs: [...(this.data.outputs ?? []), output] })

    // form part --------------------------------------------------------
    // onUpdate = (prev: Maybe<ActionT>, next: ActionT) => {
    //     if (prev == null) return
    //     if (prev.toolID !== next.toolID) this.reset()
    // }

    // tool = new LiveRefOpt<this, ToolL>(this, 'toolID', 'tools')
    inputGraph = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')

    reset = () => (this.data.params = {})

    getAtPath(path: FormPath): any {
        if (this.data.params == null) this.data.params = {}
        let current = this.data.params
        for (const key of path) {
            if (!current.hasOwnProperty(key)) {
                return undefined
            }
            current = current[key]
        }
        return current
    }
    setAtPath = (path: FormPath, value: any) => {
        if (this.data.params == null) this.data.params = {}
        // console.log(path, value, toJS(this.data.value))
        let current = this.data.params
        for (let i = 0; i < path.length - 1; i++) {
            const key = path[i]
            if (!current[key]) current[key] = typeof path[i + 1] === 'number' ? [] : {}
            current = current[key]
        }
        current[path[path.length - 1]] = value
        // console.log(this.Form)
    }
}
