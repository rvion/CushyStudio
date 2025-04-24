import { Field_bool } from '../../fields/bool/FieldBool'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

export type BuilderBoolMixin = {
   bool_(config?: Field_bool['{config}']): Z.Bool
   boolean(config?: Field_bool['{config}'] | boolean): Z.Bool
   bool(config?: Field_bool['{config}'] | boolean): Z.Bool
}

const BuilderBoolImpl = (): BuilderBoolMixin =>
   defineSchemaBuilderMixin<BuilderBoolMixin>({
      /**
       * boolean without default
       */
      bool_(config: Field_bool['{config}'] = {}): Z.Bool {
         return CSchema.new(Field_bool, config)
      },

      /**
       * @deprecated; use `bool`
       */
      boolean(config: Field_bool['{config}'] | boolean = {}): Z.Bool {
         if (typeof config === 'boolean') config = { default: config }
         return this.bool(config)
      },

      /**
       * boolean with default to false, unless default specified otherwise
       */
      bool(config: Field_bool['{config}'] | boolean = {}): Z.Bool {
         if (typeof config === 'boolean') config = { default: config }
         const def = config.default ?? false
         return this.bool_({ default: def, ...config } as Field_bool['{config}']) // 2024-12-20 domi: not sure why I have a type error without explicit cast
      },
   })

export const BuilderBoolDescriptors = Object.getOwnPropertyDescriptors(BuilderBoolImpl())
