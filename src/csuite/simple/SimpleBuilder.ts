import type { IBuilder } from '../model/IBuilder'
import type { ISchema, SchemaDict } from '../model/ISchema'
import type { OpenRouter_Models } from '../openrouter/OpenRouter_models'
import type { NO_PROPS } from '../types/NO_PROPS'

import { makeAutoObservable } from 'mobx'

import { Widget_bool, type Widget_bool_config } from '../fields/bool/WidgetBool'
import { Widget_button, type Widget_button_config } from '../fields/button/WidgetButton'
import { Widget_choices, type Widget_choices_config } from '../fields/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from '../fields/color/WidgetColor'
import { Widget_group, type Widget_group_config } from '../fields/group/WidgetGroup'
import { Widget_link } from '../fields/link/WidgetLink'
import { Widget_list, type Widget_list_config } from '../fields/list/WidgetList'
import { Widget_markdown, Widget_markdown_config } from '../fields/markdown/WidgetMarkdown'
import { Widget_matrix, type Widget_matrix_config } from '../fields/matrix/WidgetMatrix'
import { Widget_number, type Widget_number_config } from '../fields/number/WidgetNumber'
import { Widget_optional, type Widget_optional_config } from '../fields/optional/WidgetOptional'
import { Widget_seed, type Widget_seed_config } from '../fields/seed/WidgetSeed'
import { Widget_selectMany, type Widget_selectMany_config } from '../fields/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Widget_selectOne, type Widget_selectOne_config } from '../fields/selectOne/WidgetSelectOne'
import { Widget_shared } from '../fields/shared/WidgetShared'
import { Widget_size, type Widget_size_config } from '../fields/size/WidgetSize'
import { Widget_string, type Widget_string_config } from '../fields/string/WidgetString'
import { Field } from '../model/Field'
import { openRouterInfos } from '../openrouter/OpenRouter_infos'
import { SimpleSchema } from './SimpleSchema'

export class SimpleBuilder implements IBuilder {
    constructor() {
        makeAutoObservable(this, {})
    }

    time(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'time', ...config })
    }

    date(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'date', ...config })
    }

    datetime(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'datetime-local', ...config })
    }

    password(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'password', ...config })
    }

    email(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'email', ...config })
    }

    url(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'url', ...config })
    }

    string(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', config)
    }

    text(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', config)
    }

    textarea(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { textarea: true, ...config })
    }

    boolean(config: Widget_bool_config = {}): S.SBool {
        return new SimpleSchema<Widget_bool>(Widget_bool, 'bool', config)
    }

    bool(config: Widget_bool_config = {}): S.SBool {
        return new SimpleSchema<Widget_bool>(Widget_bool, 'bool', config)
    }

    size(config: Widget_size_config = {}): S.SSize {
        return new SimpleSchema<Widget_size>(Widget_size, 'size', config)
    }

    seed(config: Widget_seed_config = {}): S.SSeed {
        return new SimpleSchema<Widget_seed>(Widget_seed, 'seed', config)
    }

    color(config: Widget_color_config = {}): S.SColor {
        return new SimpleSchema<Widget_color>(Widget_color, 'color', config)
    }

    colorV2(config: Widget_string_config = {}): S.SString {
        return new SimpleSchema<Widget_string>(Widget_string, 'str', { inputType: 'color', ...config })
    }

    matrix(config: Widget_matrix_config): S.SMatrix {
        return new SimpleSchema<Widget_matrix>(Widget_matrix, 'matrix', config)
    }

    button<K>(config: Widget_button_config): S.SButton<K> {
        return new SimpleSchema<Widget_button<K>>(Widget_button, 'button', config)
    }

    /** variants: `header` */
    markdown(config: Widget_markdown_config | string): S.SMarkdown {
        return new SimpleSchema<Widget_markdown>(
            Widget_markdown,
            'markdown',
            typeof config === 'string' ? { markdown: config } : config,
        )
    }
    /** [markdown variant]: inline=true, label=false */
    header(config: Widget_markdown_config | string): S.SMarkdown {
        return new SimpleSchema<Widget_markdown>(
            Widget_markdown,
            'markdown',
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, justifyLabel: false, ...config },
        )
    }

    int(config: Omit<Widget_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Widget_number>(Widget_number, 'number', { mode: 'int', ...config })
    }

    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent(config: Omit<Widget_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Widget_number>(Widget_number, 'number', {
            mode: 'int',
            default: 100,
            step: 10,
            min: 1,
            max: 100,
            suffix: '%',
            ...config,
        })
    }

    float(config: Omit<Widget_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Widget_number>(Widget_number, 'number', { mode: 'float', ...config })
    }

    number(config: Omit<Widget_number_config, 'mode'> = {}): S.SNumber {
        return new SimpleSchema<Widget_number>(Widget_number, 'number', { mode: 'float', ...config })
    }

    list<const T extends ISchema>(config: Widget_list_config<T>): S.SList<T> {
        return new SimpleSchema<Widget_list<T>>(Widget_list, 'list', config)
    }

    selectOne<const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>): S.SSelectOne<T> {
        return new SimpleSchema<Widget_selectOne<T>>(Widget_selectOne, 'selectOne', config)
    }

    selectOneV2(p: string[]): S.SSelectOne<BaseSelectEntry> {
        return new SimpleSchema<Widget_selectOne<BaseSelectEntry>>(Widget_selectOne, 'selectOne', {
            choices: p.map((id) => ({ id, label: id })),
            appearance: 'tab',
        })
    }

    selectOneV3<T extends string>(
        p: T[],
        config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): S.SSelectOne_<T> {
        return new SimpleSchema<Widget_selectOne<BaseSelectEntry<T>>>(Widget_selectOne, 'selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }

    selectMany<const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>): S.SSelectMany<T> {
        return new SimpleSchema<Widget_selectMany<T>>(Widget_selectMany, 'selectMany', config)
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
        return new SimpleSchema<Widget_link<SCHEMA1, SCHEMA2>>(Widget_link, 'link', { share: injected, children })
    }

    linked<T extends Field>(field: T): S.SShared<T> {
        return new SimpleSchema<Widget_shared<T>>(Widget_shared<any>, 'shared', { widget: field })
    }

    /** see also: `fields` for a more practical api */
    group<const T extends SchemaDict>(config: Widget_group_config<T> = {}): S.SGroup<T> {
        return new SimpleSchema<Widget_group<T>>(Widget_group, 'group', config)
    }

    fields<const T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}): S.SGroup<T> {
        return new SimpleSchema<Widget_group<T>>(Widget_group, 'group', { items: fields, ...config })
    }

    choice<const T extends SchemaDict>(config: Omit<Widget_choices_config<T>, 'multi'>): S.SChoices<T> {
        return new SimpleSchema<Widget_choices<T>>(Widget_choices<any>, 'choices', { multi: false, ...config })
    }

    choices<const T extends SchemaDict>(config: Omit<Widget_choices_config<T>, 'multi'>): S.SChoices<T> {
        return new SimpleSchema<Widget_choices<T>>(Widget_choices<any>, 'choices', { multi: true, ...config })
    }

    empty = (config: Widget_group_config<NO_PROPS> = {}): S.SEmpty => {
        return new SimpleSchema<Widget_group<NO_PROPS>>(Widget_group, 'group', config)
    }

    /** simple choice alternative api */
    tabs<const T extends SchemaDict>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ) {
        return new SimpleSchema<Widget_choices<T>>(Widget_choices, 'choices', {
            items,
            multi: false,
            ...config,
            appearance: 'tab',
        })
    }

    // optional wrappers
    optional<const T extends ISchema>(p: Widget_optional_config<T>): S.SOptional<T> {
        return new SimpleSchema<Widget_optional<T>>(Widget_optional, 'optional', p)
    }

    llmModel(p: { default?: OpenRouter_Models } = {}) {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = p.default ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

    /** (@internal); */ _cache: { count: number } = { count: 0 }
}
