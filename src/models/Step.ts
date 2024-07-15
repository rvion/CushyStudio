import type { DraftExecutionContext } from '../cards/App'
import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { StepOutput } from '../types/StepOutput'
import type { ComfyPromptL } from './ComfyPrompt'
import type { ComfyWorkflowL } from './ComfyWorkflow'

import { Status } from '../back/Status'
import { Field_group } from '../csuite/fields/group/FieldGroup'
import { SQLITE_false, SQLITE_true } from '../csuite/types/SQLITE_boolean'
import { ManualPromise } from '../csuite/utils/ManualPromise'
import { LiveRef } from '../db/LiveRef'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { Runtime, RuntimeExecutionResult } from '../runtime/Runtime'
import { CushyAppL } from './CushyApp'
import { DraftL } from './Draft'
import { Executable } from './Executable'
import { getGlobalRuntimeCtx } from './getGlobalRuntimeCtx'
import { Media3dDisplacementL } from './Media3dDisplacement'
import { MediaCustomL } from './MediaCustom'
import { MediaImageL } from './MediaImage'
import { MediaTextL } from './MediaText'
import { MediaVideoL } from './MediaVideo'

export type FormPath = (string | number)[]
/** a thin wrapper around an app execution */
export interface StepL extends LiveInstance<TABLES['step']> {}
export class StepL {
    draftL = new LiveRefOpt<StepL, DraftL>(this, 'draftID', 'draft')
    get draft(): Maybe<DraftL> {
        return this.draftL.item
    }

    finished = new ManualPromise<RuntimeExecutionResult>()
    start = async (p: {
        /**
         * reference to the draft live form instance
         * this will be made available to the runtime so the runtime can access
         * the live form
         * */
        formInstance: Field_group<any> // Field_group<any>
        context: DraftExecutionContext
    }) => {
        // ensure we have an executable
        const executable = this.executable
        if (executable == null) return console.log('🔴 no executable found for this app')

        // instanciate the runtime
        const runtime = new Runtime(this)
        this.runtime = runtime

        // mark as running
        this.update({ status: Status.Running })

        // allocate a new async store so any async prefab can still retrieve its intance globally
        // (avoid drilling props)
        // | 🔶 TODO: ensure memory is freed after execution
        // | 🔶 doc here: https://nodejs.org/api/async_context.html#asynchronous-context-tracking
        const asyncRuntimeStorage = getGlobalRuntimeCtx()
        const scriptExecutionStatus: RuntimeExecutionResult = await asyncRuntimeStorage.run(
            { runtime, stepID: this.id },
            async () => await runtime._EXECUTE(p),
        )

        // const scriptExecutionStatus: RuntimeExecutionResult = await this.runtime._EXECUTE(p)

        if (scriptExecutionStatus.type === 'error') {
            this.update({ status: Status.Failure })
        } else {
            if (this.comfy_prompts.every((p: ComfyPromptL) => p.data.executed)) {
                this.update({ status: Status.Success })
            }
        }
        this.finished.resolve(scriptExecutionStatus)
    }

    get finalStatus(): Status {
        if (this.status !== Status.Success) return this.status
        return this.comfy_prompts.every((p: ComfyPromptL) => p.data.executed) //
            ? Status.Success
            : Status.Running
    }

    appL = new LiveRef<this, CushyAppL>(this, 'appID', 'cushy_app')

    get app(): CushyAppL {
        return this.appL.item
    }

    get status(): Status {
        return this.data.status as Status
    }

    get executable(): Maybe<Executable> {
        return this.app.executable_orExtract
    }

    get name(): string {
        return this.data.name ?? this.app.name
    }

    get lastImageOutput(): Maybe<MediaImageL> {
        return this.images[this.images.length - 1]
    }

    get generatedImages(): MediaImageL[] {
        return this.images
    }

    outputWorkflow = new LiveRef<this, ComfyWorkflowL>(this, 'outputGraphID', 'comfy_workflow')

    get texts()           { return this.db.media_text           .select(q => q.where('stepID', '=', this.id), ['media_text.stepID']           )} // prettier-ignore
    get images()          { return this.db.media_image          .select(q => q.where('stepID', '=', this.id), ['media_image.stepID']          )} // prettier-ignore
    get videos()          { return this.db.media_video          .select(q => q.where('stepID', '=', this.id), ['media_video.stepID']          )} // prettier-ignore
    get displacements()   { return this.db.media_3d_displacement.select(q => q.where('stepID', '=', this.id), ['media_3d_displacement.stepID'])} // prettier-ignore
    get customOutputs()   { return this.db.media_custom         .select(q => q.where('stepID', '=', this.id), ['media_custom.stepID']         )} // prettier-ignore
    get splats()          { return this.db.media_splat          .select(q => q.where('stepID', '=', this.id), ['media_splat.stepID']          )} // prettier-ignore
    get comfy_workflows() { return this.db.comfy_workflow       .select(q => q.where('stepID', '=', this.id), ['comfy_workflow.stepID']       )} // prettier-ignore
    get comfy_prompts()   { return this.db.comfy_prompt         .select(q => q.where('stepID', '=', this.id), ['comfy_prompt.stepID']         )} // prettier-ignore
    get runtimeErrors()   { return this.db.runtime_error        .select(q => q.where('stepID', '=', this.id), ['runtime_error.stepID']        )} // prettier-ignore

    // private _CACHE_INVARIANT = null // () => this.data.status !== Status.Running
    // = new LiveCollection<TABLES['media_text']>           ({table: () => this.db.media_text,           where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['media_image']>          ({table: () => this.db.media_image,          where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['media_video']>          ({table: () => this.db.media_video,          where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['media_3d_displacement']>({table: () => this.db.media_3d_displacement, where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['media_splat']>          ({table: () => this.db.media_splat,          where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['comfy_workflow']>       ({table: () => this.db.comfy_workflow,        where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['comfy_prompt']>         ({table: () => this.db.comfy_prompt,         where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore
    // = new LiveCollection<TABLES['runtime_error']>        ({table: () => this.db.runtime_error,         where: () => ({stepID:this.id}), cache: this._CACHE_INVARIANT}) // prettier-ignore

    get currentlyExecutingOutput(): Maybe<StepOutput> {
        return this.comfy_prompts.find((p: ComfyPromptL) => !p.data.executed)
    }
    get lastMediaOutput(): Maybe<StepOutput> {
        const outputs = this.outputs
        const last = outputs[outputs.length - 1]
        if (
            last instanceof MediaImageL || //
            last instanceof MediaVideoL ||
            last instanceof Media3dDisplacementL ||
            last instanceof MediaCustomL ||
            last instanceof MediaTextL ||
            last instanceof MediaImageL
        )
            return last

        return null
    }
    get lastOutput(): Maybe<StepOutput> {
        const outputs = this.outputs
        return outputs[outputs.length - 1]
    }
    get outputs(): StepOutput[] {
        return [
            //
            ...this.texts,
            ...this.images,
            ...this.videos,
            ...this.splats,
            ...this.displacements,
            ...this.customOutputs,
            ...this.comfy_workflows,
            ...this.comfy_prompts,
            ...this.runtimeErrors,
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
        this.db.runtime_error.create({
            stepID: this.id,
            graphID: this.outputWorkflow.id,
            message,
            infos,
        })
    }

    // UI expand/collapse state
    get defaultExpanded(): boolean {
        return this.data.isExpanded === SQLITE_true ? true : false
    }
    userDefinedExpanded: Maybe<boolean> = null
    get expanded() {
        return this.userDefinedExpanded ?? this.defaultExpanded
    }
    set expanded(next: boolean) {
        this.update({ isExpanded: next ? SQLITE_true : SQLITE_false })
    }
}
