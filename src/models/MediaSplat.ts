import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'
import type { TABLES } from 'src/db/TYPES.gen'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface MediaSplatL extends LiveInstance<TABLES['media_splat']> {}
export class MediaSplatL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
