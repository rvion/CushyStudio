import type { PromptL } from './Prompt'
import type { ActionPath } from 'src/back/ActionPath'
import type {
    FromExtension_Print,
    FromExtension_Prompt,
    FromExtension_RuntimeError,
    FromExtension_ShowHtml,
} from 'src/types/MessageFromExtensionToWebview'
import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from '../models/Graph'
import type { WsMsgExecuted, WsMsgExecutionError } from '../types/ComfyWsApi'

import { Runtime } from '../back/Runtime'
import { Status } from '../back/Status'
import { LiveCollection } from '../db/LiveCollection'
import { LiveRef } from '../db/LiveRef'
import { ActionFile } from 'src/back/ActionFile'

export type FormPath = (string | number)[]

export type StepID = Branded<string, 'StepID'>
export const asStepID = (s: string): StepID => s as any

export type StepOutput =
    | FromExtension_Print
    | WsMsgExecuted
    | WsMsgExecutionError
    | FromExtension_Prompt
    | FromExtension_ShowHtml
    | FromExtension_RuntimeError

export type StepT = {
    id: StepID
    createdAt: number
    updatedAt: number
    /** form that lead to creating this step */

    // ACTION ------------------------------
    name: string
    actionPath: ActionPath
    formResult: Maybe<any>
    formSerial: Maybe<any>

    // GRAPHS ------------------------------
    parentGraphID: GraphID
    outputGraphID: GraphID

    // OUTPUTS -----------------------------
    /** outputs of the evaluated step */
    outputs?: Maybe<StepOutput[]>
    status: Status
}

/** a thin wrapper around a single Step / execution */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    start = async () => {
        const action = this.action
        if (action == null) return console.log('🔴 no action found')

        // this.data.outputGraphID = out.id
        this.runtime = new Runtime(this)
        this.update({ status: Status.Running })
        const scriptExecutionStatus = await this.runtime.run()

        if (this.prompts.items.every((p: PromptL) => p.data.executed)) {
            this.update({ status: scriptExecutionStatus })
            if (scriptExecutionStatus === Status.Success) {
                // this.parentGraph.item.createDraft(this).focus()
                // this.outputGraph.item.createDraft()
            }
        }
    }
    prompts = new LiveCollection<PromptL>(this, 'stepID', 'prompts')
    parentGraph = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')
    outputGraph = new LiveRef<this, GraphL>(this, 'outputGraphID', 'graphs')

    get actionFile(): ActionFile | undefined { return this.st.toolbox.filesMap.get(this.data.actionPath) } // prettier-ignore
    get action() { return this.actionFile?.action } // prettier-ignore

    get name() { return this.data.name } // prettier-ignore
    get generatedImages() { return this.prompts.items.map((p) => p.images.items).flat() } // prettier-ignore

    runtime: Maybe<Runtime> = null
    append = (output: StepOutput) => this.update({ outputs: [...(this.data.outputs ?? []), output] })
}
