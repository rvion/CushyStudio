import type { TABLES } from '../db/TYPES.gen'

import { BaseInst } from '../db/BaseInst'

export class TreeEntryL extends BaseInst<TABLES['tree_entry']> {
    instObservabilityConfig: undefined
    dataObservabilityConfig: undefined
}
