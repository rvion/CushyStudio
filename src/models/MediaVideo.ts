import type { LiveInstance } from '../db/LiveInstance'
import type { ComfyPromptL } from './ComfyPrompt'
import type { StepL } from './Step'
import type { TABLES } from 'src/db/TYPES.gen'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface MediaVideoL extends LiveInstance<TABLES['media_video']> {}
export class MediaVideoL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
    prompt = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')

    get url() {
        return this.data.url
    }
}
