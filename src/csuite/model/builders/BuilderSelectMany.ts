import type { FieldTypes } from '../$FieldTypes'
import type {
   Field_selectMany_,
   Field_selectMany_config,
   Field_selectMany_config_simplified,
   Field_selectMany_config_simplified_,
} from '../../fields/selectMany/FieldSelectMany'
import type { SelectKey } from '../../fields/selectOne/SelectOneKey'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../../fields/selectOne/SelectOption'

import { Field_selectMany } from '../../fields/selectMany/FieldSelectMany'
import { removeReadOnly } from '../../utils/removeReadOnly'
import { BaseBuilder } from './BaseBuilder'

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
   Many: HKT<unknown, SelectKey>
   Many_: HKT<SelectKey>
}

export class BuilderSelectMany<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
   static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderSelectMany)

   private _defaultSelectManyConfig: Partial<Field_selectMany_config<any, any>> = {}

   withDefaultSelectManyConfig(conf: Partial<Field_selectMany_config<any, any>>): this {
      this._defaultSelectManyConfig = conf
      return this
   }

   /**
    * this method has all the selectMany capabilities.
    * please, use a simpler variant if you don't need all the features.
    *
    * @see {@link selectManyString}
    * @see {@link selectManyOptions}
    * @see {@link selectManyOptionIds}
    * @see {@link selectManyOptionValues}
    */
   selectMany = <const V, const K extends string>(
      config: Field_selectMany_config<V, K>,
   ): Apply<Schemaᐸ_ᐳ['Many'], V, K> => {
      return this.buildSchema(Field_selectMany<V, K>, {
         default: [],
         ...this._defaultSelectManyConfig,
         ...config,
      })
   }

   /**
    * this method has all the selectMany capabilities.
    * please, use a simpler variant if you don't need all the features.
    *
    * @see {@link selectManyString}
    * @see {@link selectManyOptions}
    * @see {@link selectManyOptionIds}
    * @see {@link selectManyOptionValues}
    */
   selectMany_ = <const V, const K extends string>(
      config: Field_selectMany_config<V, K>,
   ): Apply<Schemaᐸ_ᐳ['Many'], V, K> => {
      return this.buildSchema(Field_selectMany<V, K>, {
         ...this._defaultSelectManyConfig,
         ...config,
      })
   }

   /**
    * simplest way to build a quick enum select,
    * work with both static and dynamic select;
    *
    * @see {@link selectMany} or other variants for more advanced use cases.
    * @since 2024-08-26
    */
   selectManyString = <const K extends string>(
      p: readonly K[],
      config: Field_selectMany_config_simplified_<K> = {},
   ): Apply<Schemaᐸ_ᐳ['Many_'], K> => {
      return this.selectMany({
         choices: removeReadOnly(p),
         getOptionFromId: (id) => ({ id, label: id, value: id }),
         getValueFromId: (id) => id,
         getIdFromValue: (v) => v,
         ...config,
      })
   }

   /** @alias to selectManyString */
   selectManyStrings = this.selectManyString

   /**
    * @since 2024-10-18
    */
   selectManyDynamicStrings = <const K extends string>(
      p: (self: Field_selectMany_<K>) => readonly K[],
      config: Field_selectMany_config_simplified_<K> = {},
   ): Apply<Schemaᐸ_ᐳ['Many_'], K> => {
      return this.selectMany({
         choices: (self) => removeReadOnly(p(self)),
         getOptionFromId: (id) => ({ id, label: id, value: id }),
         getValueFromId: (id) => id,
         getIdFromValue: (v) => v,
         ...config,
      })
   }

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
   ): Apply<Schemaᐸ_ᐳ['Many'], O, O['id']> {
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
   }

   selectManyOptionsFn<const O extends SelectOptionNoVal<string>>(
      optionsFn: (self: Field_selectMany<O, O['id']>) => readonly O[],
      config: Field_selectMany_config_simplified<O, O['id']> = {},
   ): Apply<Schemaᐸ_ᐳ['Many'], O, O['id']> {
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
   }

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
   ): Apply<Schemaᐸ_ᐳ['Many_'], O['id']> {
      const choices = options.map((c) => c.id)
      return this.selectMany<O['id'], O['id']>({
         choices: choices,
         getIdFromValue: (v) => v,
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
   }

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
   ): Apply<Schemaᐸ_ᐳ['Many_'], V> {
      const ids: V[] = options.map((c) => c.id)
      return this.selectMany<V, V>({
         choices: ids,
         getIdFromValue: (v) => v,
         getValueFromId: (id) => id as V,
         getOptionFromId: (id): SelectOption<V, V> => {
            const opt = options.find((c) => c.id === id)
            if (opt == null) return { id, label: id, value: id as V } as SelectOption<V, V>
            return { ...opt, value: id as V }
         }, //
         ...config,
      })
   }
}
