import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from './ComfyAPI'
import type { ScriptExecution } from './ScriptExecution'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { ComfyNode } from './ComfyNode'
import type { ScriptStep_Iface } from './ScriptStep_Iface'

import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { ComfyGraph } from './ComfyGraph'
import { deepCopyNaive } from './ComfyUtils'
import { nanoid } from 'nanoid'
import { CushyImage } from './CushyImage'

export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
    static promptID = 1

    /** unique step id */
    uid = nanoid()

    /** human-readable step name */
    name = 'prompt-' + ScriptStep_prompt.promptID++

    /** deepcopy of run graph at creation time; ready to be forked */
    _graph: ComfyGraph

    /** short-hand getter to access parent client */
    get client(){ return this.execution.project.client } // prettier-ignore

    constructor(
        //
        public execution: ScriptExecution,
        public prompt: ComfyPromptJSON,
    ) {
        this._graph = new ComfyGraph(
            //
            this.execution.project,
            this.execution,
            deepCopyNaive(prompt),
        )
        makeAutoObservable(this)
    }

    _resolve!: (value: this) => void
    _rejects!: (reason: any) => void
    finished: Promise<this> = new Promise((resolve, rejects) => {
        this._resolve = resolve
        this._rejects = rejects
    })

    /** pointer to the currently executing node */
    currentExecutingNode: ComfyNode<any> | null = null

    /** update the progress value of the currently focused onde */
    onProgress = (msg: WsMsgProgress) => {
        if (this.currentExecutingNode) {
            this.currentExecutingNode.progress = msg.data
        } else {
            console.log('❌ no current executing node', msg)
        }
    }

    notifyEmptyPrompt = () => void toast('No work to do', { type: 'warning' })

    /** update pointer to the currently executing node */
    onExecuting = (msg: WsMsgExecuting) => {
        if (msg.data.node == null) {
            console.log(`executing "null" node => prompt is done`)
            // 2023-03-18 rvion: if I understand correctly, null here means there is no work to do.
            // 2023-03-21 rvion: actually, it probably means the prompt is done
            if (this.currentExecutingNode == null) this.notifyEmptyPrompt()
            else this.currentExecutingNode.status = 'done'
            this.currentExecutingNode = null
            this._finish()
            return
        }
        const node = this._graph.getNodeOrCrash(msg.data.node)
        if (this.currentExecutingNode) this.currentExecutingNode.status = 'done'
        this.currentExecutingNode = node
        node.status = 'executing'
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    /** udpate execution list */
    onExecuted = (msg: WsMsgExecuted) => {
        this.outputs.push(msg)
        const node = this._graph.getNodeOrCrash(msg.data.node)
        const images = msg.data.output.images.map((i) => new CushyImage(this.client, i))
        node.artifacts.push(msg.data)
        // focus on first image
        if (this.client.layout.galleryFocus == null && images.length > 0) this.client.layout.galleryFocus = images[0]
        // link image to node
        node.images.push(...images)
        // link image to execution gallery
        this.execution.gallery.push(...images)
        console.log('🟢', this._graph.uid, node.uid, node.artifacts)
    }

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
