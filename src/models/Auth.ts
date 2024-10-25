import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'

import { BaseInst } from '../db/BaseInst'
import { LiveTable } from '../db/LiveTable'

export class AuthRepo extends LiveTable<TABLES['auth'], typeof AuthL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'auth', '🚶‍♂️', AuthL)
      this.init()
   }
}

export class AuthL extends BaseInst<TABLES['auth']> {
   instObservabilityConfig: undefined
   dataObservabilityConfig: undefined
}
