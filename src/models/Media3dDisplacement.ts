import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'
import type { TABLES } from 'src/db/TYPES.gen'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface Media3dDisplacementL extends LiveInstance<TABLES['media_3d_displacement']> {}
export class Media3dDisplacementL {
    // currentView ...
    step = new LiveRefOpt<this, StepL>(this, 'stepID', () => this.db.steps)
}
