import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface MediaSplatL extends LiveInstance<TABLES['media_splat']> {}
export class MediaSplatL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
