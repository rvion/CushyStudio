import type { LiveInstance } from '../db/LiveInstance'
import type { TABLES } from 'src/db/TYPES.gen'

export interface TreeEntryL extends LiveInstance<TABLES['tree_entry']> {}
export class TreeEntryL {}
