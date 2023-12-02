import type { LiveInstance } from '../db/LiveInstance'
import type { MediaTextT } from 'src/db/TYPES.gen'
import type { StepL } from './Step'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface MediaTextL extends LiveInstance<MediaTextT, MediaTextL> {}
export class MediaTextL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
