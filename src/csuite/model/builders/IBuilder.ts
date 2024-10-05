import type { Field_group, Field_group_config } from '../../fields/group/FieldGroup'
import type { Field } from '../Field'
import type { SchemaDict } from '../SchemaDict'

export interface IBuilder<Schemaᐸ_ᐳ extends HKT<Field> = HKT<Field>> {
    group<T extends SchemaDict>(config: Field_group_config<T>): Apply<Schemaᐸ_ᐳ, Field_group<T>>
    // linked<T extends Field>(field: T): Apply<Schemaᐸ_ᐳ, Field_shared<T>>
}
