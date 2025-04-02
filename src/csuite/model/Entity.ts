import type { CSchema } from './CSchema'
import type { AnyFieldSerial } from './EntitySerial'
import type { Field } from './Field'

export type EntityConfig<SCHEMA extends CSchema<any>> = {
   name?: string
   serial?: () => Maybe<AnyFieldSerial>
   onValueChange?: (field: SCHEMA['{field}']) => void
   onSerialChange?: (field: SCHEMA['{field}']) => void
}
