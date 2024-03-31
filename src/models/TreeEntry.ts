import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from '../db/TYPES.gen'

export interface TreeEntryL extends LiveInstance<TABLES['tree_entry']> {}
export class TreeEntryL {}
