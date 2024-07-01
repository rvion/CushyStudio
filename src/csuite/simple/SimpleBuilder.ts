import type { IBuilder } from '../model/IBuilder'
import type { ISchema, SchemaDict } from '../model/ISchema'
import type { OpenRouter_Models } from '../openrouter/OpenRouter_models'
import type { NO_PROPS } from '../types/NO_PROPS'

import { makeAutoObservable } from 'mobx'

import { Field_bool, type Field_bool_config } from '../fields/bool/WidgetBool'
import { Field_button, type Field_button_config } from '../fields/button/WidgetButton'
import { Field_choices, type Field_choices_config } from '../fields/choices/WidgetChoices'
import { Field_color, type Field_color_config } from '../fields/color/WidgetColor'
import { Field_group, type Field_group_config } from '../fields/group/WidgetGroup'
import { Field_link } from '../fields/link/WidgetLink'
import { Field_list, type Field_list_config } from '../fields/list/WidgetList'
import { Field_markdown, Field_markdown_config } from '../fields/markdown/WidgetMarkdown'
import { Field_matrix, type Field_matrix_config } from '../fields/matrix/WidgetMatrix'
import { Field_number, type Field_number_config } from '../fields/number/WidgetNumber'
import { Field_optional, type Field_optional_config } from '../fields/optional/WidgetOptional'
import { Field_seed, type Field_seed_config } from '../fields/seed/WidgetSeed'
import { Field_selectMany, type Field_selectMany_config } from '../fields/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Field_selectOne, type Field_selectOne_config } from '../fields/selectOne/WidgetSelectOne'
import { Field_shared } from '../fields/shared/WidgetShared'
import { Field_size, type Field_size_config } from '../fields/size/WidgetSize'
import { Field_string, type Field_string_config } from '../fields/string/WidgetString'
import { Field } from '../model/Field'
import { openRouterInfos } from '../openrouter/OpenRouter_infos'
import { SimpleSchema } from './SimpleSchema'

export class SimpleBuilder implements IBuilder {
    constructor() {
        makeAutoObservable(this, {})
    }

    time(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'time', ...config })
    }

    date(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'date', ...config })
    }

    datetime(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'datetime-local', ...config })
    }

    password(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'password', ...config })
    }

    email(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'email', ...config })
    }

    url(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'url', ...config })
    }

    string(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', config)
    }

    text(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', config)
    }

    textarea(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { textarea: true, ...config })
    }

    boolean(config: Field_bool_config = {}): S.SBool {
        return new SimpleSchema<Field_bool>(Field_bool, 'bool', config)
    }

    bool(config: Field_bool_config = {}): S.SBool {
        return new SimpleSchema<Field_bool>(Field_bool, 'bool', config)
    }

    size(config: Field_size_config = {}): S.SSize {
        return new SimpleSchema<Field_size>(Field_size, 'size', config)
    }

    seed(config: Field_seed_config = {}): S.SSeed {
        return new SimpleSchema<Field_seed>(Field_seed, 'seed', config)
    }

    color(config: Field_color_config = {}): S.SColor {
        return new SimpleSchema<Field_color>(Field_color, 'color', config)
    }

    colorV2(config: Field_string_config = {}): S.SString {
        return new SimpleSchema<Field_string>(Field_string, 'str', { inputType: 'color', ...config })
    }

    matrix(config: Field_matrix_config): S.SMatrix {
        return new SimpleSchema<Field_matrix>(Field_matrix, 'matrix', config)
    }

    button<K>(config: Field_button_config): S.SButton<K> {
        return new SimpleSchema<Field_button<K>>(Field_button, 'button', config)
    }

    /** variants: `header` */
    markdown(config: Field_markdown_config | string): S.SMarkdown {
        return new SimpleSchema<Field_markdown>(
            Field_markdown,
            'markdown',
            typeof config === 'string' ? { markdown: config } : config,
        )
    }
    /** [markdown variant]: inline=true, label=false */
    header(config: Field_markdown_config | string): S.SMarkdown {
        return new SimpleSchema<Field_markdown>(
            Field_markdown,
            'markdown',
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, justifyLabel: false, ...config },
        )
    }

    int(config: Omit<Field_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Field_number>(Field_number, 'number', { mode: 'int', ...config })
    }

    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent(config: Omit<Field_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Field_number>(Field_number, 'number', {
            mode: 'int',
            default: 100,
            step: 10,
            min: 1,
            max: 100,
            suffix: '%',
            ...config,
        })
    }

    float(config: Omit<Field_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Field_number>(Field_number, 'number', { mode: 'float', ...config })
    }

    number(config: Omit<Field_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Field_number>(Field_number, 'number', { mode: 'float', ...config })
    }

    list<const T extends ISchema>(config: Field_list_config<T>): S.SList<T> {
        return new SimpleSchema<Field_list<T>>(Field_list, 'list', config)
    }

    selectOne<const T extends BaseSelectEntry>(config: Field_selectOne_config<T>): S.SSelectOne<T> {
        return new SimpleSchema<Field_selectOne<T>>(Field_selectOne, 'selectOne', config)
    }

    selectOneV2(p: string[]): S.SSelectOne<BaseSelectEntry> {
        return new SimpleSchema<Field_selectOne<BaseSelectEntry>>(Field_selectOne, 'selectOne', {
            choices: p.map((id) => ({ id, label: id })),
            appearance: 'tab',
        })
    }

    selectOneV3<T extends string>(
        p: T[],
        config: Omit<Field_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): S.SSelectOne_<T> {
        return new SimpleSchema<Field_selectOne<BaseSelectEntry<T>>>(Field_selectOne, 'selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }

    selectMany<const T extends BaseSelectEntry>(config: Field_selectMany_config<T>): S.SSelectMany<T> {
        return new SimpleSchema<Field_selectMany<T>>(Field_selectMany, 'selectMany', config)
    }

    /**
     * Allow to instanciate a field early, so you can re-use it in multiple places
     * or access it's instance to dynamically change some other field schema.
     *
     * @since 2024-06-27
     * @stability unstable
     */
    with<const SCHEMA1 extends ISchema, SCHEMA2 extends ISchema>(
        /** the schema of the field you'll want to re-use the in second part */
        injected: SCHEMA1,
        children: (shared: SCHEMA1['$Field']) => SCHEMA2,
    ): S.SLink<SCHEMA1, SCHEMA2> {
        return new SimpleSchema<Field_link<SCHEMA1, SCHEMA2>>(Field_link, 'link', { share: injected, children })
    }

    linked<T extends Field>(field: T): S.SShared<T> {
        return new SimpleSchema<Field_shared<T>>(Field_shared<any>, 'shared', { field })
    }

    /** see also: `fields` for a more practical api */
    group<const T extends SchemaDict>(config: Field_group_config<T> = {}): S.SGroup<T> {
        return new SimpleSchema<Field_group<T>>(Field_group, 'group', config)
    }

    fields<const T extends SchemaDict>(fields: T, config: Omit<Field_group_config<T>, 'items'> = {}): S.SGroup<T> {
        return new SimpleSchema<Field_group<T>>(Field_group, 'group', { items: fields, ...config })
    }

    choice<const T extends SchemaDict>(config: Omit<Field_choices_config<T>, 'multi'>): S.SChoices<T> {
        return new SimpleSchema<Field_choices<T>>(Field_choices<any>, 'choices', { multi: false, ...config })
    }

    choices<const T extends SchemaDict>(config: Omit<Field_choices_config<T>, 'multi'>): S.SChoices<T> {
        return new SimpleSchema<Field_choices<T>>(Field_choices<any>, 'choices', { multi: true, ...config })
    }

    empty = (config: Field_group_config<NO_PROPS> = {}): S.SEmpty => {
        return new SimpleSchema<Field_group<NO_PROPS>>(Field_group, 'group', config)
    }

    /** simple choice alternative api */
    tabs<const T extends SchemaDict>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<T>, 'multi' | 'items'> = {},
    ) {
        return new SimpleSchema<Field_choices<T>>(Field_choices, 'choices', {
            items,
            multi: false,
            ...config,
            appearance: 'tab',
        })
    }

    // optional wrappers
    optional<const T extends ISchema>(p: Field_optional_config<T>): S.SOptional<T> {
        return new SimpleSchema<Field_optional<T>>(Field_optional, 'optional', p)
    }

    llmModel(p: { default?: OpenRouter_Models } = {}) {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = p.default ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

    /** (@internal); */ _cache: { count: number } = { count: 0 }
}
