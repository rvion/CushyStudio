import type { Runtime } from 'src/runtime/Runtime'
import type { LiveInstance } from '../db/LiveInstance'
import type { ComfyImageInfo, PromptRelated_WsMsg, WsMsgExecuted, WsMsgExecuting, WsMsgExecutionError } from '../types/ComfyWsApi'
import type { ComfyWorkflowL, ProgressReport } from './ComfyWorkflow'
import type { StepL } from './Step'

import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'pathe'
import { SQLITE_true } from 'src/db/SQLITE_boolean'
import { ComfyPromptT } from 'src/db/TYPES.gen'
import { createHTMLImage_fromURL } from 'src/state/createHTMLImage_fromURL'
import { ComfyNodeID } from 'src/types/ComfyNodeID'
import { asRelativePath } from 'src/utils/fs/pathUtils'
import { toastInfo } from 'src/utils/misc/toasts'
import { Status } from '../back/Status'
import { LiveRef } from '../db/LiveRef'
import { exhaust } from '../utils/misc/ComfyUtils'
import {
    ImageCreationOpts,
    _createMediaImage_fromLocalyAvailableImage,
    createMediaImage_fromPath,
} from './createMediaImage_fromWebFile'

export interface ComfyPromptL extends LiveInstance<ComfyPromptT, ComfyPromptL> {}
export class ComfyPromptL {
    saveFormat: Maybe<ImageSaveFormat> = null

    private _resolve!: (value: this) => void
    private _rejects!: (reason: any) => void
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

    get progressGlobal(): ProgressReport {
        if (this.data.status === 'Success') return { countDone: 1, countTotal: 1, isDone: true, percent: 100 }
        return this.graph.progressGlobal
    }
    get status() {
        return this.data.status ?? 'New'
    }

    // link to step
    stepRef = new LiveRef<this, StepL>(this, 'stepID', () => this.db.steps)
    get step(){ return this.stepRef.item } // prettier-ignore

    // link to grah
    graphRef = new LiveRef<this, ComfyWorkflowL>(this, 'graphID', () => this.db.graphs)
    get graph() { return this.graphRef.item } // prettier-ignore

    onPromptRelatedMessage = (msg: PromptRelated_WsMsg) => {
        // console.debug(`🐰 ${msg.type} ${JSON.stringify(msg.data)}`)
        const graph = this.graph
        if (msg.type === 'execution_start') return
        if (msg.type === 'execution_cached') return graph.onExecutionCached(msg)
        if (msg.type === 'executing') return this.onExecuting(msg)
        if (msg.type === 'progress') return graph.onProgress(msg)
        if (msg.type === 'executed') return this.onExecuted(msg)
        if (msg.type === 'execution_error') return this.onError(msg)
        console.log(`[🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴] `, msg)
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
        this.graph.onExecuting(msg)
        if (msg.data.node == null) {
            // * When `msg.data.node` is null, it means the prompt has nothing
            //   to execute anymore, so it's done.
            // * Before marking it finished, we need to wait pending promises.
            // * Pending promises hold the async post-processing operations
            //   spawned when receiving outputs.
            // console.log(`[🔴🔴🔴🔴] ${this.pendingPromises.length} pending Promises`)
            Promise.all(this.pendingPromises).then(() => {
                this._finish({ status: 'Success' })
            })
            return
        }
    }
    private onError = (msg: WsMsgExecutionError) => {
        console.error(msg)
        this.db.runtimeErrors.create({
            message: 'Prompt failed',
            infos: msg,
            promptID: this.id,
            graphID: this.graph.id,
            stepID: this.step.id,
        })
        this.step.update({ status: Status.Failure })
        this._finish({ status: 'Failure', error: msg })
    }

    /**
     * maybe be set during CushyStudio lifetime;
     * NOT available once cushy has restarted
     */
    get RUNTIME(): Maybe<Runtime> {
        return this.step.runtime
    }

    /** update execution list */
    private onExecuted = (msg: WsMsgExecuted) => {
        const promptNodeID = msg.data.node
        for (const img of msg.data.output.images) {
            this.pendingPromises.push(this.retrieveImage(img, promptNodeID))
        }
    }
    private pendingPromises: Promise<void>[] = []

    // 🦊
    retrieveImage = async (
        //
        comfyImageInfo: ComfyImageInfo,
        promptNodeID: ComfyNodeID,
    ) => {
        // retrieve the node
        const promptNode = this.graph.data.comfyPromptJSON[promptNodeID]
        const promptMeta = this.graph.data.metadata[promptNodeID]
        if (promptNode == null) throw new Error(`❌ invariant violation: promptNode is null`)

        // get image url from ComfyUI
        const serverURL = this.st.mainHost.getServerHostHTTP()
        const imgUrl = serverURL + '/view?' + new URLSearchParams(comfyImageInfo).toString()

        // image metadata
        const imgCreationOpts: ImageCreationOpts = {
            stepID: this.step.id,
            promptID: this.id,
            promptNodeID: promptNodeID,
            comfyUIInfos: {
                comfyImageInfo: comfyImageInfo,
                comfyHostHttpURL: this.st.getServerHostHTTP(),
            },
        }

        // target path on disk
        const sf = this.saveFormat
        let outputRelPath = sf?.prefix
            ? join('outputs', sf.prefix, comfyImageInfo.filename)
            : join('outputs', comfyImageInfo.subfolder, comfyImageInfo.filename)

        if (sf?.format && sf.format !== 'raw') {
            const extension = sf.format.split('/')[1]
            outputRelPath += '.' + extension
        }
        const absPath = this.st.resolve(this.st.rootPath, asRelativePath(outputRelPath))
        const dir = dirname(absPath)
        mkdirSync(dir, { recursive: true })

        // ref
        let imgL

        // RE-ENCODE (COMPRESSED)
        if (sf && sf.format !== 'raw') {
            const canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            const imgHtml = await createHTMLImage_fromURL(imgUrl)
            const width = imgHtml.width
            const height = imgHtml.height
            // resize the canvas accordingly
            canvas.width = width
            canvas.height = height
            // paste html image onto your canvas
            ctx!.drawImage(imgHtml, 0, 0, width, height)
            let dataUrl = canvas.toDataURL(sf.format, sf.quality)
            const prefixToSlice = `data:${sf.format};base64,`
            if (!dataUrl.startsWith(prefixToSlice))
                throw new Error(`❌ dataUrl doesn't start with the expected "${prefixToSlice}"`)
            let base64Data = dataUrl.slice(prefixToSlice.length)
            writeFileSync(outputRelPath, base64Data, 'base64')
            imgL = createMediaImage_fromPath(this.st, outputRelPath, imgCreationOpts)
        }
        // SAVE RAW ------------------------------------------------------------------------------------------
        else {
            const response = await fetch(imgUrl, { headers: { 'Content-Type': 'image/png' }, method: 'GET' })
            const buff = await response.arrayBuffer()
            const uint8arr = new Uint8Array(buff)
            writeFileSync(absPath, uint8arr)
            imgL = _createMediaImage_fromLocalyAvailableImage(this.st, outputRelPath, buff, imgCreationOpts)
        }

        if (this.step.runtime && promptMeta.storeAs) {
            this.step.runtime.Store.getImageStore(promptMeta.storeAs).set(imgL)
        }
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    // private outputs: WsMsgExecuted[] = []
    // images: ImageL[] = []

    /** finish this step */
    private _finish = async (p: Pick<ComfyPromptT, 'status' | 'error'>) => {
        this.update({ ...p, executed: SQLITE_true })
        await Promise.all(this.pendingPromises)
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
