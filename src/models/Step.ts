import type { StepOutput, StepOutput_Image } from 'src/types/StepOutput'
import type { LiveInstance } from '../db/LiveInstance'
import type { GraphL } from '../models/Graph'
import type { ComfyPromptL } from './ComfyPrompt'

import { LibraryFile } from 'src/cards/CardFile'
import { Runtime } from '../back/Runtime'
import { Status } from '../back/Status'
import { LiveCollection } from '../db/LiveCollection'
import { LiveRef } from '../db/LiveRef'
import { StepT } from 'src/db2/TYPES.gen'
import { MediaImageL } from './MediaImage'
import { MediaTextL } from './MediaText'
import { RuntimeErrorL } from './RuntimeError'

export type FormPath = (string | number)[]

// export type StepID = Branded<string, { StepID: true }>
// export const asStepID = (s: string): StepID => s as any

// export

// export type StepT = {
//     id: StepID
//     createdAt: number
//     updatedAt: number
//     /** form that lead to creating this step */

//     // ACTION ------------------------------
//     name: string
//     appPath: AppPath
//     formResult: Maybe<any>
//     formSerial: Maybe<any>

//     // GRAPHS ------------------------------
//     // parentGraphID: GraphID
//     outputGraphID: GraphID

//     // OUTPUTS -----------------------------
//     /** outputs of the evaluated step */
//     outputs?: Maybe<StepOutput[]>
//     status: Status
// }

/** a thin wrapper around an app execution */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    start = async () => {
        const action = this.appCompiled
        if (action == null) return console.log('🔴 no action found')

        // this.data.outputGraphID = out.id
        this.runtime = new Runtime(this)
        this.update({ status: Status.Running })
        const scriptExecutionStatus = await this.runtime.run()

        if (this.prompts.items.every((p: ComfyPromptL) => p.data.executed)) {
            this.update({ status: scriptExecutionStatus })
        }
    }

    // parentWorkflow = new LiveRef<this, GraphL>(this, 'parentGraphID', 'graphs')

    get appFile(): LibraryFile | undefined { return this.st.library.cardsByPath.get(this.data.appPath) } // prettier-ignore
    get appCompiled() { return this.appFile?.appCompiled } // prettier-ignore
    get name() { return this.data.name } // prettier-ignore
    get generatedImages(): MediaImageL[] { return this.images.items } // prettier-ignore

    outputWorkflow = new LiveRef<this, GraphL>(this, 'outputGraphID', () => this.db.graphs)

    images = new LiveCollection<MediaImageL>(
        this,
        'stepID',
        () => this.db.media_images,
        () => this.data.status !== Status.Running, // OPTIM
    )
    texts = new LiveCollection<MediaTextL>(
        this,
        'stepID',
        () => this.db.media_texts,
        () => this.data.status !== Status.Running, // OPTIM
    )
    prompts = new LiveCollection<ComfyPromptL>(
        this,
        'stepID',
        () => this.db.comfy_prompts,
        () => this.data.status !== Status.Running, // OPTIM
    )
    runtimeErrors = new LiveCollection<RuntimeErrorL>(
        this,
        'stepID',
        () => this.db.media_texts,
        () => this.data.status !== Status.Running, // OPTIM
    )

    get outputs(): (MediaImageL | MediaTextL | ComfyPromptL | RuntimeErrorL)[] {
        return [
            //
            ...this.images.items,
            ...this.texts.items,
            ...this.prompts.items,
            ...this.runtimeErrors.items,
        ].sort((a, b) => a.createdAt - b.createdAt)
    }

    runtime: Maybe<Runtime> = null

    focusedOutput: Maybe<number>
    // get collage() {
    //     const imgs = this.generatedImages
    //     const last = imgs[imgs.length - 1]
    //     if (last == null) return
    //     if (this.focusedOutput == null) return this.generatedImages
    // }

    recordError = (message: string, infos: any) => {
        this.db.runtimeErrors.create({
            stepID: this.id,
            graphID: this.outputWorkflow.id,
            message,
            infos,
        })
    }
    addOutput = (output: StepOutput) => {
        // this.update({
        //     outputs: [...(this.outputs ?? []), output],
        // })
        console.log('🔴🔴🔴🔴🔴🔴🔴🔴 addOutput called')
    }
    // UI expand/collapse state
    get defaultExpanded(): boolean{ return this.data.status === Status.Running } // prettier-ignore
    userDefinedExpanded: Maybe<boolean> = null
    get expanded() { return this.userDefinedExpanded ?? this.defaultExpanded } // prettier-ignore
    set expanded(next:boolean) { this.userDefinedExpanded=next } // prettier-ignore
}
