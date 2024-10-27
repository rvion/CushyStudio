import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { LiveTable } from '../db/LiveTable'

export class MediaTextRepo extends LiveTable<TABLES['media_text'], typeof MediaTextL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'media_text', '💬', MediaTextL)
      this.init()
   }
}

export class MediaTextL extends BaseInst<TABLES['media_text']> {
   instObservabilityConfig: undefined
   dataObservabilityConfig: undefined
   step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
