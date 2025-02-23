import { Field_number } from '../../fields/number/FieldNumber'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'
import { CSchema } from '../CSchema'

export type Field_number_config_configured = Omit<Field_number['$config'], 'mode'>

export type BuilderNumberMixin = {
   int_(config?: Field_number_config_configured): Z.Number
   int(config?: Field_number_config_configured): Z.Number
   float(config?: Field_number_config_configured): Z.Number
   float_(config?: Field_number_config_configured): Z.Number
   percent(config?: Field_number_config_configured): Z.Number
   number(config?: Field_number_config_configured): Z.Number
   number_(config?: Field_number_config_configured): Z.Number
}

const BuilderNumberImpl = (): BuilderNumberMixin =>
   defineSchemaBuilderMixin({
      // #region ints
      int_(config: Field_number_config_configured = {}): Z.Number {
         return this.__buildNumberSchema({ mode: 'int', ...config })
      },
      int(config: Field_number_config_configured = {}): Z.Number {
         return this.int_({ default: _autoDefault(config), ...config })
      },

      // #region float
      float(config: Field_number_config_configured = {}): Z.Number {
         return this.__buildNumberSchema({ mode: 'float', default: _autoDefault(config), ...config })
      },
      float_(config: Field_number_config_configured = {}): Z.Number {
         return this.__buildNumberSchema({ mode: 'float', ...config })
      },

      // #region ratios
      /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
      percent(config: Field_number_config_configured = {}): Z.Number {
         return this.__buildNumberSchema({
            mode: 'int',
            default: 100,
            step: 10,
            min: 0,
            max: 100,
            suffix: '%',
            ...config,
         })
      },

      /**
       * [number variant] ratio = mode=float, default=0.5, step=0.01, min=0, max=1, suffix='%',
       * see also: `percent`
       */
      ratio(config: Omit<Field_number['$config'], 'mode'> = {}): Z.Number {
         return new CSchema<Field_number>(Field_number, {
            mode: 'float',
            default: 0.5,
            step: 0.01,
            min: 0,
            max: 1,
            ...config,
         })
      },

      // #region numbers
      number(config: Field_number_config_configured = {}): Z.Number {
         return this.__buildNumberSchema({ mode: 'float', default: _autoDefault(config), ...config })
      },
      number_(config: Field_number_config_configured = {}): Z.Number {
         return this.__buildNumberSchema({ mode: 'float', ...config })
      },

      // #region _utils
      __buildNumberSchema(config: Field_number['$config']): Z.Number {
         return CSchema.new(Field_number, config)
      },
   })

function _autoDefault(config: { min?: number; default?: number }): number {
   return config.default ?? config.min ?? 0
}

export const BuilderNumberDescriptors: Record<string, PropertyDescriptor> =
   Object.getOwnPropertyDescriptors(BuilderNumberImpl())
