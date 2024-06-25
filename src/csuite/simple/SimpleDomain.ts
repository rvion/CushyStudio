import type { BaseField } from '../model/BaseField'
import type { IBlueprint, SchemaDict } from '../model/IBlueprint'
import type { Domain } from '../model/IDomain'
import type { Model } from '../model/Model'
import type { OpenRouter_Models } from '../openrouter/OpenRouter_models'
import type * as SS from './SimpleSpecAliases'

import { makeAutoObservable, reaction } from 'mobx'

import { Widget_bool, type Widget_bool_config } from '../fields/bool/WidgetBool'
import { Widget_button, type Widget_button_config } from '../fields/button/WidgetButton'
import { Widget_choices, type Widget_choices_config } from '../fields/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from '../fields/color/WidgetColor'
import { Widget_group, type Widget_group_config } from '../fields/group/WidgetGroup'
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
import { Widget_spacer } from '../fields/spacer/WidgetSpacer'
import { Widget_string, type Widget_string_config } from '../fields/string/WidgetString'
import { openRouterInfos } from '../openrouter/OpenRouter_infos'
import { SimpleBlueprint } from './SimpleBlueprint'

// -------------------------------------------------------------------------------------------
export class SimpleDomain implements Domain {
    /** (@internal) DO NOT USE YOURSELF */
    SpecCtor = SimpleBlueprint

    /** (@internal) don't call this yourself */
    constructor(public form: Model<IBlueprint, SimpleDomain>) {
        makeAutoObservable(this, {
            SpecCtor: false,
        })
    }

    time(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'time', ...config })
    }

    date(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'date', ...config })
    }

    datetime(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'datetime-local', ...config })
    }

    password(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'password', ...config })
    }

    email(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'email', ...config })
    }

    url(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'url', ...config })
    }

    string(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', config)
    }

    text(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', config)
    }

    textarea(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { textarea: true, ...config })
    }

    boolean(config: Widget_bool_config = {}): SS.SBool {
        return new SimpleBlueprint<Widget_bool>('bool', config)
    }

    bool(config: Widget_bool_config = {}): SS.SBool {
        return new SimpleBlueprint<Widget_bool>('bool', config)
    }

    size(config: Widget_size_config = {}): SS.SSize {
        return new SimpleBlueprint<Widget_size>('size', config)
    }

    seed(config: Widget_seed_config = {}): SS.SSeed {
        return new SimpleBlueprint<Widget_seed>('seed', config)
    }

    color(config: Widget_color_config = {}): SS.SColor {
        return new SimpleBlueprint<Widget_color>('color', config)
    }

    colorV2(config: Widget_string_config = {}): SS.SString {
        return new SimpleBlueprint<Widget_string>('str', { inputType: 'color', ...config })
    }

    matrix(config: Widget_matrix_config): SS.SMatrix {
        return new SimpleBlueprint<Widget_matrix>('matrix', config)
    }

    button<K>(config: Widget_button_config): SS.SButton<K> {
        return new SimpleBlueprint<Widget_button<K>>('button', config)
    }

    /** variants: `header` */
    markdown(config: Widget_markdown_config | string): SS.SMarkdown {
        return new SimpleBlueprint<Widget_markdown>('markdown', typeof config === 'string' ? { markdown: config } : config)
    }
    /** [markdown variant]: inline=true, label=false */
    header(config: Widget_markdown_config | string): SS.SMarkdown {
        return new SimpleBlueprint<Widget_markdown>(
            'markdown',
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, justifyLabel: false, ...config },
        )
    }

    int(config: Omit<Widget_number_config, 'mode'> = {}): SS.SNumber {
        return new SimpleBlueprint<Widget_number>('number', { mode: 'int', ...config })
    }

    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent(config: Omit<Widget_number_config, 'mode'> = {}): SS.SNumber {
        return new SimpleBlueprint<Widget_number>('number', {
            mode: 'int',
            default: 100,
            step: 10,
            min: 1,
            max: 100,
            suffix: '%',
            ...config,
        })
    }

    float(config: Omit<Widget_number_config, 'mode'> = {}): SS.SNumber {
        return new SimpleBlueprint<Widget_number>('number', { mode: 'float', ...config })
    }

    number(config: Omit<Widget_number_config, 'mode'> = {}): SS.SNumber {
        return new SimpleBlueprint<Widget_number>('number', { mode: 'float', ...config })
    }

    list<const T extends IBlueprint>(config: Widget_list_config<T>): SS.SList<T> {
        return new SimpleBlueprint<Widget_list<T>>('list', config)
    }

    selectOne<const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>): SS.SSelectOne<T> {
        return new SimpleBlueprint<Widget_selectOne<T>>('selectOne', config)
    }

    selectOneV2(p: string[]): SS.SSelectOne<BaseSelectEntry> {
        return new SimpleBlueprint<Widget_selectOne<BaseSelectEntry>>('selectOne', {
            choices: p.map((id) => ({ id, label: id })),
            appearance: 'tab',
        })
    }

    selectOneV3<T extends string>(
        p: T[],
        config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): SS.SSelectOne_<T> {
        return new SimpleBlueprint<Widget_selectOne<BaseSelectEntry<T>>>('selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }

    selectMany<const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>): SS.SSelectMany<T> {
        return new SimpleBlueprint<Widget_selectMany<T>>('selectMany', config)
    }

    /** see also: `fields` for a more practical api */
    group<const T extends SchemaDict>(config: Widget_group_config<T> = {}): SS.SGroup<T> {
        return new SimpleBlueprint<Widget_group<T>>('group', config)
    }

    fields<const T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}): SS.SGroup<T> {
        return new SimpleBlueprint<Widget_group<T>>('group', { items: fields, ...config })
    }

    choice<const T extends { [key: string]: IBlueprint }>(config: Omit<Widget_choices_config<T>, 'multi'>): SS.SChoices<T> {
        return new SimpleBlueprint<Widget_choices<T>>('choices', { multi: false, ...config })
    }

    choices<const T extends { [key: string]: IBlueprint }>(config: Omit<Widget_choices_config<T>, 'multi'>): SS.SChoices<T> {
        return new SimpleBlueprint<Widget_choices<T>>('choices', { multi: true, ...config })
    }

    ok<const T extends SchemaDict>(config: Widget_group_config<T> = {}) {
        return new SimpleBlueprint<Widget_group<T>>('group', config)
    }

    /** simple choice alternative api */
    tabs<const T extends { [key: string]: IBlueprint }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ) {
        return new SimpleBlueprint<Widget_choices<T>>('choices', { items, multi: false, ...config, appearance: 'tab' })
    }

    // optional wrappers
    optional<const T extends IBlueprint>(p: Widget_optional_config<T>): SS.SOptional<T> {
        return new SimpleBlueprint<Widget_optional<T>>('optional', p)
    }

    llmModel(p: { default?: OpenRouter_Models } = {}) {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = p.default ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

    /**
     * Calling this function will mount and instanciate the subform right away
     * Subform will be register in the root form `group`, using `__${key}__` as the key
     * This is a core abstraction that enables features like
     *  - mountting a widget at several places in the form
     *  - recursive forms
     *  - dynamic widgets depending on other widgets values
     * */
    shared<W extends IBlueprint>(key: string, spec: W): Widget_shared<W> {
        const prevSerial = this.form.shared[key]
        let widget
        if (prevSerial && prevSerial.type === spec.type) {
            widget = this._HYDRATE(null, spec, prevSerial)
        } else {
            widget = this._HYDRATE(null, spec, null)
        }
        this.form.shared[key] = widget.serial
        this.form.knownShared.set(key, widget)
        const sharedSpec = new SimpleBlueprint<Widget_shared<W>>('shared', { rootKey: key, widget })
        return new Widget_shared<W>(this.form, null, sharedSpec) as any
    }

    _HYDRATE<T extends IBlueprint>(
        //
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): T['$Field'] {
        const w = this.__HYDRATE(parent, spec, serial) as T['$Field']
        w.publishValue()
        for (const { expr, effect } of spec.reactions) {
            // 🔴 Need to dispose later
            reaction(
                () => expr(w),
                (arg) => effect(arg, w),
                { fireImmediately: true },
            )
        }
        return w
    }

    /** (@internal); */ _cache: { count: number } = { count: 0 }
    /** (@internal) advanced way to restore form state. used internally */
    private __HYDRATE<T extends IBlueprint>(
        //
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): BaseField<any> /* T['$Field'] */ {
        // ensure the serial is compatible
        if (serial != null && serial.type !== spec.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${spec.type}, got: ${serial.type})`)
            serial = null
        }

        // handle shared widgets
        if (spec instanceof Widget_shared) return spec

        // ensure we receive a valid spec
        if (!(spec instanceof SimpleBlueprint))
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)

        const type = spec.type
        const config = spec.config as any /* impossible to propagate union specification in the switch below */
        const spec2 = spec as any

        if (type === 'group')
            return new Widget_group(
                this.form,
                parent,
                spec2,
                serial,
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                this.form._ROOT
                    ? undefined
                    : (x) => {
                          this.form._ROOT = x
                      },
            )
        if (type === 'shared') {
            // turns out we should only work with Widget_shared directly, so we should be safe
            // to simply not support Spec<shared>
            throw new Error(`[❌] For now, Shared_Widget have been design to bypass spec hydratation completely.`)
            // option 1:
            // ⏸️ return new Widget_shared    (this.form, config, serial)
            // option 2:
            // ⏸️ return config.widget
        }
        if (type === 'optional') return new Widget_optional(this.form, parent, spec2, serial)
        if (type === 'bool') return new Widget_bool(this.form, parent, spec2, serial)
        if (type === 'str') return new Widget_string(this.form, parent, spec2, serial)
        if (type === 'choices') return new Widget_choices(this.form, parent, spec2, serial)
        if (type === 'number') return new Widget_number(this.form, parent, spec2, serial)
        if (type === 'color') return new Widget_color(this.form, parent, spec2, serial)
        if (type === 'list') return new Widget_list(this.form, parent, spec2, serial)
        if (type === 'button') return new Widget_button(this.form, parent, spec2, serial)
        if (type === 'seed') return new Widget_seed(this.form, parent, spec2, serial)
        if (type === 'matrix') return new Widget_matrix(this.form, parent, spec2, serial)
        if (type === 'selectOne') return new Widget_selectOne(this.form, parent, spec2, serial)
        if (type === 'selectMany') return new Widget_selectMany(this.form, parent, spec2, serial)
        if (type === 'size') return new Widget_size(this.form, parent, spec2, serial)
        if (type === 'spacer') return new Widget_spacer(this.form, parent, spec2, serial)
        if (type === 'markdown') return new Widget_markdown(this.form, parent, spec2, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)

        return new Widget_markdown(
            this.form,
            parent,
            new SimpleBlueprint<Widget_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }
}
