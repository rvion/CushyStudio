import type { Field_group_config, Field_group } from '../../fields/group/FieldGroup'
import type { CSchema } from '../CSchema'
import type { SchemaDict } from '../SchemaDict'

export interface IBuilder {
   _uid: string
   group<T extends SchemaDict>(config: Field_group_config<T>): CSchema<Field_group<T>>
}
