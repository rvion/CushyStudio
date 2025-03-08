import type { Field_group, Field_group_config } from '../fields/group/FieldGroup'
import type { CSchema } from './CSchema'
import type { Field } from './Field'

export interface IBuilder {
   group(config: Field_group_config<any>): CSchema<Field_group<any>>
   linked<T extends Field>(field: T): CSchema<any>
   // SpecCtor: { new <T extends BaseField>(type: T['$type'], config: T['$config']): CSchema<T> }
}
