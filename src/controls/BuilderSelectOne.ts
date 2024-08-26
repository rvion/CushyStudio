import type { Field_selectOne_config, Field_selectOne_config_ } from '../csuite/fields/selectOne/FieldSelectOne'
import type { SelectOption, SelectOption_, SelectOptionNoVal } from '../csuite/fields/selectOne/SelectOption'
import type { PartialOmit } from '../types/Misc'

import { Field_selectOne } from '../csuite/fields/selectOne/FieldSelectOne'
import { Schema } from './Schema'

// Interface just for documentation purposes for now
// prettier-ignore
export interface ISelectOneBuilder {
    selectOne<VALUE, KEY extends string = string>(
        config: Field_selectOne_config<VALUE, KEY>,
    ): X.XSelectOne<VALUE, KEY>

    selectOneString<const VALUE extends string>(
        choices: readonly VALUE[] | (() => VALUE[]),
    ): X.XSelectOne_<VALUE>

    selectOneOptionValue<const VALUE extends string>(
        options: SelectOption<VALUE, VALUE>[],
    ): X.XSelectOne_<VALUE>

    selectOneOptionId<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[],
    ): X.XSelectOne_<OptionLike['id']>

    selectOneOption<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[],
    ): X.XSelectOne<OptionLike, OptionLike['id']>
}

export class SelectOneBuilder implements ISelectOneBuilder {
    selectOne<VALUE, KEY extends string = string>(config: Field_selectOne_config<VALUE, KEY>): X.XSelectOne<VALUE, KEY> {
        return new Schema<Field_selectOne<VALUE, KEY>>(Field_selectOne<VALUE, KEY>, config)
    }

    selectOneString<const VALUE extends string>(
        choices: readonly VALUE[] | (() => VALUE[]),
        config: PartialOmit<
            Field_selectOne_config<VALUE, VALUE>,
            'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
        > = {},
    ): X.XSelectOne_<VALUE> {
        return this.selectOne<VALUE, VALUE>({
            choices: choices as VALUE[],
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as VALUE,
            getOptionFromId: (id) => ({ id, label: id, value: id as VALUE }),
            ...config,
        })
    }

    selectOneOptionValue<const VALUE extends string>(
        options: SelectOption<VALUE, VALUE>[],
        config: PartialOmit<
            Field_selectOne_config<VALUE, VALUE>,
            'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
        > = {},
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

    selectOneOptionId<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[],
        config: PartialOmit<
            Field_selectOne_config_<OptionLike['id']>,
            'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
        > = {},
    ): X.XSelectOne_<OptionLike['id']> {
        const choices = options.map((c) => c.id)
        return this.selectOne<OptionLike['id'], OptionLike['id']>({
            choices: choices,
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
            getIdFromValue: (v) => v,
            getValueFromId: (id) => id as OptionLike['id'],
            ...config,
        })
    }

    selectOneOption<const OptionLike extends SelectOptionNoVal<string>>(
        options: readonly OptionLike[],
        config: PartialOmit<
            Field_selectOne_config<OptionLike, OptionLike['id']>,
            'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'
        > = {},
    ): X.XSelectOne<OptionLike, OptionLike['id']> {
        const keys: OptionLike['id'][] = options.map((c) => c.id)
        return this.selectOne<OptionLike, OptionLike['id']>({
            choices: keys,
            getOptionFromId: (id): Maybe<SelectOption<OptionLike, OptionLike['id']>> => {
                // 2024-08-02 domi: could probably include a cache
                // see also notes on `SelectOneConfig.serial.extra`
                // see also notes on `selectOneStringFn` usage in `prefab_prql_query.tsx`
                const option = options.find((c) => c.id === id)
                if (!option) return null
                return { id: option.id, label: option.label ?? option.id, value: option, hue: option.hue }
            },
            getIdFromValue: (v) => v.id,
            getValueFromId: (id) => options.find((c) => c.id === id) ?? null,
            ...config,
        })
    }
}
