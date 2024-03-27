import type { LiveInstance } from '../db/LiveInstance'
import type { CustomDataT, CustomDataTable, TABLES } from '../db/TYPES.gen'

export interface CustomDataL<T = any> extends LiveInstance<TABLES['custom_data']> {}
export class CustomDataL<T = any> {
    get = (): T => {
        return this.data.json as T
    }
}
