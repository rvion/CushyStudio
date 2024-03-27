import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'
import type { TABLES } from '../db/TYPES.gen'

import { LiveRefOpt } from '../db/LiveRefOpt'

export interface Media3dDisplacementL extends LiveInstance<TABLES['media_3d_displacement']> {}
export class Media3dDisplacementL {
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
