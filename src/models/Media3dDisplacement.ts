import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'
import type { StepL } from './Step'

import { BaseInst } from '../db/BaseInst'
import { LiveRefOpt } from '../db/LiveRefOpt'
import { LiveTable } from '../db/LiveTable'

export class Media3dDisplacementRepo extends LiveTable<
   TABLES['media_3d_displacement'],
   typeof Media3dDisplacementL
> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'media_3d_displacement', '🖼️', Media3dDisplacementL)
      this.init()
   }
}

export class Media3dDisplacementL extends BaseInst<TABLES['media_3d_displacement']> {
   instObservabilityConfig: undefined
   dataObservabilityConfig: undefined
   step = new LiveRefOpt<this, StepL>(this, 'stepID', 'step')
}
