import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'
import type { MediaTextT } from 'src/db/TYPES.gen'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface MediaTextL extends LiveInstance<MediaTextT, MediaTextL> {}
export class MediaTextL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', () => this.db.steps)
}
