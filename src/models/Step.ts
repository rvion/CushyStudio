import type { PromptL } from './Prompt'
import type { CardPath } from 'src/cards/CardPath'
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
import { CardFile } from 'src/cards/CardFile'

export type FormPath = (string | number)[]

export type StepID = Branded<string, { StepID: true }>
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
    actionPath: CardPath
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
        }
    }

    prompts = new LiveCollection<PromptL>(this, 'stepID', 'prompts')
    parentGraph = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')
    outputGraph = new LiveRef<this, GraphL>(this, 'outputGraphID', 'graphs')

    get actionFile(): CardFile | undefined { return this.st.library.cardsByPath.get(this.data.actionPath) } // prettier-ignore
    get action() { return this.actionFile?.action } // prettier-ignore

    get name() { return this.data.name } // prettier-ignore
    get generatedImages() { return this.prompts.items.map((p) => p.images.items).flat() } // prettier-ignore

    runtime: Maybe<Runtime> = null
    append = (output: StepOutput) => this.update({ outputs: [...(this.data.outputs ?? []), output] })

    // UI expand/collapse state
    get defaultExpanded(): boolean{ return this.data.status === Status.Running } // prettier-ignore
    userDefinedExpanded: Maybe<boolean> = null
    get expanded() { return this.userDefinedExpanded ?? this.defaultExpanded } // prettier-ignore
    set expanded(next:boolean) { this.userDefinedExpanded=next } // prettier-ignore
}
