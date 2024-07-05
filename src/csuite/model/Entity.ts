import type { AnyFieldSerial } from './EntitySerial'
import type { Field } from './Field'
import type { ISchema } from './ISchema'

export type EntityConfig<SCHEMA extends ISchema<any>> = {
    name?: string
    serial?: () => Maybe<AnyFieldSerial>
    onValueChange?: (field: Field<SCHEMA>) => void
    onSerialChange?: (field: Field<SCHEMA>) => void
}
