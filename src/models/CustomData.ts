import type { CustomDataT } from 'src/db/TYPES.gen'
import type { LiveInstance } from '../db/LiveInstance'

export interface CustomDataL<T = any> extends LiveInstance<CustomDataT, CustomDataL> {}
export class CustomDataL<T = any> {
    get = (): T => {
        return this.data.json as T
    }
}
