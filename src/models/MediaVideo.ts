import type { TABLES } from '../db/TYPES.gen'
import type { ComfyPromptL } from './ComfyPrompt'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'

export class MediaVideoL extends BaseInst<TABLES['media_video']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
    prompt = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')

    get url(): string {
        return this.data.url
    }
}
