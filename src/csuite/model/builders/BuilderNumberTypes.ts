import type { FieldTypes } from '../$FieldTypes'

import { Field_number, type Field_number_config } from '../../fields/number/FieldNumber'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
   Number: Apply<this, Field_number>
}

export type Field_number_config_configured = Omit<Field_number_config, 'mode'>

export class BuilderNumber<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
   static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderNumber)

   // #region ints
   int(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this.int_({ default: this._autoDefault(config), ...config })
   }
   int_(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this._number({ mode: 'int', ...config })
   }

   // #region float
   float(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this._number({ mode: 'float', default: this._autoDefault(config), ...config })
   }
   float_(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this._number({ mode: 'float', ...config })
   }

   // #region ratios
   /** [number variant] precent = mode=int, default=100, step=10, min=0, max=100, suffix='%' */
   percent(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this._number({
         mode: 'int',
         default: 100,
         step: 10,
         min: 0,
         max: 100,
         suffix: '%',
         ...config,
      })
   }

   // #region numbers
   number(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this._number({ mode: 'float', default: this._autoDefault(config), ...config })
   }
   number_(config: Field_number_config_configured = {}): Schemaᐸ_ᐳ['Number'] {
      return this._number({ mode: 'float', ...config })
   }

   // #region _utils
   private _autoDefault(config: { min?: number; default?: number }): number {
      return config.default ?? config.min ?? 0
   }
   private _number(config: Field_number_config): Schemaᐸ_ᐳ['Number'] {
      return this.buildSchema(Field_number, config)
   }
}
