import type { LiveInstance } from '../db/LiveInstance'
import type { CustomDataT } from 'src/db/TYPES.gen'

export interface CustomDataL<T = any> extends LiveInstance<CustomDataT, CustomDataL> {}
export class CustomDataL<T = any> {
    get = (): T => {
        return this.data.json as T
    }
}
