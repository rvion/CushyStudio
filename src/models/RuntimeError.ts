import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfyPromptL } from './ComfyPrompt'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { StepL } from './Step'

import { LiveRef } from '../db/LiveRef'

export interface RuntimeErrorL extends LiveInstance<TABLES['runtime_error']> {}
export class RuntimeErrorL {
    prompt = new LiveRef<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')
    graph = new LiveRef<this, ComfyWorkflowL>(this, 'graphID', 'comfy_workflow')
    step = new LiveRef<this, StepL>(this, 'stepID', 'step')
}
