import type {
   Field_selectOne_config,
   Field_selectOne_config_simplified,
   Field_selectOne_config_simplified_,
} from '../../fields/selectOne/FieldSelectOne'
import type { SelectKey } from '../../fields/selectOne/SelectOneKey'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../../fields/selectOne/SelectOption'

import { Field_selectOne } from '../../fields/selectOne/FieldSelectOne'
import { IDENTITY } from '../../utils/identity'
import { CSchema } from '../CSchema'
import { defineSchemaBuilderMixin } from './defineSchemaBuilderMixin'
import { NAIVE_getOptionFromId, NAIVE_getOptionFromId2 } from './NAIVE_getOptionFromId'

type Field_selectOne_<V extends SelectKey> = Field_selectOne<V, V>

// prettier-ignore
export type BuilderSelectOneMixin = {
   selectOne_<VALUE, KEY extends SelectKey>(config: Field_selectOne_config<VALUE, KEY>): Z.OneOf<VALUE, KEY>;
   selectOne<V, K extends SelectKey>(config: Field_selectOne_config<V, K>): Z.OneOf<V, K>;
   selectOneString<const VALUE extends SelectKey>(choices: readonly VALUE[] | (() => VALUE[]), config?: Field_selectOne_config_simplified_<VALUE>): Z.OneOf_<VALUE>;
   selectOneString_<const VALUE extends SelectKey>(choices: readonly VALUE[] | (() => VALUE[]), config?: Field_selectOne_config_simplified_<VALUE>): Z.OneOf_<VALUE>;
   selectOneStringFn<VALUE extends SelectKey>(choices: (self: Field_selectOne_<VALUE>) => VALUE[], config?: Field_selectOne_config_simplified_<VALUE>): Z.OneOf_<VALUE>;
   selectOneOption<const O extends SelectOptionNoVal<string>>(options: readonly O[], config?: Field_selectOne_config_simplified<O, O["id"]>): Z.OneOf<O, O["id"]>;
   selectOneOptionFn<const O extends SelectOptionNoVal<string>>(optionsFn: (self: Field_selectOne<O, O["id"]>) => O[], config?: Field_selectOne_config_simplified<O, O["id"]>): Z.OneOf<O, O["id"]>;
   selectOneOptionId<const O extends SelectOptionNoVal<string>>(options: O[] | ((self: Field_selectOne_<NoInfer<O>["id"]>) => O[]), config?: Field_selectOne_config_simplified_<O["id"]>): Z.OneOf_<O["id"]>;
   selectOneOptionValue<const V extends string>(options: SelectOption_<V>[], config?: Field_selectOne_config_simplified_<V>): Z.OneOf_<V>;
}

const BuilderSelectOneImpl = (
   _defaultSelectOneConfig: Partial<Field_selectOne_config<any, any>> = {},
): BuilderSelectOneMixin =>
   defineSchemaBuilderMixin<BuilderSelectOneMixin>({
      // private _defaultSelectOneConfig: Partial<Field_selectOne_config<any, any>> = {}
      // withDefaultSelectOneConfig(conf: Partial<Field_selectOne_config<any, any>>) {
      //    this._defaultSelectOneConfig = conf
      //    return this
      // }

      /**
       * this method has all the selectOne capabilities, and doesn't help much with
       * not shooting yourself in the foot.
       * you may prefer using a simpler variant with more default / options filled in.
       *
       * @see {@link selectOne}
       * @see {@link selectOneString}
       * @see {@link selectOneOption}
       * @see {@link selectOneOptionId}
       * @see {@link selectOneOptionValue}
       */
      selectOne_<VALUE, KEY extends SelectKey>(
         //
         config: Field_selectOne_config<VALUE, KEY>,
      ): Z.OneOf<VALUE, KEY> {
         return CSchema.new(Field_selectOne<VALUE, KEY>, {
            ..._defaultSelectOneConfig,
            ...config,
         })
      },

      /** generic selectOne, defaulting to first choices when choices is an array. */
      selectOne<V, K extends SelectKey>(
         //
         config: Field_selectOne_config<V, K>,
      ): Z.OneOf<V, K> {
         const def = Array.isArray(config.choices) ? config.choices[0] : undefined
         return this.selectOne_<V, K>({
            default: def,
            ...config,
         })
      },

      /**
       * simplest way to build a quick enum select,
       * work with both static and dynamic select;
       *
       * @since 2024-08-26
       *
       * 👉 if you use dyanmic selections, just make sure
       * there is at least one value in the array.
       */
      selectOneString<const VALUE extends SelectKey>(
         choices: readonly VALUE[] | (() => VALUE[]),
         config: Field_selectOne_config_simplified_<VALUE> = {},
      ): Z.OneOf_<VALUE> {
         return this.selectOne<VALUE, VALUE>({
            choices: choices as VALUE[] | (() => VALUE[]),
            getIdFromValue: IDENTITY,
            getValueFromId: IDENTITY,
            getOptionFromId: NAIVE_getOptionFromId,
            ...config,
         })
      },

      /**
       * simplest way to build a quick enum select WITHOUT DEFAULT,
       * work with both static and dynamic select;
       *
       * @since 2024-09-16
       *
       * 👉 if you use dyanmic selections, just make sure
       * there is at least one value in the array.
       */
      selectOneString_<const VALUE extends SelectKey>(
         choices: readonly VALUE[] | (() => VALUE[]),
         config: Field_selectOne_config_simplified_<VALUE> = {},
      ): Z.OneOf_<VALUE> {
         return this.selectOne_<VALUE, VALUE>({
            choices: choices as VALUE[] | (() => VALUE[]),
            getIdFromValue: IDENTITY,
            getValueFromId: IDENTITY,
            getOptionFromId: NAIVE_getOptionFromId2,
            ...config,
         })
      },

      selectOneStringFn<VALUE extends SelectKey>(
         choices: (self: Field_selectOne_<VALUE>) => VALUE[],
         config: Field_selectOne_config_simplified_<VALUE> = {},
      ): Z.OneOf_<VALUE> {
         return this.selectOne<VALUE, VALUE>({
            choices,
            getIdFromValue: IDENTITY,
            getValueFromId: IDENTITY,
            getOptionFromId: NAIVE_getOptionFromId,
            ...config,
         })
      },

      /**
       * the value is the option itself
       * practical way when you just want to make label, icon, hue, etc
       * on the fly, but still want to access the full object in the end,
       * so you can add some custom properties to the same object, like stuff
       * you'll actually need in the callback.
       */
      selectOneOption<const O extends SelectOptionNoVal<string>>(
         options: readonly O[] /* | ((self: X.SelectOne<O, O['id']>) => O[]) */,
         config: Field_selectOne_config_simplified<O, O['id']> = {},
      ): Z.OneOf<O, O['id']> {
         // precompute key list
         const keys: O['id'][] = options.map((c) => c.id)

         // precompute key-to-option map
         const cache = new Map<O['id'], O>()
         options.forEach((c) => cache.set(c.id, c))

         return this.selectOne<O, O['id']>({
            choices: keys,
            getIdFromValue: (v) => v.id,
            getValueFromId: (id) => options.find((c) => c.id === id),
            getOptionFromId: (id) => {
               const option = cache.get(id) ?? null
               if (option == null) return null
               return {
                  // value needs to be injected
                  value: option,
                  // forward all reamining props
                  id: option.id,
                  label: option.label ?? option.id,
                  hue: option.hue,
                  icon: option.icon,
                  labelNode: option.labelNode,
               }
            },
            ...config,
         })
      },

      /**
       * 🔴 UGLY
       *
       * the value is the option itself
       * practical way when you just want to make label, icon, hue, etc
       * on the fly, but still want to access the full object in the end,
       * so you can add some custom properties to the same object, like stuff
       * you'll actually need in the callback.
       */
      selectOneOptionFn<const O extends SelectOptionNoVal<string>>(
         optionsFn: (self: Field_selectOne<O, O['id']>) => O[],
         config: Field_selectOne_config_simplified<O, O['id']> = {},
      ): Z.OneOf<O, O['id']> {
         return this.selectOne<O, O['id']>({
            choices: (self) => optionsFn(self).map((i) => i.id),
            getIdFromValue: (v) => v.id,
            getValueFromId: (id, self) => {
               const options = optionsFn(self)
               if (options == null) console.log(`[‼️ builder.selectOneOptionFn > optionsFn(...) returned undefined] `, id, self.ϟuid, optionsFn.toString(), options) // prettier-ignore
               return options.find((c) => c.id === id)
            },
            getOptionFromId: (id, self) => {
               const options = optionsFn(self)
               const option = options.find((o) => o.id === id) ?? null
               if (option == null) return null
               return {
                  // value needs to be injected
                  value: option,
                  //
                  id: option.id,
                  label: option.label ?? option.id,
                  hue: option.hue,
               }
            },
            ...config,
         })
      },

      /**
       * @since 2024-08-26
       * value is the option id (`option.id`)
       * NO NEED to specify the value in the given options.
       * If you specify the value, it will be IGNORED.
       */
      selectOneOptionId<const O extends SelectOptionNoVal<string>>(
         options: O[] | ((self: Field_selectOne_<NoInfer<O>['id']>) => O[]),
         config: Field_selectOne_config_simplified_<O['id']> = {},
      ): Z.OneOf_<O['id']> {
         type _Field = Field_selectOne_<O['id']>
         function getOptions(field: _Field): O[] {
            if (typeof options === 'function') return options(field)
            return options
         }
         const choices =
            typeof options === 'function' //
               ? (self: _Field): O['id'][] => options(self).map((c) => c.id)
               : options.map((c) => c.id)

         return this.selectOne<O['id'], O['id']>({
            choices,
            getIdFromValue: IDENTITY,
            getValueFromId: (id) => id as O['id'],
            getOptionFromId: (id, field): Maybe<SelectOption_<O['id']>> => {
               const options = getOptions(field)
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
       */
      selectOneOptionValue<const V extends string>(
         options: SelectOption_<V>[],
         config: Field_selectOne_config_simplified_<V> = {},
      ): Z.OneOf_<V> {
         const ids: V[] = options.map((c) => c.id)
         return this.selectOne<V, V>({
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

export const BuilderSelectOneDescriptorsFn = (
   _defaultSelectOneConfig: Partial<Field_selectOne_config<any, any>> = {},
): Record<string, PropertyDescriptor> =>
   Object.getOwnPropertyDescriptors(BuilderSelectOneImpl(_defaultSelectOneConfig))
