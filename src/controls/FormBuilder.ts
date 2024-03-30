import type { OpenRouter_Models } from '../llm/OpenRouter_models'
import type { DraftL } from '../models/Draft'
import type { IFormBuilder } from './Form'
import type { $WidgetTypes, IWidget } from './IWidget'
import type { Requirements } from './Requirements'
import type { ISpec, SchemaDict } from './Spec'

import { makeAutoObservable, runInAction } from 'mobx'

import { openRouterInfos } from '../llm/OpenRouter_infos'
import { _FIX_INDENTATION } from '../utils/misc/_FIX_INDENTATION'
import { useDraft } from '../widgets/misc/useDraft'
import { mkFormAutoBuilder } from './builder/AutoBuilder'
import { EnumBuilder, EnumBuilderOpt } from './builder/EnumBuilder'
import { CushySpec } from './CushySpec'
import { Form } from './Form'
import { FormManager } from './FormManager'
import { Widget_bool, type Widget_bool_config } from './widgets/bool/WidgetBool'
import { Widget_button, type Widget_button_config } from './widgets/button/WidgetButton'
import { Widget_choices, type Widget_choices_config } from './widgets/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from './widgets/color/WidgetColor'
import { Widget_custom, type Widget_custom_config } from './widgets/custom/WidgetCustom'
import { Widget_enum } from './widgets/enum/WidgetEnum'
import { Widget_group, type Widget_group_config } from './widgets/group/WidgetGroup'
import { Widget_image, type Widget_image_config } from './widgets/image/WidgetImage'
import { Widget_list, type Widget_list_config } from './widgets/list/WidgetList'
import { Widget_listExt, type Widget_listExt_config } from './widgets/listExt/WidgetListExt'
import { Widget_markdown, Widget_markdown_config } from './widgets/markdown/WidgetMarkdown'
import { Widget_matrix, type Widget_matrix_config } from './widgets/matrix/WidgetMatrix'
import { Widget_number, type Widget_number_config } from './widgets/number/WidgetNumber'
import { Widget_optional, type Widget_optional_config } from './widgets/optional/WidgetOptional'
import { Widget_orbit, type Widget_orbit_config } from './widgets/orbit/WidgetOrbit'
import { Widget_prompt, type Widget_prompt_config } from './widgets/prompt/WidgetPrompt'
import { Widget_seed, type Widget_seed_config } from './widgets/seed/WidgetSeed'
import { Widget_selectMany, type Widget_selectMany_config } from './widgets/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Widget_selectOne, type Widget_selectOne_config } from './widgets/selectOne/WidgetSelectOne'
import { Widget_shared } from './widgets/shared/WidgetShared'
import { Widget_size, type Widget_size_config } from './widgets/size/WidgetSize'
import { Widget_spacer, Widget_spacer_config } from './widgets/spacer/WidgetSpacer'
import { Widget_string, type Widget_string_config } from './widgets/string/WidgetString'

export class FormBuilder implements IFormBuilder {
    SpecCtor = CushySpec
    /** (@internal) don't call this yourself */
    constructor(public form: Form<SchemaDict, FormBuilder>) {
        makeAutoObservable(this, {
            auto: false,
            autoField: false,
            enum: false,
            enumOpt: false,
            SpecCtor: false,
        })
    }

    time = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { inputType: 'time', ...config })
    date = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { inputType: 'date', ...config })
    datetime = (config: Widget_string_config = {}) =>
        new CushySpec<Widget_string>('str', { inputType: 'datetime-local', ...config })
    password = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { inputType: 'password', ...config })
    email = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { inputType: 'email', ...config })
    url = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { inputType: 'url', ...config })
    string = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', config)
    text = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', config)
    textarea = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { textarea: true, ...config })
    boolean = (config: Widget_bool_config = {}) => new CushySpec<Widget_bool>('bool', config)
    bool = (config: Widget_bool_config = {}) => new CushySpec<Widget_bool>('bool', config)
    size = (config: Widget_size_config = {}) => new CushySpec<Widget_size>('size', config)
    spacer = (config: Widget_spacer_config = {}) =>
        new CushySpec<Widget_spacer>('spacer', { alignLabel: false, label: false, collapsed: false, border: false })
    orbit = (config: Widget_orbit_config = {}) => new CushySpec<Widget_orbit>('orbit', config)
    seed = (config: Widget_seed_config = {}) => new CushySpec<Widget_seed>('seed', config)
    color = (config: Widget_color_config = {}) => new CushySpec<Widget_color>('color', config)
    colorV2 = (config: Widget_string_config = {}) => new CushySpec<Widget_string>('str', { inputType: 'color', ...config })
    matrix = (config: Widget_matrix_config) => new CushySpec<Widget_matrix>('matrix', config)
    button = <K>(config: Widget_button_config<K>) => new CushySpec<Widget_button<K>>('button', config)
    /** variants: `header` */
    markdown = (config: Widget_markdown_config | string) =>
        new CushySpec<Widget_markdown>('markdown', typeof config === 'string' ? { markdown: config } : config)
    /** [markdown variant]: inline=true, label=false */
    header = (config: Widget_markdown_config | string) =>
        new CushySpec<Widget_markdown>(
            'markdown',
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, alignLabel: false, ...config },
        )
    image = (config: Widget_image_config = {}) => new CushySpec<Widget_image>('image', config)
    prompt = (config: Widget_prompt_config = {}) => new CushySpec<Widget_prompt>('prompt', config)
    promptV2 = (config: Widget_prompt_config = {}) => new CushySpec<Widget_prompt>('prompt', config)
    int = (config: Omit<Widget_number_config, 'mode'> = {}) => new CushySpec<Widget_number>('number', { mode: 'int', ...config })
    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent = (config: Omit<Widget_number_config, 'mode'> = {}) =>
        new CushySpec<Widget_number>('number', { mode: 'int', default: 100, step: 10, min: 1, max: 100, suffix: '%', ...config })
    float = (config: Omit<Widget_number_config, 'mode'> = {}) =>
        new CushySpec<Widget_number>('number', { mode: 'float', ...config })
    number = (config: Omit<Widget_number_config, 'mode'> = {}) =>
        new CushySpec<Widget_number>('number', { mode: 'float', ...config })
    custom = <TViewState>(config: Widget_custom_config<TViewState>) => new CushySpec<Widget_custom<TViewState>>('custom', config)
    list = <const T extends CushySpec>(config: Widget_list_config<T>) => new CushySpec<Widget_list<T>>('list', config)
    listExt = <const T extends CushySpec>(config: Widget_listExt_config<T>) => new CushySpec<Widget_listExt<T>>('listExt', config)
    timeline = <const T extends CushySpec>(config: Widget_listExt_config<T>) =>
        new CushySpec<Widget_listExt<T>>('listExt', { mode: 'timeline', ...config })
    regional = <const T extends CushySpec>(config: Widget_listExt_config<T>) =>
        new CushySpec<Widget_listExt<T>>('listExt', { mode: 'regional', ...config })
    selectOneV2 = <const T extends string>(p: T[], config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>,'choices'>={})                                    => new CushySpec<Widget_selectOne<BaseSelectEntry<T>>>('selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    selectOne = <const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>) =>
        new CushySpec<Widget_selectOne<T>>('selectOne', config)
    selectMany = <const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>) =>
        new CushySpec<Widget_selectMany<T>>('selectMany', config)
    /** see also: `fields` for a more practical api */
    group = <const T extends SchemaDict>(config: Widget_group_config<T> = {}) => new CushySpec<Widget_group<T>>('group', config)
    /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
    column = <const T extends SchemaDict>(config: Widget_group_config<T> = {}) =>
        new CushySpec<Widget_group<T>>('group', { border: false, label: false, collapsed: false, ...config })
    /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
    row = <const T extends SchemaDict>(config: Widget_group_config<T> = {}) =>
        new CushySpec<Widget_group<T>>('group', { border: false, label: false, collapsed: false, layout: 'H', ...config })
    fields = <const T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}) =>
        new CushySpec<Widget_group<T>>('group', { items: fields, ...config })
    choice = <const T extends { [key: string]: CushySpec }>(config: Omit<Widget_choices_config<T>, 'multi'>) =>
        new CushySpec<Widget_choices<T>>('choices', { multi: false, ...config })
    choiceV2 = <const T extends { [key: string]: CushySpec }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'>,
    ) => new CushySpec<Widget_choices<T>>('choices', { multi: false, items, ...config })
    choices = <const T extends { [key: string]: CushySpec }>(config: Omit<Widget_choices_config<T>, 'multi'>) =>
        new CushySpec<Widget_choices<T>>('choices', { multi: true, ...config })
    ok = <const T extends SchemaDict>(config: Widget_group_config<T> = {}) => new CushySpec<Widget_group<T>>('group', config)
    /** simple choice alternative api */
    tabs = <const T extends { [key: string]: CushySpec }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ) => new CushySpec<Widget_choices<T>>('choices', { items, multi: false, ...config, appearance: 'tab' })
    // optional wrappers
    optional = <const T extends CushySpec>(p: Widget_optional_config<T>) => new CushySpec<Widget_optional<T>>('optional', p)
    llmModel = (p: { default?: OpenRouter_Models } = {}) => {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = choices ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

    /** @deprecated ; if you need this widget, you should copy paste that into a prefab */
    inlineRun = (config: Widget_button_config = {}) =>
        new CushySpec<Widget_button<DraftL>>('button', {
            useContext: useDraft,
            onClick: (p) =>
                runInAction(() => {
                    if (p.widget.value === true) return
                    const draft = p.context
                    p.widget.value = true
                    draft.setAutostart(false)
                    draft.start({})
                    setTimeout(() => (p.widget.value = false), 100) // Reset value back to false for future runs
                    p.widget.bumpValue()
                }),
            icon: (p) => {
                if (p.context.shouldAutoStart) return 'pause'
                return 'play_arrow'
            },
            ...config,
        })

    /**
     * Calling this function will mount and instanciate the subform right away
     * Subform will be register in the root form `group`, using `__${key}__` as the key
     * This is a core abstraction that enables features like
     *  - mountting a widget at several places in the form
     *  - recursive forms
     *  - dynamic widgets depending on other widgets values
     * */
    shared = <W extends ISpec>(key: string, unmounted: W): Widget_shared<W> => {
        const name = `__${key}__`
        const prevSerial = this.form._ROOT.serial.values_[name]
        let widget
        if (prevSerial && prevSerial.type === unmounted.type) {
            widget = this._HYDRATE(null, unmounted, prevSerial)
        } else {
            widget = this._HYDRATE(null, unmounted, null)
            this.form._ROOT.serial.values_[name] = widget.serial
            // 💬 2024-03-15 rvion: no bump needed here, because this is done
            // at creation time; not during regular runtime
            // ❌ this.form._ROOT.bumpValue()
        }
        // 💬 2024-03-12 rvion: do we store the widget, or the widgetshared instead 2 lines below ? not sure yet.
        this.form.knownShared.set(key, widget)
        return new Widget_shared<W>(this.form, null, { rootKey: key, widget }) as any
    }

    // --------------------

    // enum = /*<const T extends KnownEnumNames>*/ (config: Widget_enum_config<any, any>) => new Widget_enum(this.form, config)
    get auto() {
        const _ = mkFormAutoBuilder(this) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'auto', { value: _ })
        return _
    }
    get autoField() {
        const _ = mkFormAutoBuilder(this)
        Object.defineProperty(this, 'autoField', { value: _ })
        return _
    }
    get enum() {
        const _ = new EnumBuilder(this.form) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'enum', { value: _ })
        return _
    }
    get enumOpt() {
        const _ = new EnumBuilderOpt(this.form)
        Object.defineProperty(this, 'enumOpt', { value: _ })
        return _
    }

    _FIX_INDENTATION = _FIX_INDENTATION

    /** (@internal); */ _cache: { count: number } = { count: 0 }
    /** (@internal) advanced way to restore form state. used internally */
    _HYDRATE = <T extends ISpec>(parent: IWidget | null, unmounted: T, serial: any | null): T['$Widget'] => {
        // ensure the serial is compatible
        if (serial != null && serial.type !== unmounted.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${unmounted.type}, got: ${serial.type})`)
            serial = null
        }

        if (unmounted instanceof Widget_shared) {
            return unmounted
            // return new Unmounted(unmounted.type, unmounted.config) as any
            // return unmounted.shared
        }

        if (!(unmounted instanceof CushySpec)) {
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)
        }

        const type = unmounted.type
        const config = unmounted.config as any /* impossible to propagate union specification in the switch below */
        if (type === 'group')
            return new Widget_group(
                this.form,
                parent,
                config,
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
        if (type === 'optional') return new Widget_optional(this.form, parent, config, serial)
        if (type === 'bool') return new Widget_bool(this.form, parent, config, serial)
        if (type === 'str') return new Widget_string(this.form, parent, config, serial)
        if (type === 'prompt') return new Widget_prompt(this.form, parent, config, serial)
        if (type === 'choices') return new Widget_choices(this.form, parent, config, serial)
        if (type === 'number') return new Widget_number(this.form, parent, config, serial)
        if (type === 'color') return new Widget_color(this.form, parent, config, serial)
        if (type === 'enum') return new Widget_enum(this.form, parent, config, serial)
        if (type === 'list') return new Widget_list(this.form, parent, config, serial)
        if (type === 'orbit') return new Widget_orbit(this.form, parent, config, serial)
        if (type === 'listExt') return new Widget_listExt(this.form, parent, config, serial)
        if (type === 'button') return new Widget_button(this.form, parent, config, serial)
        if (type === 'seed') return new Widget_seed(this.form, parent, config, serial)
        if (type === 'matrix') return new Widget_matrix(this.form, parent, config, serial)
        if (type === 'image') return new Widget_image(this.form, parent, config, serial)
        if (type === 'selectOne') return new Widget_selectOne(this.form, parent, config, serial)
        if (type === 'selectMany') return new Widget_selectMany(this.form, parent, config, serial)
        if (type === 'size') return new Widget_size(this.form, parent, config, serial)
        if (type === 'spacer') return new Widget_spacer(this.form, parent, config, serial)
        if (type === 'markdown') return new Widget_markdown(this.form, parent, config, serial)
        if (type === 'custom') return new Widget_custom(this.form, parent, config, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)
        // exhaust(type)
        return new Widget_markdown(this.form, parent, { markdown: `unknown widget "${type}" in serial.` })
    }
}

export const CushyFormManager = new FormManager<FormBuilder>(FormBuilder)
