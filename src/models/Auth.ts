import type { LiveInstance } from '../db/LiveInstance'
import type { AuthT } from 'src/db/TYPES.gen'

export interface AuthL extends LiveInstance<AuthT, AuthL> {}
export class AuthL {}
