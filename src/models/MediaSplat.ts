import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'

export class MediaSplatL extends BaseInst<TABLES['media_splat']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined

    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
