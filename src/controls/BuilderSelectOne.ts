import type {
    Field_selectOne_config,
    Field_selectOne_config_simplified,
    Field_selectOne_config_simplified_,
} from '../csuite/fields/selectOne/FieldSelectOne'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../csuite/fields/selectOne/SelectOption'

import { Field_selectOne } from '../csuite/fields/selectOne/FieldSelectOne'
import { CushySchema } from './Schema'

/**
 * SelectOneBuilder allow to centralize every selectOne method
 *
 * 💬 2024-08-26 rvion: TODO:
 * | use some  rank-2 polymorphism to allow the user to pass
 * | the custom schema to build. for now, the cushy `Schema` class
 * | is used, making that class not reusable in other contexts.
 * | ping @Globidev
 *
 */
export class SelectOneBuilder {
    /**
     * this method has all the selectOne capabilities.
     * please, use a simpler variant if you don't need all the features.
     *
     * @see {@link selectOneString}
     * @see {@link selectOneOption}
     * @see {@link selectOneOptionId}
     * @see {@link selectOneOptionValue}
     */
    selectOne<VALUE, KEY extends string = string>(config: Field_selectOne_config<VALUE, KEY>): X.XSelectOne<VALUE, KEY> {
        return new CushySchema<Field_selectOne<VALUE, KEY>>(Field_selectOne<VALUE, KEY>, config)
    }

    /**
     * simplest way to build a quick enum select,
     * work with both static and dynamic select;
     *
     * @since 2024-08-26
     *
     * 👉 if you use dyanmic selections, just make sure
     * there is at least one value in the array.
     */
    selectOneString<const VALUE extends string>(
        choices: readonly VALUE[] | (() => VALUE[]),
        config: Field_selectOne_config_simplified_<VALUE> = {},
    ): X.XSelectOne_<VALUE> {
        return this.selectOne<VALUE, VALUE>({
            choices: choices as VALUE[],
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as VALUE,
            getOptionFromId: (id) => ({ id, label: id, value: id as VALUE }),
            ...config,
        })
    }

    /**
     * the value is the option itself
     * practical way when you just want to make label, icon, hue, etc
     * on the fly, but still want to access the full object in the end,
     * so you can add some custom properties to the same object, like stuff
     * you'll actually need in the callback.
     */
    selectOneOption<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[] /* | ((self: X.SelectOne<OptionLike, OptionLike['id']>) => OptionLike[]) */,
        config: Field_selectOne_config_simplified<OptionLike, OptionLike['id']> = {},
    ): X.XSelectOne<OptionLike, OptionLike['id']> {
        // precompute key list
        const keys: OptionLike['id'][] = options.map((c) => c.id)

        // precompute key-to-option map
        const cache = new Map<OptionLike['id'], OptionLike>()
        options.forEach((c) => cache.set(c.id, c))

        return this.selectOne<OptionLike, OptionLike['id']>({
            choices: keys,
            getIdFromValue: (v) => v.id,
            getValueFromId: (id) => options.find((c) => c.id === id) ?? null,
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
    }

    /**
     * 🔴 UGLY
     *
     * the value is the option itself
     * practical way when you just want to make label, icon, hue, etc
     * on the fly, but still want to access the full object in the end,
     * so you can add some custom properties to the same object, like stuff
     * you'll actually need in the callback.
     */
    selectOneOptionFn<const OptionLike extends SelectOptionNoVal<string>>(
        optionsFn: (self: X.SelectOne<OptionLike, OptionLike['id']>) => OptionLike[],
        config: Field_selectOne_config_simplified<OptionLike, OptionLike['id']> = {},
    ): X.XSelectOne<OptionLike, OptionLike['id']> {
        return this.selectOne<OptionLike, OptionLike['id']>({
            choices: (self) => optionsFn(self).map((i) => i.id),
            getIdFromValue: (v) => v.id,
            getValueFromId: (id, self) => optionsFn(self).find((c) => c.id === id) ?? null,
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
    }

    /**
     * @since 2024-08-26
     * value is the option id (`option.id`)
     * NO NEED to specify the value in the given options.
     * If you specify the value, it will be IGNORED.
     */
    selectOneOptionId<const OptionLike extends SelectOptionNoVal<string>>(
        options: OptionLike[] | ((self: X.SelectOne_<NoInfer<OptionLike>['id']>) => OptionLike[]),
        config: Field_selectOne_config_simplified_<OptionLike['id']> = {},
    ): X.XSelectOne_<OptionLike['id']> {
        type _Field = X.SelectOne_<OptionLike['id']>
        function getOptions(field: _Field): OptionLike[] {
            if (typeof options === 'function') return options(field)
            return options
        }
        const choices =
            typeof options === 'function' //
                ? (self: _Field): OptionLike['id'][] => options(self).map((c) => c.id)
                : options.map((c) => c.id)

        return this.selectOne<OptionLike['id'], OptionLike['id']>({
            choices,
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as OptionLike['id'],
            getOptionFromId: (id, field): Maybe<SelectOption_<OptionLike['id']>> => {
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
    }

    /**
     * @since 2024-08-26
     * value is the option value
     * you NEED to specify the value in the given options.
     */
    selectOneOptionValue<const VALUE extends string>(
        options: SelectOption_<VALUE>[],
        config: Field_selectOne_config_simplified_<VALUE> = {},
    ): X.XSelectOne_<VALUE> {
        const ids: VALUE[] = options.map((c) => c.id)
        return this.selectOne<VALUE, VALUE>({
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
