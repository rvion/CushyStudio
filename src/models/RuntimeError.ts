import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfyPromptL } from './ComfyPrompt'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRef } from '../db/LiveRef'
import { LiveTable } from '../db/LiveTable'

export class RuntimeErrorRepo extends LiveTable<TABLES['runtime_error'], typeof RuntimeErrorL> {
    constructor(liveDB: LiveDB) {
        super(liveDB, 'runtime_error', '❌', RuntimeErrorL)
        this.init()
    }
}
export class RuntimeErrorL extends BaseInst<TABLES['runtime_error']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined
    prompt = new LiveRef<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')
    graph = new LiveRef<this, ComfyWorkflowL>(this, 'graphID', 'comfy_workflow')
    step = new LiveRef<this, StepL>(this, 'stepID', 'step')
}
