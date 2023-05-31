import type { Branded, Maybe } from '../utils/types'
import type {
    PromptRelated_WsMsg,
    WsMsgExecuted,
    WsMsgExecuting,
    WsMsgExecutionCached,
    WsMsgExecutionStart,
    WsMsgProgress,
} from '../types/ComfyWsApi'
import type { LiveInstance } from '../db/LiveInstance'
import type { StepID, StepL } from '../models/Step'
import type { GraphID, GraphL } from './Graph'

import { LiveRef } from '../db/LiveRef'
import { ImageL } from './Image'
import { nanoid } from 'nanoid'
import { exhaust } from '../utils/ComfyUtils'

export type PromptID = Branded<string, 'PromptID'>
export const asPromptID = (s: string): PromptID => s as any

export type PromptT = {
    id: PromptID
    stepID: StepID
    graphID: GraphID
    executed: boolean
}

export interface PromptL extends LiveInstance<PromptT, PromptL> {}
export class PromptL {
    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    notifyEmptyPrompt = () => console.log('🔶 No work to do')

    onUpdate = (prev: Maybe<PromptT>, next: PromptT) => {
        // if (!prev?.executed && next.executed) this._finish()
        // if (next)
    }

    onCreate = () => {
        //
    }

    step = new LiveRef<StepL>(this, 'stepID', 'steps')
    graph = new LiveRef<GraphL>(this, 'graphID', 'graphs')
    get project() { return this.step.item.project } // prettier-ignore

    onPromptRelatedMessage = (msg: PromptRelated_WsMsg) => {
        console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
        const graph = this.graph.item

        if (msg.type === 'execution_start') return
        if (msg.type === 'execution_cached') return
        if (msg.type === 'executing') return this.onExecuting(msg)
        if (msg.type === 'progress') return graph.onProgress(msg)
        if (msg.type === 'executed') return this.onExecuted(msg)

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
    onExecuting = (msg: WsMsgExecuting) => {
        this.graph.item.onExecuting(msg)
        if (msg.data.node == null) {
            this._finish()
            return
        }
    }

    /** udpate execution list */
    onExecuted = (msg: WsMsgExecuted) => {
        // const image = this.db.images.create({
        //     id: nanoid(),
        // })
        // const images: ImageL[] = []
        for (const img of msg.data.output.images) {
            // const comfyFilename = img.filename
            const comfyRelativePath = `./outputs/${img.filename}`
            const comfyURL = this.db.config.serverHostHTTP + '/view?' + new URLSearchParams(img).toString()
            const images = this.db.images.create({
                id: nanoid(),
                promptID: this.id,
                // comfyURL,
                imageInfos: img,
                // comfyRelativePath,
                // folder: img.subfolder,
                // localAbsolutePath: img.localAbsolutePath,
            })
            this.images.push(images)
        }
        this.outputs.push(msg) // accumulate in self
        // const node = this._graph.getNodeOrCrash(msg.data.node)
        // node.artifacts.push(msg.data) // accumulate in node
        // this.run.generatedImages.push(...images)
        // console.log(`🟢 graph(${this._graph.uid}) => node(${node.uid}) => (${node.artifacts.length} images)`)
        // return images
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    private outputs: WsMsgExecuted[] = []
    images: ImageL[] = []

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
