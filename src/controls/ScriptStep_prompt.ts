import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from '../core/ComfyAPI'
import type { ComfyPromptJSON } from '../core//ComfyPrompt'
import type { ScriptStep_Iface } from './ScriptStep_Iface'
import type { ComfyNode } from '../core//CSNode'
import type { Run } from '../core//Run'

import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'
import { Graph } from '../core//Graph'
import { deepCopyNaive } from '../core//ComfyUtils'
import { nanoid } from 'nanoid'
import { PromptOutputImage } from '../core//PromptOutputImage'

export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
    private static promptID = 1

    /** unique step id */
    uid = nanoid()

    /** human-readable step name */
    name = 'prompt-' + ScriptStep_prompt.promptID++

    /** deepcopy of run graph at creation time; ready to be forked */
    _graph: Graph

    /** short-hand getter to access parent client */
    get client(){ return this.run.project.workspace } // prettier-ignore

    constructor(
        //
        public run: Run,
        public prompt: ComfyPromptJSON,
    ) {
        this._graph = new Graph(
            //
            this.run.project,
            this.run,
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
            // console.log(`executing "null" node => prompt is done`)
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
    private outputs: WsMsgExecuted[] = []
    images: PromptOutputImage[] = []

    /** udpate execution list */
    onExecuted = (msg: WsMsgExecuted) => {
        const node = this._graph.getNodeOrCrash(msg.data.node)
        const images = msg.data.output.images.map((i) => new PromptOutputImage(this, i))

        // console.log(`🟢 `, images.length, `CushyImages`)
        // accumulate in self
        this.outputs.push(msg)
        this.images.push(...images)
        // console.log(`🟢 `, this.uid, 'has', this.images.length, `CushyImages`)

        // accumulate in node
        node.artifacts.push(msg.data)
        node.images.push(...images)

        // accumulate in run
        this.run.gallery.push(...images)

        if (
            // this.client.layout.galleryFocus == null &&
            images.length > 0
        ) {
            this.client.layout.galleryFocus = images[0]
        }
        console.log(`🟢 graph(${this._graph.uid}) => node(${node.uid}) => (${node.artifacts.length} images)`)
    }

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
