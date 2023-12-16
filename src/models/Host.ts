import { LiveInstance } from 'src/db/LiveInstance'
import { HostT } from 'src/db/TYPES.gen'

export interface HostL extends LiveInstance<HostT, HostL> {}

export class HostL {}
