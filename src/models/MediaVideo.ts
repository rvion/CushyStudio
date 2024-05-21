import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfyPromptL } from './ComfyPrompt'
import type { StepL } from './Step'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface MediaVideoL extends LiveInstance<TABLES['media_video']> {}
export class MediaVideoL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
    prompt = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')

    get url() {
        return this.data.url
    }
}
