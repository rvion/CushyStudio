import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { ComfyPromptL } from './ComfyPrompt'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { LiveTable } from '../db/LiveTable'

export class MediaVideoRepo extends LiveTable<TABLES['media_video'], typeof MediaVideoL> {
    constructor(liveDB: LiveDB) {
        super(liveDB, 'media_video', '🖼️', MediaVideoL)
        this.init()
    }
}

export class MediaVideoL extends BaseInst<TABLES['media_video']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
    prompt = new LiveRefOpt<this, ComfyPromptL>(this, 'promptID', 'comfy_prompt')

    get url(): string {
        return this.data.url
    }
}
