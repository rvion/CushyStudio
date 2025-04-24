import type { LiveDB } from '../db/LiveDB'
import type { TABLES } from '../db/TYPES.gen'

import { BaseInst } from '../db/BaseInst'
import { LiveTable } from '../db/LiveTable'

export class TreeEntryRepo extends LiveTable<TABLES['tree_entry'], typeof TreeEntryL> {
   constructor(liveDB: LiveDB) {
      super(liveDB, 'tree_entry', '🖼️', TreeEntryL)
   }
}

export class TreeEntryL extends BaseInst<TABLES['tree_entry']> {}
