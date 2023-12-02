import type { StepOutput } from 'src/types/StepOutput'
import type { LiveInstance } from '../db/LiveInstance'
import type { ComfyWorkflowL } from '../models/Graph'
import type { ComfyPromptL } from './ComfyPrompt'

import { LibraryFile } from 'src/cards/CardFile'
import { StepT } from 'src/db/TYPES.gen'
import { Runtime } from '../back/Runtime'
import { Status } from '../back/Status'
import { LiveCollection } from '../db/LiveCollection'
import { LiveRef } from '../db/LiveRef'
import { Media3dDisplacementL } from './Media3dDisplacement'
import { MediaImageL } from './MediaImage'
import { MediaTextL } from './MediaText'
import { MediaVideoL } from './MediaVideo'
import { RuntimeErrorL } from './RuntimeError'
import { MediaSplatL } from './MediaSplat'
import { Widget_group } from 'src/controls/Widget'

export type FormPath = (string | number)[]
/** a thin wrapper around an app execution */
export interface StepL extends LiveInstance<StepT, StepL> {}
export class StepL {
    start = async (p: {
        /**
         * reference to the draft live form instance
         * this will be made available to the runtime so the runtime can access
         * the live form
         * */
        formInstance: Widget_group<any>
    }) => {
        const action = this.appCompiled
        if (action == null) return console.log('🔴 no action found')

        // this.data.outputGraphID = out.id
        this.runtime = new Runtime(this)
        this.update({ status: Status.Running })
        const scriptExecutionStatus = await this.runtime.run(p)

        if (this.comfy_prompts.items.every((p: ComfyPromptL) => p.data.executed)) {
            this.update({ status: scriptExecutionStatus })
        }
    }

    get finalStatus(): Status {
        if (this.status !== Status.Success) return this.status
        return this.comfy_prompts.items.every((p: ComfyPromptL) => p.data.executed) //
            ? Status.Success
            : Status.Running
    }

    get status():Status { return this.data.status as Status } // prettier-ignore
    get appFile(): LibraryFile | undefined { return this.st.library.cardsByPath.get(this.data.appPath) } // prettier-ignore
    get appCompiled() { return this.appFile?.appCompiled } // prettier-ignore
    get name() { return this.data.name } // prettier-ignore
    get generatedImages(): MediaImageL[] { return this.images.items } // prettier-ignore

    outputWorkflow = new LiveRef<this, ComfyWorkflowL>(this, 'outputGraphID', () => this.db.graphs)

    private _CACHE_INVARIANT = () => this.data.status !== Status.Running

    texts = new LiveCollection<MediaTextL>(this, 'stepID', () => this.db.media_texts, this._CACHE_INVARIANT)
    images = new LiveCollection<MediaImageL>(this, 'stepID', () => this.db.media_images, this._CACHE_INVARIANT)
    videos = new LiveCollection<MediaVideoL>(this, 'stepID', () => this.db.media_videos, this._CACHE_INVARIANT)
    displacements = new LiveCollection<Media3dDisplacementL>(this, 'stepID', () => this.db.media_3d_displacement, this._CACHE_INVARIANT) // prettier-ignore
    splats = new LiveCollection<MediaSplatL>(this, 'stepID', () => this.db.media_splats, this._CACHE_INVARIANT) // prettier-ignore

    comfy_workflows = new LiveCollection<ComfyWorkflowL>(this, 'stepID', () => this.db.graphs, this._CACHE_INVARIANT)
    comfy_prompts = new LiveCollection<ComfyPromptL>(this, 'stepID', () => this.db.comfy_prompts, this._CACHE_INVARIANT)
    runtimeErrors = new LiveCollection<RuntimeErrorL>(this, 'stepID', () => this.db.runtimeErrors, this._CACHE_INVARIANT)

    get currentlyExecutingOutput(): Maybe<StepOutput> {
        return this.comfy_prompts.items.find((p: ComfyPromptL) => !p.data.executed)
    }
    get lastMediaOutput(): Maybe<StepOutput> {
        const outputs = this.outputs
        const last = outputs[outputs.length - 1]
        if (
            last instanceof MediaImageL || //
            last instanceof MediaVideoL ||
            last instanceof Media3dDisplacementL
        )
            return last

        return this.lastOutput
    }
    get lastOutput(): Maybe<StepOutput> {
        const outputs = this.outputs
        return outputs[outputs.length - 1]
    }
    get outputs(): StepOutput[] {
        return [
            //
            ...this.texts.items,
            ...this.images.items,
            ...this.videos.items,
            ...this.splats.items,
            ...this.displacements.items,
            ...this.comfy_workflows.items,
            ...this.comfy_prompts.items,
            ...this.runtimeErrors.items,
        ].sort((a, b) => a.createdAt - b.createdAt)
    }

    runtime: Maybe<Runtime> = null

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
