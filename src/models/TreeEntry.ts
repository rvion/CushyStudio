import type { LiveInstance } from '../db/LiveInstance'
import type { TreeEntryT } from 'src/db/TYPES.gen'

export interface TreeEntryL extends LiveInstance<TreeEntryT, TreeEntryL> {}
export class TreeEntryL {}
