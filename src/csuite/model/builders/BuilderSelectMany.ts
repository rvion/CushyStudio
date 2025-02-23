import type { SelectKey } from '../../fields/selectOne/SelectOneKey'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../../fields/selectOne/SelectOption'

import {
   Field_selectMany,
   type Field_selectMany_,
   type Field_selectMany_config,
   type Field_selectMany_config_simplified,
   type Field_selectMany_config_simplified_,
} from '../../fields/selectMany/FieldSelectMany'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'
import { removeReadOnly } from 'src/front/reusable/utils.types.shared'
import { IDENTITY } from '../../utils/identity'
import { NAIVE_getOptionFromId } from './NAIVE_getOptionFromId'
import { CSchema } from '../CSchema'

// prettier-ignore
export type BuilderSelectManyMixin = {
   selectMany<const V, const K extends SelectKey>(config: Field_selectMany_config<V, K>): Z.Many<V, K>;
   selectMany_<const V, const K extends string>(config: Field_selectMany_config<V, K>): Z.Many<V, K>;
   selectManyString<const K extends string>(p: readonly K[], config?: Field_selectMany_config_simplified_<K>): Z.Many_<K>;
   selectManyStrings<const K extends string>(p: readonly K[], config?: Field_selectMany_config_simplified_<K>): Z.Many_<K>;
   selectManyDynamicStrings<const K extends string>(p: (self: Field_selectMany_<K>) => readonly K[], config?: Field_selectMany_config_simplified_<K>): Z.Many_<K>;
   selectManyOptions<const O extends SelectOptionNoVal<string>>(options: readonly O[], config?: Field_selectMany_config_simplified<O, O["id"]>): Z.Many<O, O["id"]>;
   selectManyOptionsFn<const O extends SelectOptionNoVal<string>>(optionsFn: (self: Field_selectMany<O, O["id"]>) => readonly O[], config?: Field_selectMany_config_simplified<O, O["id"]>): Z.Many<O, O["id"]>;
   selectManyOptionIds<const O extends SelectOptionNoVal<string>>(options: readonly O[], config?: Field_selectMany_config_simplified_<O["id"]>): Z.Many_<O["id"]>;
   selectManyOptionValues<const V extends string>(options: SelectOption_<V>[], config?: Field_selectMany_config_simplified_<V>): Z.Many_<V>;
}

const emptyArray = Object.freeze([])
const BuilderSelectManyImpl = (
   _defaultSelectManyConfig: Partial<Field_selectMany_config<any, any>> = {},
): BuilderSelectManyMixin =>
   defineSchemaBuilderMixin({
      /**
       * this method has all the selectMany capabilities.
       * please, use a simpler variant if you don't need all the features.
       *
       * @see {@link selectManyString}
       * @see {@link selectManyOptions}
       * @see {@link selectManyOptionIds}
       * @see {@link selectManyOptionValues}
       */
      selectMany<const V, const K extends SelectKey>(config: Field_selectMany_config<V, K>): Z.Many<V, K> {
         return CSchema.new(Field_selectMany<V, K>, {
            default: emptyArray,
            ..._defaultSelectManyConfig,
            ...config,
         })
      },

      /**
       * this method has all the selectMany capabilities.
       * please, use a simpler variant if you don't need all the features.
       *
       * @see {@link selectManyString}
       * @see {@link selectManyOptions}
       * @see {@link selectManyOptionIds}
       * @see {@link selectManyOptionValues}
       */
      selectMany_<const V, const K extends string>(config: Field_selectMany_config<V, K>): Z.Many<V, K> {
         return CSchema.new(Field_selectMany<V, K>, {
            ..._defaultSelectManyConfig,
            ...config,
         })
      },

      /**
       * simplest way to build a quick enum select,
       * work with both static and dynamic select;
       *
       * @see {@link selectMany} or other variants for more advanced use cases.
       * @since 2024-08-26
       */
      selectManyString<const K extends string>(
         p: readonly K[],
         config: Field_selectMany_config_simplified_<K> = {},
      ): Z.Many_<K> {
         return this.selectMany({
            choices: removeReadOnly(p),
            getOptionFromId: NAIVE_getOptionFromId,
            getValueFromId: IDENTITY,
            getIdFromValue: IDENTITY,
            ...config,
         })
      },

      /** @alias to selectManyString */
      selectManyStrings<const K extends string>(
         p: readonly K[],
         config: Field_selectMany_config_simplified_<K> = {},
      ): Z.Many_<K> {
         return this.selectManyString(p, config)
      },

      /**
       * @since 2024-10-18
       */
      selectManyDynamicStrings<const K extends string>(
         p: (self: Field_selectMany_<K>) => readonly K[],
         config: Field_selectMany_config_simplified_<K> = {},
      ): Z.Many_<K> {
         return this.selectMany({
            choices: (self) => removeReadOnly(p(self)),
            getOptionFromId: NAIVE_getOptionFromId,
            getValueFromId: IDENTITY,
            getIdFromValue: IDENTITY,
            ...config,
         })
      },

      /**
       * the value is the option itself
       * practical way when you just want to make label, icon, hue, etc
       * on the fly, but still want to access the full object in the end,
       * so you can add some custom properties to the same object, like stuff
       * you'll actually need in the callback.
       *
       * @see {@link selectMany} or other variants for more advanced use cases.
       * @since 2024-08-26
       */
      selectManyOptions<const O extends SelectOptionNoVal<string>>(
         options: readonly O[],
         config: Field_selectMany_config_simplified<O, O['id']> = {},
      ): Z.Many<O, O['id']> {
         const keys: O['id'][] = options.map((c) => c.id)
         return this.selectMany<O, O['id']>({
            choices: keys,
            getIdFromValue: (v) => v.id,
            getValueFromId: (id) => options.find((c) => c.id === id) ?? null,
            getOptionFromId: (id): Maybe<SelectOption<O, O['id']>> => {
               // 2024-08-02 domi: could probably include a cache
               // see also notes on `SelectManyConfig.serial.extra`
               // see also notes on `selectManyStringFn` usage in `prefab_prql_query.tsx`
               const option = options.find((c) => c.id === id)
               if (!option) return null
               return { id: option.id, label: option.label ?? option.id, value: option, hue: option.hue }
            },
            ...config,
         })
      },

      selectManyOptionsFn<const O extends SelectOptionNoVal<string>>(
         optionsFn: (self: Field_selectMany<O, O['id']>) => readonly O[],
         config: Field_selectMany_config_simplified<O, O['id']> = {},
      ): Z.Many<O, O['id']> {
         return this.selectMany<O, O['id']>({
            choices: (self) => optionsFn(self).map((c) => c.id),
            getIdFromValue: (v) => v.id,
            getValueFromId: (id, self) => optionsFn(self).find((c) => c.id === id) ?? null,
            getOptionFromId: (id, self): Maybe<SelectOption<O, O['id']>> => {
               const options = optionsFn(self)
               const option = options.find((c) => c.id === id)
               if (!option) return null
               return { id: option.id, label: option.label ?? option.id, value: option, hue: option.hue }
            },
            ...config,
         })
      },

      /**
       * @since 2024-08-26
       * value is the option id (`option.id`)
       * NO NEED to specify the value in the given options.
       * If you specify the value, it will be IGNORED.
       *
       * @see {@link selectMany} or other variants for more advanced use cases.
       * @since 2024-08-26
       */
      selectManyOptionIds<const O extends SelectOptionNoVal<string>>(
         options: readonly O[],
         config: Field_selectMany_config_simplified_<O['id']> = {},
      ): Z.Many_<O['id']> {
         const choices = options.map((c) => c.id)
         return this.selectMany<O['id'], O['id']>({
            choices: choices,
            getIdFromValue: IDENTITY,
            getValueFromId: (id) => id as O['id'],
            getOptionFromId: (id): Maybe<SelectOption_<O['id']>> => {
               // 2024-08-02 domi: could probably include a cache
               // see also notes on `SelectOneConfig.serial.extra`
               // see also notes on `selectOneStringFn` usage in `prefab_prql_query.tsx`
               const option = options.find((c) => c.id === id)
               if (!option) return null
               return {
                  id: option.id,
                  label: option.label ?? option.id,
                  value: option.id,
                  hue: option.hue,
               }
            },
            ...config,
         })
      },

      /**
       * @since 2024-08-26
       * value is the option value
       * you NEED to specify the value in the given options.
       *
       * @see {@link selectMany} or other variants for more advanced use cases.
       * @since 2024-08-26
       */
      selectManyOptionValues<const V extends string>(
         options: SelectOption_<V>[],
         config: Field_selectMany_config_simplified_<V> = {},
      ): Z.Many_<V> {
         const ids: V[] = options.map((c) => c.id)
         return this.selectMany<V, V>({
            choices: ids,
            getIdFromValue: IDENTITY,
            getValueFromId: (id) => id as V,
            getOptionFromId: (id): SelectOption<V, V> => {
               const opt = options.find((c) => c.id === id)
               if (opt == null) return { id, label: id, value: id as V } as SelectOption<V, V>
               return { ...opt, value: id as V }
            }, //
            ...config,
         })
      },
   })

export const BuilderSelectManyDescriptorsFn = (
   _defaultSelectManyConfig: Partial<Field_selectMany_config<any, any>> = {},
): Record<string, PropertyDescriptor> =>
   Object.getOwnPropertyDescriptors(BuilderSelectManyImpl(_defaultSelectManyConfig))
