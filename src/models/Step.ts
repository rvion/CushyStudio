import type { AppPath } from 'src/cards/CardPath'
import type { StepOutput, StepOutput_Image } from 'src/types/MessageFromExtensionToWebview'
import type { LiveInstance } from '../db/LiveInstance'
import type { GraphID, GraphL } from '../models/Graph'
import type { PromptL } from './Prompt'

import { LibraryFile } from 'src/cards/CardFile'
import { Runtime } from '../back/Runtime'
import { Status } from '../back/Status'
import { LiveCollection } from '../db/LiveCollection'
import { LiveRef } from '../db/LiveRef'

export type FormPath = (string | number)[]

export type StepID = Branded<string, { StepID: true }>
export const asStepID = (s: string): StepID => s as any

export type StepT = {
    id: StepID
    createdAt: number
    updatedAt: number
    /** form that lead to creating this step */

    // ACTION ------------------------------
    name: string
    actionPath: AppPath
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

/** a thin wrapper around an app execution */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    start = async () => {
        const action = this.appCompiled
        if (action == null) return console.log('🔴 no action found')

        // this.data.outputGraphID = out.id
        this.runtime = new Runtime(this)
        this.update({ status: Status.Running })
        this.addOutput({ type: 'comfy-workflow', graphID: this.outputWorkflow.id })
        const scriptExecutionStatus = await this.runtime.run()

        if (this.prompts.items.every((p: PromptL) => p.data.executed)) {
            this.update({ status: scriptExecutionStatus })
        }
    }

    prompts = new LiveCollection<PromptL>(this, 'stepID', 'prompts')
    parentWorkflow = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')
    outputWorkflow = new LiveRef<this, GraphL>(this, 'outputGraphID', 'graphs')

    get appFile(): LibraryFile | undefined { return this.st.library.cardsByPath.get(this.data.actionPath) } // prettier-ignore
    get appCompiled() { return this.appFile?.appCompiled } // prettier-ignore
    get name() { return this.data.name } // prettier-ignore
    get generatedImages(): StepOutput_Image[] {
        if (this.data.outputs == null) return []
        return this.data.outputs.filter((t) => t.type === 'image') as StepOutput_Image[]
    }

    runtime: Maybe<Runtime> = null

    focusedOutput: Maybe<number>
    // get collage() {
    //     const imgs = this.generatedImages
    //     const last = imgs[imgs.length - 1]
    //     if (last == null) return
    //     if (this.focusedOutput == null) return this.generatedImages
    // }

    addOutput = (output: StepOutput) =>
        this.update({
            outputs: [...(this.data.outputs ?? []), output],
        })

    // UI expand/collapse state
    get defaultExpanded(): boolean{ return this.data.status === Status.Running } // prettier-ignore
    userDefinedExpanded: Maybe<boolean> = null
    get expanded() { return this.userDefinedExpanded ?? this.defaultExpanded } // prettier-ignore
    set expanded(next:boolean) { this.userDefinedExpanded=next } // prettier-ignore
}
