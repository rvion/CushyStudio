import type { MediaSplatT } from 'src/db2/TYPES.gen'
import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface MediaSplatL extends LiveInstance<MediaSplatT, MediaSplatL> {}
export class MediaSplatL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
