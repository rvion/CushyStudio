import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'
import type { PromptRelated_WsMsg, WsMsgExecuted, WsMsgExecuting, WsMsgExecutionError } from '../types/ComfyWsApi'
import type { ComfyWorkflowL } from './Graph'

import { nanoid } from 'nanoid'
import { ComfyPromptT } from 'src/db2/TYPES.gen'
import { Status } from '../back/Status'
import { LiveRef } from '../db/LiveRef'
import { exhaust } from '../utils/misc/ComfyUtils'

// export type ComfyPromptID = Branded<string, { PromptID: true }>
// export const asComfyPromptID = (s: string): ComfyPromptID => s as any

// export type ComfyPromptT = {
//     id: PromptID
//     createdAt: number
//     updatedAt: number
//     stepID: StepID
//     graphID: GraphID
//     executed: boolean
//     error?: Maybe<WsMsgExecutionError>
// }

export interface ComfyPromptL extends LiveInstance<ComfyPromptT, ComfyPromptL> {}
export class ComfyPromptL {
    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    notifyEmptyPrompt = () => console.log('🔶 No work to do')

    onCreate = (data: ComfyPromptT) => {
        const pending = this.st._pendingMsgs.get(data.id)
        if (pending == null) return
        this.log(`🟢 onCreate: ${pending.length} pending messages`)
        for (const msg of pending) this.onPromptRelatedMessage(msg)
    }

    // onUpdate = (prev: Maybe<PromptT>, next: PromptT) => {
    //     // if (!prev?.executed && next.executed) this._finish()
    //     // if (next)
    // }

    step = new LiveRef<this, StepL>(this, 'stepID', () => this.db.steps)
    graph = new LiveRef<this, ComfyWorkflowL>(this, 'graphID', () => this.db.graphs)
    // get project() { return this.step.item.project } // prettier-ignore

    onPromptRelatedMessage = (msg: PromptRelated_WsMsg) => {
        // console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
        const graph = this.graph.item

        if (msg.type === 'execution_start') return
        if (msg.type === 'execution_cached') return graph.onExecutionCached(msg)
        if (msg.type === 'executing') return this.onExecuting(msg)
        if (msg.type === 'progress') return graph.onProgress(msg)
        if (msg.type === 'executed') return this.onExecuted(msg)
        if (msg.type === 'execution_error') return this.onError(msg)

        exhaust(msg)
        // await Promise.all(images.map(i => i.savedPromise))
        // const uris = FrontWebview.with((curr) => {
        //     return images.map((img: GeneratedImage) => {
        //         return curr.webview.asWebviewUri(img.uri).toString()
        //     })
        // })
        // console.log('📸', 'uris', uris)
        // this.sendMessage({ type: 'images', uris })
        // return images
        // }
    }

    /** update pointer to the currently executing node */
    private onExecuting = (msg: WsMsgExecuting) => {
        this.graph.item.onExecuting(msg)
        if (msg.data.node == null) {
            if (this.step.item.data.status !== Status.Failure) {
                console.log('>> MARK SUCCESS')
                this.step.item.update({ status: Status.Success })
            }
            this._finish()
            return
        }
    }
    private onError = (msg: WsMsgExecutionError) => {
        console.log('>> MARK ERROR')
        this.step.item.update({ status: Status.Failure })
        this.update({ error: msg })
        this._finish()
    }

    /** udpate execution list */
    private onExecuted = (msg: WsMsgExecuted) => {
        for (const img of msg.data.output.images) {
            // const image =
            this.db.media_images.create({
                id: nanoid(),
                stepID: this.step.id,
                promptID: this.id,
                infos: {
                    type: 'image-generated-by-comfy',
                    comfyImageInfo: img,
                    comfyHostHttpURL: this.st.getServerHostHTTP(),
                },
            })
            // this.images.push(images)
            // this.step.item.addOutput({ type: 'image', imgID: image.id })
        }
        // this.outputs.push(msg) // accumulate in self
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    // private outputs: WsMsgExecuted[] = []
    // images: ImageL[] = []

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
