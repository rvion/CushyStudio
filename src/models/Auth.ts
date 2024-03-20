import type { LiveInstance } from '../db/LiveInstance'
import type { AuthTable, TABLES } from '../db/TYPES.gen'

export interface AuthL extends LiveInstance<TABLES['auth']> {}
export class AuthL {}
