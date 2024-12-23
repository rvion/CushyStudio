import type { FieldTypes } from '../$FieldTypes'
import type { Field_group, Field_group_config, Field_group_types } from '../../fields/group/FieldGroup'
import type { SchemaDict } from '../SchemaDict'

export interface IBuilder<Schemaᐸ_ᐳ extends HKT<FieldTypes> = HKT<FieldTypes>> {
   group<T extends SchemaDict>(
      //
      config: Field_group_config<Field_group_types<T>>,
   ): Apply<Schemaᐸ_ᐳ, Field_group<Field_group_types<T>>>
   // linked<T extends Field>(field: T): Apply<Schemaᐸ_ᐳ, Field_shared<T>>
}
