import type {
    Field_selectMany_config,
    Field_selectMany_config_simplified,
    Field_selectMany_config_simplified_,
} from '../csuite/fields/selectMany/FieldSelectMany'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../csuite/fields/selectOne/SelectOption'

import { Field_selectMany } from '../csuite/fields/selectMany/FieldSelectMany'
import { Schema } from './Schema'

/**
 * SelectManyBuilder allow to centralize every selectMany method
 *
 * 💬 2024-08-26 rvion: TODO:
 * | use some  rank-2 polymorphism to allow the user to pass
 * | the custom schema to build. for now, the cushy `Schema` class
 * | is used, making that class not reusable in other contexts.
 * | ping @Globidev
 *
 */
export class SelectManyBuilder {
    /**
     * this method has all the selectMany capabilities.
     * please, use a simpler variant if you don't need all the features.
     *
     * @see {@link selectManyString}
     * @see {@link selectManyOptions}
     * @see {@link selectManyOptionIds}
     * @see {@link selectManyOptionValues}
     */
    selectMany = <const VALUE, const KEY extends string>(
        config: Field_selectMany_config<VALUE, KEY>,
    ): X.XSelectMany<VALUE, KEY> => {
        return new Schema<Field_selectMany<VALUE, KEY>>(Field_selectMany, config)
    }

    /**
     * simplest way to build a quick enum select,
     * work with both static and dynamic select;
     *
     * @see {@link selectMany} or other variants for more advanced use cases.
     * @since 2024-08-26
     */
    selectManyString = <const KEY extends string>(
        p: KEY[],
        config: Field_selectMany_config_simplified_<KEY> = {},
    ): X.XSelectMany_<KEY> => {
        return new Schema<Field_selectMany<KEY, KEY>>(Field_selectMany, {
            choices: p,
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
    selectManyOptions<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[],
        config: Field_selectMany_config_simplified<OptionLike, OptionLike['id']> = {},
    ): X.XSelectMany<OptionLike, OptionLike['id']> {
        const keys: OptionLike['id'][] = options.map((c) => c.id)
        return this.selectMany<OptionLike, OptionLike['id']>({
            choices: keys,
            getIdFromValue: (v) => v.id,
            getValueFromId: (id) => options.find((c) => c.id === id) ?? null,
            getOptionFromId: (id): Maybe<SelectOption<OptionLike, OptionLike['id']>> => {
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

    /**
     * @since 2024-08-26
     * value is the option id (`option.id`)
     * NO NEED to specify the value in the given options.
     * If you specify the value, it will be IGNORED.
     *
     * @see {@link selectMany} or other variants for more advanced use cases.
     * @since 2024-08-26
     */
    selectManyOptionIds<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[],
        config: Field_selectMany_config_simplified_<OptionLike['id']> = {},
    ): X.XSelectMany_<OptionLike['id']> {
        const choices = options.map((c) => c.id)
        return this.selectMany<OptionLike['id'], OptionLike['id']>({
            choices: choices,
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as OptionLike['id'],
            getOptionFromId: (id): Maybe<SelectOption_<OptionLike['id']>> => {
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
    selectManyOptionValues<const VALUE extends string>(
        options: SelectOption_<VALUE>[],
        config: Field_selectMany_config_simplified_<VALUE> = {},
    ): X.XSelectMany_<VALUE> {
        const ids: VALUE[] = options.map((c) => c.id)
        return this.selectMany<VALUE, VALUE>({
            choices: ids,
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as VALUE,
            getOptionFromId: (id): SelectOption<VALUE, VALUE> => {
                const opt = options.find((c) => c.id === id)
                if (opt == null) return { id, label: id, value: id as VALUE } as SelectOption<VALUE, VALUE>
                return { ...opt, value: id as VALUE }
            }, //
            ...config,
        })
    }
}
