import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from './ComfyAPI'
import type { ScriptExecution } from './ScriptExecution'
import type { ComfyPromptJSON } from './ComfyPrompt'
import type { ComfyNode } from './ComfyNode'
import type { ScriptStep_Iface } from './ScriptStep_Iface'

import { makeAutoObservable } from 'mobx'
import { toast } from 'react-toastify'

export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
    name = 'prompt'
    constructor(
        //
        public execution: ScriptExecution,
        public prompt: ComfyPromptJSON,
    ) {
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
        }
    }

    notifyEmptyPrompt = () => void toast('No work to do', { type: 'warning' })

    /** update pointer to the currently executing node */
    onExecuting = (msg: WsMsgExecuting) => {
        if (msg.data.node == null) {
            console.log('🔴 null node')
            // 2023-03-18 rvion: if I understand correctly,
            // null here means there is no work to do.
            if (this.currentExecutingNode == null) this.notifyEmptyPrompt()
            this.currentExecutingNode = null
            this._finish()
            return
        }
        const graph = this.execution.graph
        const node = graph.getNodeOrCrash(msg.data.node)
        this.currentExecutingNode = node
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    outputs: WsMsgExecuted[] = []

    /** udpate execution list */
    onExecuted = (msg: WsMsgExecuted) => {
        this.outputs.push(msg)
        this.currentExecutingNode = null
        const graph = this.execution.graph
        const node = graph.getNodeOrCrash(msg.data.node)
        // const node = this.getNodeOrCrash(msg.data.node)
        // this.currentStep++
        node.artifacts.push(msg.data.output)
        console.log(node.artifacts)
        this._finish()
    }

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
