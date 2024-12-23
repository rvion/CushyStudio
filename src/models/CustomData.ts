import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'

import { BaseInst } from '../db/BaseInst'
import { LiveTable } from '../db/LiveTable'

export class CustomDataRepo extends LiveTable<TABLES['custom_data'], typeof CustomDataL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'custom_data', '🎁', CustomDataL)
      this.init()
   }
}

export class CustomDataL<T = any> extends BaseInst<TABLES['custom_data']> {
   instObservabilityConfig: undefined
   dataObservabilityConfig: undefined
   get = (): T => {
      return this.data.json as T
   }
}
