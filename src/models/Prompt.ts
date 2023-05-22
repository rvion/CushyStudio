import type { Branded } from 'src/utils/types'
import type { WsMsgExecuted, WsMsgExecuting } from '../types/ComfyWsApi'
import type { LiveInstance } from 'src/db/LiveInstance'
import type { StepID } from 'src/models/Step'
import type { GraphID } from './Graph'

import { GeneratedImage } from '../back/GeneratedImage'

export type PromptID = Branded<string, 'PromptID'>
export const asPromptID = (s: string): PromptID => s as any

export type PromptT = {
    stepID: StepID
    graphID: GraphID
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

    /** update pointer to the currently executing node */
    onExecuting = (msg: WsMsgExecuting) => {
        this._graph.onExecuting(msg)
        if (msg.data.node == null) {
            this._finish()
            return
        }
    }

    /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
    private outputs: WsMsgExecuted[] = []
    images: GeneratedImage[] = []

    /** finish this step */
    private _finish = () => {
        if (this._resolve == null) throw new Error('❌ invariant violation: ScriptStep_prompt.resolve is null.')
        this._resolve(this)
    }
}
