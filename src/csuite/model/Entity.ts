import type { BaseSchema } from './BaseSchema'
import type { AnyFieldSerial } from './EntitySerial'
import type { Field } from './Field'

export type EntityConfig<SCHEMA extends BaseSchema<any>> = {
    name?: string
    serial?: () => Maybe<AnyFieldSerial>
    onValueChange?: (field: Field<SCHEMA>) => void
    onSerialChange?: (field: Field<SCHEMA>) => void
}
