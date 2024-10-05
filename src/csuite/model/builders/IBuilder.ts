import type { FieldTypes } from '../$FieldTypes'
import type { Field_group, Field_group_config } from '../../fields/group/FieldGroup'
import type { SchemaDict } from '../SchemaDict'

export interface IBuilder<Schemaᐸ_ᐳ extends HKT<FieldTypes> = HKT<FieldTypes>> {
    group<T extends SchemaDict>(config: Field_group_config<T>): Apply<Schemaᐸ_ᐳ, Field_group<T>>
    // linked<T extends Field>(field: T): Apply<Schemaᐸ_ᐳ, Field_shared<T>>
}
