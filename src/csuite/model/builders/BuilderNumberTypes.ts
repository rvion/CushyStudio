import { Field_number } from '../../fields/number/FieldNumber'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type Field_number_config_configured = Omit<Field_number['Ҩconfig'], 'mode'>

export type BuilderNumberMixin = {
   int_(config?: Field_number_config_configured): Z.Number
   int(config?: Field_number_config_configured): Z.Number
   float(config?: Field_number_config_configured): Z.Number
   float_(config?: Field_number_config_configured): Z.Number
   percent(config?: Field_number_config_configured): Z.Number
   ratio(config: Field_number_config_configured): Z.Number
   number(config?: Field_number_config_configured): Z.Number
   number_(config?: Field_number_config_configured): Z.Number
}

const BuilderNumberImpl = (): BuilderNumberMixin =>
   defineSchemaBuilderMixin<BuilderNumberMixin>({
      // #region ints
      int_(config: Field_number_config_configured = {}): Z.Number {
         return buildNumberSchema({ mode: 'int', ...config })
      },
      int(config: Field_number_config_configured = {}): Z.Number {
         return this.int_({ default: _autoDefault(config), ...config })
      },

      // #region float
      float(config: Field_number_config_configured = {}): Z.Number {
         return buildNumberSchema({ mode: 'float', default: _autoDefault(config), ...config })
      },
      float_(config: Field_number_config_configured = {}): Z.Number {
         return buildNumberSchema({ mode: 'float', ...config })
      },

      // #region ratios
      /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
      percent(config: Field_number_config_configured = {}): Z.Number {
         return buildNumberSchema({
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
      ratio(config: Omit<Field_number['Ҩconfig'], 'mode'> = {}): Z.Number {
         return CSchema.new<Field_number>(Field_number, {
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
         return buildNumberSchema({ mode: 'float', default: _autoDefault(config), ...config })
      },
      number_(config: Field_number_config_configured = {}): Z.Number {
         return buildNumberSchema({ mode: 'float', ...config })
      },
   })

function buildNumberSchema(config: Field_number['Ҩconfig']): Z.Number {
   return CSchema.new(Field_number, config)
}

function _autoDefault(config: { min?: number; default?: number }): number {
   return config.default ?? config.min ?? 0
}

export const BuilderNumberDescriptors: Record<string, PropertyDescriptor> =
   Object.getOwnPropertyDescriptors(BuilderNumberImpl())
