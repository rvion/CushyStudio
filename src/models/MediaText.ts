import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'

export class MediaTextL extends BaseInst<TABLES['media_text']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined
    step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
