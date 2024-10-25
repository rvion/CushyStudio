import type { FieldTypes } from '../$FieldTypes'
import type { NO_PROPS } from '../../types/NO_PROPS'
import type { SchemaDict } from '../SchemaDict'

import { Field_group, type Field_group_config, type Field_group_types } from '../../fields/group/FieldGroup'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
   Group: HKT<SchemaDict>
   Empty: Apply<this, Field_group<Field_group_types<NO_PROPS>>>
}

export class BuilderGroup<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
   static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderGroup)

   /** see also: `fields` for a more practical api */
   group<T extends SchemaDict>(
      config: Field_group_config<Field_group_types<T>> = {},
   ): Apply<Schemaᐸ_ᐳ['Group'], T> {
      return this.buildSchema(Field_group<Field_group_types<T>>, config)
   }

   fields<T extends SchemaDict>(
      items: T,
      config: Omit<Field_group_config<Field_group_types<T>>, 'items'> = {},
   ): Apply<Schemaᐸ_ᐳ['Group'], T> {
      return this.group({ items, ...config })
   }

   empty(config: Field_group_config<Field_group_types<NO_PROPS>> = {}): Schemaᐸ_ᐳ['Empty'] {
      return this.group(config)
   }

   // Backward Compat (row/col)
   private _defaultGroupConfigs: {
      row?: Partial<Omit<Field_group_config<any>, 'items' | 'summary'>>
      column?: Partial<Omit<Field_group_config<any>, 'items' | 'summary'>>
   } = {}

   withDefaultGroupConfig(conf: {
      row?: Partial<Field_group_config<any>>
      column?: Partial<Field_group_config<any>>
   }): this {
      Object.assign(this._defaultGroupConfigs, conf)
      return this
   }

   row = <T extends SchemaDict>(
      items: T,
      config: Omit<Field_group_config<Field_group_types<T>>, 'items'> = {},
   ): Apply<Schemaᐸ_ᐳ['Group'], T> => {
      const finalConfig: Field_group_config<Field_group_types<T>> = {
         ...this._defaultGroupConfigs.row,
         ...config,
      }
      return this.fields(items, finalConfig)
   }

   column = <T extends SchemaDict>(
      items: T,
      config: Omit<Field_group_config<Field_group_types<T>>, 'items'> = {},
   ): Apply<Schemaᐸ_ᐳ['Group'], T> => {
      return this.fields(items, { ...this._defaultGroupConfigs.column, ...config })
   }
}
