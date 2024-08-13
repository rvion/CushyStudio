import type { Field_group, Field_group_config } from '../fields/group/FieldGroup'
import type { BaseSchema } from './BaseSchema'
import type { Field } from './Field'

export interface IBuilder {
    group(config: Field_group_config<any>): BaseSchema<Field_group<any>>
    linked<T extends Field>(field: T): BaseSchema<any>
    // SpecCtor: { new <T extends BaseField>(type: T['$Type'], config: T['$Config']): BaseSchema<T> }
}
