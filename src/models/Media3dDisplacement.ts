import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'

export class Media3dDisplacementL extends BaseInst<TABLES['media_3d_displacement']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined

    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
