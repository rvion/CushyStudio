import type { LiveInstance } from '../db/LiveInstance'
import type { StepL } from './Step'
import type { Media3dDisplacementT } from 'src/db/TYPES.gen'

import { LiveRefOpt } from 'src/db/LiveRefOpt'

export interface Media3dDisplacementL extends LiveInstance<Media3dDisplacementT, Media3dDisplacementL> {}
export class Media3dDisplacementL {
    // currentView ...
    step = new LiveRefOpt<this, StepL>(this, 'stepID', () => this.db.steps)
}
