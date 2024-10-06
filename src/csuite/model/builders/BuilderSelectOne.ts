import type { FieldTypes } from '../$FieldTypes'
import type {
    Field_selectOne_config,
    Field_selectOne_config_simplified,
    Field_selectOne_config_simplified_,
} from '../../fields/selectOne/FieldSelectOne'
import type { SelectKey } from '../../fields/selectOne/SelectOneKey'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../../fields/selectOne/SelectOption'

import { Field_selectOne } from '../../fields/selectOne/FieldSelectOne'
import { makeLabelFromPrimitiveValue } from '../../utils/makeLabelFromFieldName'
import { BaseBuilder } from './BaseBuilder'

type Field_selectOne_<V extends SelectKey> = Field_selectOne<V, V>

interface SchemaAndAliasesᐸ_ᐳ extends HKT<FieldTypes> {
    OneOf: HKT<unknown, SelectKey>
    OneOf_: HKT<SelectKey>
}

export class BuilderSelectOne<Schemaᐸ_ᐳ extends SchemaAndAliasesᐸ_ᐳ> extends BaseBuilder<Schemaᐸ_ᐳ> {
    static fromSchemaClass = BaseBuilder.buildfromSchemaClass(BuilderSelectOne)

    private _defaultSelectOneConfig: Partial<Field_selectOne_config<any, any>> = {}

    withDefaultSelectOneConfig(conf: Partial<Field_selectOne_config<any, any>>): this {
        this._defaultSelectOneConfig = conf
        return this
    }

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
    ): Apply<Schemaᐸ_ᐳ['OneOf'], VALUE, KEY> {
        return this.buildSchema(Field_selectOne<VALUE, KEY>, {
            ...this._defaultSelectOneConfig,
            ...config,
        })
    }

    /** generic selectOne, defaulting to first choices when choices is an array. */
    selectOne<V, K extends SelectKey>(
        //
        config: Field_selectOne_config<V, K>,
    ): Apply<Schemaᐸ_ᐳ['OneOf'], V, K> {
        const def = Array.isArray(config.choices) ? config.choices[0] : undefined
        return this.selectOne_<V, K>({
            default: def,
            ...config,
        })
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
    selectOneString<const VALUE extends SelectKey>(
        choices: readonly VALUE[] | (() => VALUE[]),
        config: Field_selectOne_config_simplified_<VALUE> = {},
    ): Apply<Schemaᐸ_ᐳ['OneOf_'], VALUE> {
        return this.selectOne<VALUE, VALUE>({
            choices: choices as VALUE[] | (() => VALUE[]),
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as VALUE,
            getOptionFromId: (id) => ({ id, label: makeLabelFromPrimitiveValue(id), value: id as VALUE }),
            ...config,
        })
    }

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
    ): Apply<Schemaᐸ_ᐳ['OneOf_'], VALUE> {
        return this.selectOne_<VALUE, VALUE>({
            choices: choices as VALUE[] | (() => VALUE[]),
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as VALUE,
            getOptionFromId: (id) => ({
                id,
                label: id != null ? makeLabelFromPrimitiveValue(id) : '--',
                value: id as VALUE,
            }),
            ...config,
        })
    }

    selectOneStringFn<VALUE extends SelectKey>(
        choices: (self: Field_selectOne_<VALUE>) => VALUE[],
        config: Field_selectOne_config_simplified_<VALUE> = {},
    ): Apply<Schemaᐸ_ᐳ['OneOf_'], VALUE> {
        return this.selectOne<VALUE, VALUE>({
            choices,
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id,
            getOptionFromId: (id) => ({ id, label: makeLabelFromPrimitiveValue(id), value: id }),
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
    selectOneOption<const O extends SelectOptionNoVal<string>>(
        options: readonly O[] /* | ((self: X.SelectOne<O, O['id']>) => O[]) */,
        config: Field_selectOne_config_simplified<O, O['id']> = {},
    ): Apply<Schemaᐸ_ᐳ['OneOf'], O, O['id']> {
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
    selectOneOptionFn<const O extends SelectOptionNoVal<string>>(
        optionsFn: (self: Field_selectOne<O, O['id']>) => O[],
        config: Field_selectOne_config_simplified<O, O['id']> = {},
    ): Apply<Schemaᐸ_ᐳ['OneOf'], O, O['id']> {
        return this.selectOne<O, O['id']>({
            choices: (self) => optionsFn(self).map((i) => i.id),
            getIdFromValue: (v) => v.id,
            getValueFromId: (id, self) => optionsFn(self).find((c) => c.id === id),
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
    selectOneOptionId<const O extends SelectOptionNoVal<string>>(
        options: O[] | ((self: Field_selectOne_<NoInfer<O>['id']>) => O[]),
        config: Field_selectOne_config_simplified_<O['id']> = {},
    ): Apply<Schemaᐸ_ᐳ['OneOf_'], O['id']> {
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
            getIdFromValue: (v) => v,
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
    }

    /**
     * @since 2024-08-26
     * value is the option value
     * you NEED to specify the value in the given options.
     */
    selectOneOptionValue<const V extends string>(
        options: SelectOption_<V>[],
        config: Field_selectOne_config_simplified_<V> = {},
    ): Apply<Schemaᐸ_ᐳ['OneOf_'], V> {
        const ids: V[] = options.map((c) => c.id)
        return this.selectOne<V, V>({
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
