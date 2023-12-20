import type { AuthT } from 'src/db/TYPES.gen'
import type { LiveInstance } from '../db/LiveInstance'

export interface AuthL extends LiveInstance<AuthT, AuthL> {}
export class AuthL {}
