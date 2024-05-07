import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface MediaTextL extends LiveInstance<TABLES['media_text']> {}
export class MediaTextL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
