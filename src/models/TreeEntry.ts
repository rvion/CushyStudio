import type { TreeEntryT } from 'src/db/TYPES.gen'
import type { LiveInstance } from '../db/LiveInstance'

export interface TreeEntryL extends LiveInstance<TreeEntryT, TreeEntryL> {}
export class TreeEntryL {}
