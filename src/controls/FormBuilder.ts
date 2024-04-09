import type { OpenRouter_Models } from '../llm/OpenRouter_models'
import type { DraftL } from '../models/Draft'
import type { IFormBuilder } from './IFormBuilder'
import type { ISpec, SchemaDict } from './ISpec'
import type { IWidget } from './IWidget'

import { makeAutoObservable, runInAction } from 'mobx'

import { openRouterInfos } from '../llm/OpenRouter_infos'
import { _FIX_INDENTATION } from '../utils/misc/_FIX_INDENTATION'
import { useDraft } from '../widgets/misc/useDraft'
import { mkFormAutoBuilder } from './builder/AutoBuilder'
import { EnumBuilder, EnumBuilderOpt } from './builder/EnumBuilder'
import { Spec } from './CushySpec'
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

// attempt to make type safety better --------------------------------------------------------
export type XGroup<T extends SchemaDict> = Spec<Widget_group<T>>
export type XOptional = Spec<Widget_optional>
export type XBool = Spec<Widget_bool>
export type XString = Spec<Widget_string>
export type XPrompt = Spec<Widget_prompt>
export type XChoices = Spec<Widget_choices>
export type XNumber = Spec<Widget_number>
export type XColor = Spec<Widget_color>
export type XEnum<T> = Spec<Widget_enum<T>>
export type XList<T extends ISpec> = Spec<Widget_list<T>>
export type XOrbit = Spec<Widget_orbit>
export type XListExt<T extends ISpec> = Spec<Widget_listExt<T>>
export type XButton<T> = Spec<Widget_button<T>>
export type XSeed = Spec<Widget_seed>
export type XMatrix = Spec<Widget_matrix>
export type XImage = Spec<Widget_image>
export type XSelectOne<T extends BaseSelectEntry> = Spec<Widget_selectOne<T>>
export type XSelectMany<T extends BaseSelectEntry> = Spec<Widget_selectMany<T>>
export type XSize = Spec<Widget_size>
export type XSpacer = Spec<Widget_spacer>
export type XMarkdown = Spec<Widget_markdown>
export type XCustom<T> = Spec<Widget_custom<T>>

export class FormBuilder implements IFormBuilder {
    SpecCtor = Spec

    /** (@internal) don't call this yourself */
    constructor(public form: Form<IWidget, FormBuilder>) {
        makeAutoObservable(this, {
            auto: false,
            autoField: false,
            enum: false,
            enumOpt: false,
            SpecCtor: false,
        })
    }

    time = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'time', ...config })
    }
    date = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'date', ...config })
    }
    datetime = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'datetime-local', ...config })
    }
    password = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'password', ...config })
    }
    email = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'email', ...config })
    }
    url = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'url', ...config })
    }
    string = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', config)
    }
    text = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', config)
    }
    textarea = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { textarea: true, ...config })
    }
    boolean = (config: Widget_bool_config = {}): XBool => {
        return new Spec<Widget_bool>('bool', config)
    }
    bool = (config: Widget_bool_config = {}): XBool => {
        return new Spec<Widget_bool>('bool', config)
    }
    size = (config: Widget_size_config = {}): XSize => {
        return new Spec<Widget_size>('size', config)
    }
    spacer = (config: Widget_spacer_config = {}): XSpacer => {
        return new Spec<Widget_spacer>('spacer', { alignLabel: false, label: false, collapsed: false, border: false })
    }
    orbit = (config: Widget_orbit_config = {}): XOrbit => {
        return new Spec<Widget_orbit>('orbit', config)
    }
    seed = (config: Widget_seed_config = {}): XSeed => {
        return new Spec<Widget_seed>('seed', config)
    }
    color = (config: Widget_color_config = {}): XColor => {
        return new Spec<Widget_color>('color', config)
    }
    colorV2 = (config: Widget_string_config = {}): XString => {
        return new Spec<Widget_string>('str', { inputType: 'color', ...config })
    }
    matrix = (config: Widget_matrix_config): XMatrix => {
        return new Spec<Widget_matrix>('matrix', config)
    }
    button = <K>(config: Widget_button_config<K>): XButton<K> => {
        return new Spec<Widget_button<K>>('button', config)
    }
    /** variants: `header` */
    markdown = (config: Widget_markdown_config | string): XMarkdown => {
        return new Spec<Widget_markdown>('markdown', typeof config === 'string' ? { markdown: config } : config)
    }
    /** [markdown variant]: inline=true, label=false */
    header = (config: Widget_markdown_config | string): XMarkdown => {
        const config_: Widget_markdown_config =
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, alignLabel: false, ...config }
        return new Spec<Widget_markdown>('markdown', config_)
    }
    image = (config: Widget_image_config = {}): XImage => {
        return new Spec<Widget_image>('image', config)
    }
    prompt = (config: Widget_prompt_config = {}): XPrompt => {
        return new Spec<Widget_prompt>('prompt', config)
    }
    int = (config: Omit<Widget_number_config, 'mode'> = {}): XNumber => {
        return new Spec<Widget_number>('number', { mode: 'int', ...config })
    }
    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent = (config: Omit<Widget_number_config, 'mode'> = {}): XNumber => {
        return new Spec<Widget_number>('number', {
            mode: 'int',
            default: 100,
            step: 10,
            min: 0,
            max: 100,
            suffix: '%',
            ...config,
        })
    }
    float = (config: Omit<Widget_number_config, 'mode'> = {}): XNumber => {
        return new Spec<Widget_number>('number', { mode: 'float', ...config })
    }
    number = (config: Omit<Widget_number_config, 'mode'> = {}): XNumber => {
        return new Spec<Widget_number>('number', { mode: 'float', ...config })
    }
    custom = <T>(config: Widget_custom_config<T>): XCustom<T> => {
        return new Spec<Widget_custom<T>>('custom', config)
    }
    list = <T extends ISpec>(config: Widget_list_config<T>): XList<T> => {
        return new Spec<Widget_list<T>>('list', config)
    }
    listExt = <T extends ISpec>(config: Widget_listExt_config<T>): XListExt<T> => {
        return new Spec<Widget_listExt<T>>('listExt', config)
    }
    timeline = <T extends ISpec>(config: Widget_listExt_config<T>) => {
        return new Spec<Widget_listExt<T>>('listExt', { mode: 'timeline', ...config })
    }
    regional = <T extends ISpec>(config: Widget_listExt_config<T>) => {
        return new Spec<Widget_listExt<T>>('listExt', { mode: 'regional', ...config })
    }
    selectOneV2 = <T extends string>(p: T[], config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {}) => {
        return new Spec<Widget_selectOne<BaseSelectEntry<T>>>('selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }
    selectOne = <const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>) => {
        return new Spec<Widget_selectOne<T>>('selectOne', config)
    }
    selectMany = <const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>) => {
        return new Spec<Widget_selectMany<T>>('selectMany', config)
    }
    /** see also: `fields` for a more practical api */
    group = <T extends SchemaDict>(config: Widget_group_config<T> = {}) => {
        return new Spec<Widget_group<T>>('group', config)
    }
    /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
    column = <T extends SchemaDict>(config: Widget_group_config<T> = {}) => {
        return new Spec<Widget_group<T>>('group', { border: false, label: false, collapsed: false, ...config })
    }
    /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
    row = <T extends SchemaDict>(config: Widget_group_config<T> = {}) => {
        return new Spec<Widget_group<T>>('group', { border: false, label: false, collapsed: false, layout: 'H', ...config })
    }
    /** simpler way to create `group` */
    fields = <T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}): XGroup<T> => {
        return new Spec<Widget_group<T>>('group', { items: fields, ...config })
    }
    choice = <T extends { [key: string]: ISpec }>(config: Omit<Widget_choices_config<T>, 'multi'>) => {
        return new Spec<Widget_choices<T>>('choices', { multi: false, ...config })
    }
    choiceV2 = <T extends { [key: string]: ISpec }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'>,
    ) => {
        return new Spec<Widget_choices<T>>('choices', { multi: false, items, ...config })
    }
    choices = <T extends { [key: string]: ISpec }>(config: Omit<Widget_choices_config<T>, 'multi'>) => {
        return new Spec<Widget_choices<T>>('choices', { multi: true, ...config })
    }
    ok = <T extends SchemaDict>(config: Widget_group_config<T> = {}) => {
        return new Spec<Widget_group<T>>('group', config)
    }
    /** simple choice alternative api */
    tabs = <T extends { [key: string]: Spec }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ) => new Spec<Widget_choices<T>>('choices', { items, multi: false, ...config, appearance: 'tab' })
    // optional wrappers
    optional = <T extends ISpec>(p: Widget_optional_config<T>) => new Spec<Widget_optional<T>>('optional', p)
    llmModel = (p: { default?: OpenRouter_Models } = {}) => {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = choices ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

    /** @deprecated ; if you need this widget, you should copy paste that into a prefab */
    inlineRun = (config: Widget_button_config = {}) =>
        new Spec<Widget_button<DraftL>>('button', {
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
        const sharedSpec = new Spec<Widget_shared<W>>('shared', { rootKey: key, widget })
        return new Widget_shared<W>(this.form, null, sharedSpec) as any
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
    _HYDRATE = <T extends ISpec>( //
        parent: IWidget | null,
        spec: T,
        serial: any | null,
    ): T['$Widget'] => {
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

        if (!(spec instanceof Spec)) {
            console.log(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)
        }

        const type = spec.type
        const config = spec.config as any /* impossible to propagate union specification in the switch below */
        const spec2 = spec as any

        if (type === 'group') return new Widget_group(this.form, parent, spec2, serial, this.form._ROOT ? undefined : (x) => { this.form._ROOT = x }) // prettier-ignore
        if (type === 'shared') {
            // turns out we should only work with Widget_shared directly, so we should be safe
            // to simply not support Spec<shared>
            throw new Error(`[❌] For now, Shared_Widget have been design to bypass spec hydratation completely.`)
            // option 1:
            // ⏸️ return new Widget_shared    (this.form, spec2, serial)
            // option 2:
            // ⏸️ return spec2.widget
        }
        if (type === 'optional') return new Widget_optional(this.form, parent, spec2, serial)
        if (type === 'bool') return new Widget_bool(this.form, parent, spec2, serial)
        if (type === 'str') return new Widget_string(this.form, parent, spec2, serial)
        if (type === 'prompt') return new Widget_prompt(this.form, parent, spec2, serial)
        if (type === 'choices') return new Widget_choices(this.form, parent, spec2, serial)
        if (type === 'number') return new Widget_number(this.form, parent, spec2, serial)
        if (type === 'color') return new Widget_color(this.form, parent, spec2, serial)
        if (type === 'enum') return new Widget_enum(this.form, parent, spec2, serial)
        if (type === 'list') return new Widget_list(this.form, parent, spec2, serial)
        if (type === 'orbit') return new Widget_orbit(this.form, parent, spec2, serial)
        if (type === 'listExt') return new Widget_listExt(this.form, parent, spec2, serial)
        if (type === 'button') return new Widget_button(this.form, parent, spec2, serial)
        if (type === 'seed') return new Widget_seed(this.form, parent, spec2, serial)
        if (type === 'matrix') return new Widget_matrix(this.form, parent, spec2, serial)
        if (type === 'image') return new Widget_image(this.form, parent, spec2, serial)
        if (type === 'selectOne') return new Widget_selectOne(this.form, parent, spec2, serial)
        if (type === 'selectMany') return new Widget_selectMany(this.form, parent, spec2, serial)
        if (type === 'size') return new Widget_size(this.form, parent, spec2, serial)
        if (type === 'spacer') return new Widget_spacer(this.form, parent, spec2, serial)
        if (type === 'markdown') return new Widget_markdown(this.form, parent, spec2, serial)
        if (type === 'custom') return new Widget_custom(this.form, parent, spec2, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)

        return new Widget_markdown(
            this.form,
            parent,
            new Spec<Widget_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }
}

export type CushyFormManager = FormManager<FormBuilder>
export const CushyFormManager: CushyFormManager = new FormManager<FormBuilder>(FormBuilder)
