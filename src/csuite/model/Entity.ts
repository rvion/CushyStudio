import type { Field } from './Field'
import type { ISchema } from './ISchema'

import { type EntitySerial } from './EntitySerial'

export type EntityConfig<SCHEMA extends ISchema<any>> = {
    name?: string
    serial?: () => Maybe<EntitySerial>
    onValueChange?: (form: Field<SCHEMA>) => void
    onSerialChange?: (form: Field<SCHEMA>) => void
}
