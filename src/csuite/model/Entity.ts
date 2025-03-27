import type { CSchema } from './CSchema'
import type { AnyFieldSerial } from './EntitySerial'
import type { Field } from './Field'

export type EntityConfig<SCHEMA extends CSchema<any>> = {
   name?: string
   serial?: () => Maybe<AnyFieldSerial>
   onValueChange?: (field: SCHEMA['ҨField']) => void
   onSerialChange?: (field: SCHEMA['ҨField']) => void
}
