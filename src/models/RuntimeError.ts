import type { LiveInstance } from '../db/LiveInstance'
import type { ComfyPromptL } from './ComfyPrompt'
import type { ComfyWorkflowL } from './ComfyWorkflow'
import type { StepL } from './Step'
import type { RuntimeErrorT } from 'src/db/TYPES.gen'

import { LiveRef } from '../db/LiveRef'

export interface RuntimeErrorL extends LiveInstance<RuntimeErrorT, RuntimeErrorL> {}
export class RuntimeErrorL {
    prompt = new LiveRef<this, ComfyPromptL>(this, 'promptID', () => this.db.comfy_prompts)
    graph = new LiveRef<this, ComfyWorkflowL>(this, 'graphID', () => this.db.graphs)
    step = new LiveRef<this, StepL>(this, 'stepID', () => this.db.steps)
}
