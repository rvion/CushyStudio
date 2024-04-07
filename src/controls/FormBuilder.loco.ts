import '../theme/form.vars.css'
import '../theme/markdown.css'
import '../theme/form.css'

import type { OpenRouter_Models } from '../llm/OpenRouter_models'
import type { Form } from './Form'
import type { IFormBuilder } from './IFormBuilder'
import type { ISpec, SchemaDict } from './ISpec'
import type { IWidget } from './IWidget'

import { makeAutoObservable } from 'mobx'

import { openRouterInfos } from '../llm/OpenRouter_infos'
import { _FIX_INDENTATION } from '../utils/misc/_FIX_INDENTATION'
import { FormManager } from './FormManager'
import { getCurrentForm_IMPL } from './shared/runWithGlobalForm'
import { Widget_bool, type Widget_bool_config } from './widgets/bool/WidgetBool'
import { Widget_button, type Widget_button_config } from './widgets/button/WidgetButton'
import { Widget_choices, type Widget_choices_config } from './widgets/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from './widgets/color/WidgetColor'
import { Widget_group, type Widget_group_config } from './widgets/group/WidgetGroup'
import { Widget_list, type Widget_list_config } from './widgets/list/WidgetList'
import { Widget_markdown, Widget_markdown_config } from './widgets/markdown/WidgetMarkdown'
import { Widget_matrix, type Widget_matrix_config } from './widgets/matrix/WidgetMatrix'
import { Widget_number, type Widget_number_config } from './widgets/number/WidgetNumber'
import { Widget_optional, type Widget_optional_config } from './widgets/optional/WidgetOptional'
import { Widget_seed, type Widget_seed_config } from './widgets/seed/WidgetSeed'
import { Widget_selectMany, type Widget_selectMany_config } from './widgets/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Widget_selectOne, type Widget_selectOne_config } from './widgets/selectOne/WidgetSelectOne'
import { Widget_shared } from './widgets/shared/WidgetShared'
import { Widget_size, type Widget_size_config } from './widgets/size/WidgetSize'
import { Widget_spacer, Widget_spacer_config } from './widgets/spacer/WidgetSpacer'
import { Widget_string, type Widget_string_config } from './widgets/string/WidgetString'

export class SimpleSpec<W extends IWidget = IWidget> implements ISpec<W> {
    $Widget!: W
    $Type!: W['type']
    $Config!: W['$Config']
    $Serial!: W['$Serial']
    $Value!: W['$Value']

    LabelExtraUI = (p: {}) => null

    Make = <X extends IWidget>(type: X['type'], config: X['$Config']) => new SimpleSpec(type, config)

    constructor(
        //
        public readonly type: W['type'],
        public readonly config: W['$Config'],
    ) {}

    /** wrap widget spec to list stuff */
    list = (config: Omit<Widget_list_config<any>, 'element'> = {}): SimpleSpec<Widget_list<this>> =>
        new SimpleSpec<Widget_list<this>>('list', {
            ...config,
            element: this,
        })

    optional = <const T extends SimpleSpec>(startActive: boolean = false) =>
        new SimpleSpec<Widget_optional<this>>('optional', {
            widget: this,
            startActive: startActive,
            label: this.config.label,
            // requirements: this.config.requirements,
            startCollapsed: this.config.startCollapsed,
            collapsed: this.config.collapsed,
            border: this.config.border,
        })

    shared = (key: string): Widget_shared<this> => getCurrentForm_IMPL().shared(key, this)

    /** clone the spec, and patch the cloned config to make it hidden */
    hidden = () => new SimpleSpec(this.type, { ...this.config, hidden: true })
}

export class FormBuilder_Loco implements IFormBuilder {
    /** (@internal) DO NOT USE YOURSELF */
    SpecCtor = SimpleSpec

    /** (@internal) don't call this yourself */
    constructor(public form: Form<IWidget, FormBuilder_Loco>) {
        makeAutoObservable(this, {
            SpecCtor: false,
        })
    }

    time = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { inputType: 'time', ...config })

    date = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { inputType: 'date', ...config })

    datetime = (config: Widget_string_config = {}) =>
        new SimpleSpec<Widget_string>('str', { inputType: 'datetime-local', ...config })

    password = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { inputType: 'password', ...config })

    email = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { inputType: 'email', ...config })

    url = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { inputType: 'url', ...config })

    string = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', config)

    text = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', config)

    textarea = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { textarea: true, ...config })

    boolean = (config: Widget_bool_config = {}) => new SimpleSpec<Widget_bool>('bool', config)

    bool = (config: Widget_bool_config = {}) => new SimpleSpec<Widget_bool>('bool', config)

    size = (config: Widget_size_config = {}) => new SimpleSpec<Widget_size>('size', config)

    spacer = (config: Widget_spacer_config = {}) =>
        new SimpleSpec<Widget_spacer>('spacer', { alignLabel: false, label: false, collapsed: false, border: false })

    seed = (config: Widget_seed_config = {}) => new SimpleSpec<Widget_seed>('seed', config)

    color = (config: Widget_color_config = {}) => new SimpleSpec<Widget_color>('color', config)

    colorV2 = (config: Widget_string_config = {}) => new SimpleSpec<Widget_string>('str', { inputType: 'color', ...config })

    matrix = (config: Widget_matrix_config) => new SimpleSpec<Widget_matrix>('matrix', config)

    button = <K>(config: Widget_button_config) => new SimpleSpec<Widget_button<K>>('button', config)

    /** variants: `header` */
    markdown = (config: Widget_markdown_config | string) =>
        new SimpleSpec<Widget_markdown>('markdown', typeof config === 'string' ? { markdown: config } : config)

    /** [markdown variant]: inline=true, label=false */
    header = (config: Widget_markdown_config | string) =>
        new SimpleSpec<Widget_markdown>(
            'markdown',
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, alignLabel: false, ...config },
        )
    // image       = (config: Widget_image_config = {})                                                         => new Spec<Widget_image                       >('image'     , config)
    int = (config: Omit<Widget_number_config, 'mode'> = {}) => new SimpleSpec<Widget_number>('number', { mode: 'int', ...config })

    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent = (config: Omit<Widget_number_config, 'mode'> = {}) =>
        new SimpleSpec<Widget_number>('number', { mode: 'int', default: 100, step: 10, min: 1, max: 100, suffix: '%', ...config })

    float = (config: Omit<Widget_number_config, 'mode'> = {}) =>
        new SimpleSpec<Widget_number>('number', { mode: 'float', ...config })

    number = (config: Omit<Widget_number_config, 'mode'> = {}) =>
        new SimpleSpec<Widget_number>('number', { mode: 'float', ...config })

    list = <const T extends ISpec>(config: Widget_list_config<T>) => new SimpleSpec<Widget_list<T>>('list', config)

    selectOneV2 = (p: string[])                                                                              => new SimpleSpec<Widget_selectOne<BaseSelectEntry>  >('selectOne' , { choices: p.map((id) => ({ id, label: id })), appearance:'tab' }) // prettier-ignore

    selectOne = <const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>) =>
        new SimpleSpec<Widget_selectOne<T>>('selectOne', config)

    selectMany = <const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>) =>
        new SimpleSpec<Widget_selectMany<T>>('selectMany', config)

    /** see also: `fields` for a more practical api */
    group = <const T extends SchemaDict>(config: Widget_group_config<T> = {}) => new SimpleSpec<Widget_group<T>>('group', config)

    fields = <const T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}) =>
        new SimpleSpec<Widget_group<T>>('group', { items: fields, ...config })

    choice = <const T extends { [key: string]: ISpec }>(config: Omit<Widget_choices_config<T>, 'multi'>) =>
        new SimpleSpec<Widget_choices<T>>('choices', { multi: false, ...config })

    choices = <const T extends { [key: string]: ISpec }>(config: Omit<Widget_choices_config<T>, 'multi'>) =>
        new SimpleSpec<Widget_choices<T>>('choices', { multi: true, ...config })

    ok = <const T extends SchemaDict>(config: Widget_group_config<T> = {}) => new SimpleSpec<Widget_group<T>>('group', config)

    /** simple choice alternative api */
    tabs = <const T extends { [key: string]: ISpec }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ) => new SimpleSpec<Widget_choices<T>>('choices', { items, multi: false, ...config, appearance: 'tab' })

    // optional wrappers
    optional = <const T extends ISpec>(p: Widget_optional_config<T>) => new SimpleSpec<Widget_optional<T>>('optional', p)

    llmModel = (p: { default?: OpenRouter_Models } = {}) => {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = choices ? choices.find((c) => c.id === p.default) : undefined
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
    shared = <W extends ISpec>(key: string, spec: W): Widget_shared<W> => {
        const prevSerial = this.form.shared[key]
        let widget
        if (prevSerial && prevSerial.type === spec.type) {
            widget = this._HYDRATE(null, spec, prevSerial)
        } else {
            widget = this._HYDRATE(null, spec, null)
            this.form.shared[key] = widget.serial
            // 💬 2024-03-15 rvion: no bumpValue() needed here, because this is done
            // at creation time; not during regular runtime
        }
        // 💬 2024-03-12 rvion: do we store the widget, or the widgetshared instead 2 lines below ? not sure yet.
        // ⏸️ this.form.knownShared.set(key, widget)
        const sharedSpec = new SimpleSpec<Widget_shared<W>>('shared', { rootKey: key, widget })
        return new Widget_shared<W>(this.form, null, sharedSpec) as any
    }

    // --------------------

    _FIX_INDENTATION = _FIX_INDENTATION

    /** (@internal); */ _cache: { count: number } = { count: 0 }
    /** (@internal) advanced way to restore form state. used internally */
    _HYDRATE = <T extends ISpec>(parent: IWidget | null, spec: T, serial: any | null): T['$Widget'] => {
        // ensure the serial is compatible
        if (serial != null && serial.type !== spec.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${spec.type}, got: ${serial.type})`)
            serial = null
        }

        if (spec instanceof Widget_shared) {
            return spec
            // return new Unmounted(unmounted.type, unmounted.config) as any
            // return unmounted.shared
        }

        if (!(spec instanceof SimpleSpec)) {
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)
        }

        const type = spec.type
        const config = spec.config as any /* impossible to propagate union specification in the switch below */
        const spec2 = spec as any

        if (type === 'group')
            return new Widget_group(
                this.form,
                parent,
                spec2,
                serial,
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
        // exhaust(type)
        return new Widget_markdown(
            this.form,
            parent,
            new SimpleSpec<Widget_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }
}

export const LocoFormManager = new FormManager<FormBuilder_Loco>(FormBuilder_Loco)
