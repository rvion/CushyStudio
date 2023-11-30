import type { LiveInstance } from '../db/LiveInstance'
import type { MediaVideoT } from 'src/db2/TYPES.gen'
import type { StepL } from './Step'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface MediaVideoL extends LiveInstance<MediaVideoT, MediaVideoL> {}
export class MediaVideoL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
    prompt = new LiveRefOpt<this, StepL>(this, 'promptID', 'comfy_prompt')
}
