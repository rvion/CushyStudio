import type { FieldConstructor } from '../FieldConstructor'
import type { SchemaDict } from '../SchemaDict'

import { Field_choices } from '../../fields/choices/FieldChoices'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'

type Items<T extends SchemaDict> = Field_choices<T>['…config']['items']
type Config<T extends SchemaDict> = Omit<Field_choices<T>['…config'], 'multi' | 'items'>

// prettier-ignore
export type BuilderChoicesMixin = {
   choice<T extends SchemaDict>(items: Items<T>, config?: Config<T>): Z.Union<T>;
   choices<T extends SchemaDict>(items: Items<T>, config?: Config<NoInfer<T>>): Z.Union<T>;
   tabs<T extends SchemaDict>(items: Items<T>, config?: Config<T>): Z.Union<T>;
   choice_<T extends SchemaDict>(items: Items<T>, config?: Config<NoInfer<T>>): Z.Union<T>;
   choices_<T extends SchemaDict>(items: Items<T>, config?: Config<NoInfer<T>>): Z.Union<T>;
}

const BuilderChoicesImpl = (): BuilderChoicesMixin =>
   defineSchemaBuilderMixin<BuilderChoicesMixin>({
      choice<T extends SchemaDict>(
         //
         items: Items<T>,
         config: Config<T> = {},
      ): Z.Union<T> {
         const defaultKey = typeof items === 'function' ? undefined : Object.keys(items)[0]
         return this.choice_(items, { default: defaultKey, ...config })
      },

      choices<T extends SchemaDict>(items: Items<T>, config: Config<NoInfer<T>> = {}): Z.Union<T> {
         return this.choices_(items, { default: {}, ...config })
      },

      /** simple choice alternative api */
      tabs<T extends SchemaDict>(items: Items<T>, config: Config<T> = {}): Z.Union<T> {
         const defaultKey = typeof items === 'function' ? undefined : Object.keys(items)[0]
         return this.choices_(items, { default: defaultKey, appearance: 'tab', ...config })
      },

      // #region without defaults

      /** generic choice field, without any default */
      choice_<T extends SchemaDict>(items: Items<T>, config: Config<NoInfer<T>> = {}): Z.Union<T> {
         // 💬 2025-02-03 rvion:
         // the cast here is just so we can pretend at the type level that the class have the MAGICCHOICES
         // defined at construction (whici it does via manual Object.defineProperty in the constructor!)
         const CTOR = Field_choices as FieldConstructor<Field_choices<T>>
         return CSchema.new(CTOR, { items, multi: false, ...config }) as Z.Union<T>
      },

      /** generic choice field, without any default */
      choices_<T extends SchemaDict>(items: Items<T>, config: Config<NoInfer<T>> = {}): Z.Union<T> {
         const CTOR = Field_choices as FieldConstructor<Field_choices<T>>
         return CSchema.new(CTOR, { items, multi: true, ...config }) as Z.Union<T>
      },
   })

export const BuilderChoicesDescriptors: Record<string, PropertyDescriptor> =
   Object.getOwnPropertyDescriptors(BuilderChoicesImpl())
