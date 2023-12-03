import type { LiveInstance } from '../db/LiveInstance'
import type { MediaVideoT } from 'src/db/TYPES.gen'
import type { StepL } from './Step'
import type { ComfyPromptL } from './ComfyPrompt'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface MediaVideoL extends LiveInstance<MediaVideoT, MediaVideoL> {}
export class MediaVideoL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', () => this.db.steps)
    prompt = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', () => this.db.comfy_prompts)

    get url() {
        return this.data.url
    }
}
