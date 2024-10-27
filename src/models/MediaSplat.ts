import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { LiveTable } from '../db/LiveTable'

export class MediaSplatRepo extends LiveTable<TABLES['media_splat'], typeof MediaSplatL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'media_splat', '🖼️', MediaSplatL)
      this.init()
   }
}

export class MediaSplatL extends BaseInst<TABLES['media_splat']> {
   instObservabilityConfig: undefined
   dataObservabilityConfig: undefined
   step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
