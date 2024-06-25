import type { BaseField } from '../csuite/model/BaseField'
import type { IBlueprint, SchemaDict } from '../csuite/model/IBlueprint'
import type { Domain } from '../csuite/model/IDomain'
import type { Model } from '../csuite/model/Model'
import type { OpenRouter_Models } from '../csuite/openrouter/OpenRouter_models'
import type { NO_PROPS } from '../csuite/types/NO_PROPS'

import { makeAutoObservable, reaction } from 'mobx'

import { Widget_bool, type Widget_bool_config } from '../csuite/fields/bool/WidgetBool'
import { Widget_button, type Widget_button_config } from '../csuite/fields/button/WidgetButton'
import { Widget_choices, type Widget_choices_config } from '../csuite/fields/choices/WidgetChoices'
import { Widget_color, type Widget_color_config } from '../csuite/fields/color/WidgetColor'
import { Widget_custom, type Widget_custom_config } from '../csuite/fields/custom/WidgetCustom'
import { Widget_enum } from '../csuite/fields/enum/WidgetEnum'
import { Widget_group, type Widget_group_config } from '../csuite/fields/group/WidgetGroup'
import { Widget_image, type Widget_image_config } from '../csuite/fields/image/WidgetImage'
import { Widget_list, type Widget_list_config } from '../csuite/fields/list/WidgetList'
import { Widget_listExt, type Widget_listExt_config } from '../csuite/fields/listExt/WidgetListExt'
import { Widget_markdown, Widget_markdown_config } from '../csuite/fields/markdown/WidgetMarkdown'
import { Widget_matrix, type Widget_matrix_config } from '../csuite/fields/matrix/WidgetMatrix'
import { Widget_number, type Widget_number_config } from '../csuite/fields/number/WidgetNumber'
import { Widget_optional, type Widget_optional_config } from '../csuite/fields/optional/WidgetOptional'
import { Widget_orbit, type Widget_orbit_config } from '../csuite/fields/orbit/WidgetOrbit'
import { Widget_seed, type Widget_seed_config } from '../csuite/fields/seed/WidgetSeed'
import { Widget_selectMany, type Widget_selectMany_config } from '../csuite/fields/selectMany/WidgetSelectMany'
import { type BaseSelectEntry, Widget_selectOne, type Widget_selectOne_config } from '../csuite/fields/selectOne/WidgetSelectOne'
import { Widget_shared } from '../csuite/fields/shared/WidgetShared'
import { Widget_size, type Widget_size_config } from '../csuite/fields/size/WidgetSize'
import { Widget_spacer, type Widget_spacer_config } from '../csuite/fields/spacer/WidgetSpacer'
import { Widget_string, type Widget_string_config } from '../csuite/fields/string/WidgetString'
import { ModelManager } from '../csuite/model/ModelManager'
import { openRouterInfos } from '../csuite/openrouter/OpenRouter_infos'
import { _FIX_INDENTATION } from '../csuite/utils/_FIX_INDENTATION'
import { Widget_prompt, type Widget_prompt_config } from '../prompt/WidgetPrompt'
import { type AutoBuilder, mkFormAutoBuilder } from './AutoBuilder'
import { Blueprint } from './Blueprint'
import { EnumBuilder, EnumBuilderOpt, EnumListBuilder } from './EnumBuilder'

// export type { SchemaDict } from './ISpec'
declare global {
    namespace X {
        type SchemaDict = import('../csuite/model/IBlueprint').SchemaDict
        type FormBuilder = import('./FormBuilder').FormBuilder

        // attempt to make type safety better --------------------------------------------------------
        type Shared<T extends IBlueprint> = Widget_shared<T>
        type XGroup<T extends SchemaDict> = Blueprint<Widget_group<T>>
        type XEmpty = Blueprint<Widget_group<NO_PROPS>>
        type XOptional<T extends IBlueprint> = Blueprint<Widget_optional<T>>
        type XBool = Blueprint<Widget_bool>
        type XShared<T extends IBlueprint> = Widget_shared<T>
        type XString = Blueprint<Widget_string>
        type XPrompt = Blueprint<Widget_prompt>
        type XChoices<T extends SchemaDict = SchemaDict> = Blueprint<Widget_choices<T>>
        type XChoice<T extends SchemaDict = SchemaDict> = Blueprint<Widget_choices<T>>
        type XNumber = Blueprint<Widget_number>
        type XColor = Blueprint<Widget_color>
        type XEnum<T> = Blueprint<Widget_enum<T>>
        type XList<T extends IBlueprint> = Blueprint<Widget_list<T>>
        type XOrbit = Blueprint<Widget_orbit>
        type XListExt<T extends IBlueprint> = Blueprint<Widget_listExt<T>>
        type XButton<T> = Blueprint<Widget_button<T>>
        type XSeed = Blueprint<Widget_seed>
        type XMatrix = Blueprint<Widget_matrix>
        type XImage = Blueprint<Widget_image>
        type XSelectOne<T extends BaseSelectEntry> = Blueprint<Widget_selectOne<T>>
        type XSelectMany<T extends BaseSelectEntry> = Blueprint<Widget_selectMany<T>>
        type XSelectOne_<T extends string> = Blueprint<Widget_selectOne<BaseSelectEntry<T>>> // variant that may be shorter to read
        type XSelectMany_<T extends string> = Blueprint<Widget_selectMany<BaseSelectEntry<T>>> // variant that may be shorter to read
        type XSize = Blueprint<Widget_size>
        type XSpacer = Blueprint<Widget_spacer>
        type XMarkdown = Blueprint<Widget_markdown>
        type XCustom<T> = Blueprint<Widget_custom<T>>
    }
}

/** cushy studio form builder */
export class FormBuilder implements Domain {
    SpecCtor = Blueprint

    /** (@internal) don't call this yourself */
    constructor(public form: Model<IBlueprint, FormBuilder>) {
        makeAutoObservable(this, {
            auto: false,
            autoField: false,
            enum: false,
            enums: false,
            enumOpt: false,
            SpecCtor: false,
        })
    }

    time = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'time', ...config })
    }
    date = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'date', ...config })
    }
    datetime = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'datetime-local', ...config })
    }
    password = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'password', ...config })
    }
    email = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'email', ...config })
    }
    url = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'url', ...config })
    }
    string = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', config)
    }
    text = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', config)
    }
    textarea = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { textarea: true, ...config })
    }
    boolean = (config: Widget_bool_config = {}): X.XBool => {
        return new Blueprint<Widget_bool>('bool', config)
    }
    bool = (config: Widget_bool_config = {}): X.XBool => {
        return new Blueprint<Widget_bool>('bool', config)
    }
    size = (config: Widget_size_config = {}): X.XSize => {
        return new Blueprint<Widget_size>('size', config)
    }
    spacer = (config: Widget_spacer_config = {}): X.XSpacer => {
        return new Blueprint<Widget_spacer>('spacer', { justifyLabel: false, label: false, collapsed: false, border: false })
    }
    orbit = (config: Widget_orbit_config = {}): X.XOrbit => {
        return new Blueprint<Widget_orbit>('orbit', config)
    }
    seed = (config: Widget_seed_config = {}): X.XSeed => {
        return new Blueprint<Widget_seed>('seed', config)
    }
    color = (config: Widget_color_config = {}): X.XColor => {
        return new Blueprint<Widget_color>('color', config)
    }
    colorV2 = (config: Widget_string_config = {}): X.XString => {
        return new Blueprint<Widget_string>('str', { inputType: 'color', ...config })
    }
    matrix = (config: Widget_matrix_config): X.XMatrix => {
        return new Blueprint<Widget_matrix>('matrix', config)
    }
    button = <K>(config: Widget_button_config<K>): X.XButton<K> => {
        return new Blueprint<Widget_button<K>>('button', config)
    }
    /** variants: `header` */
    markdown = (config: Widget_markdown_config | string): X.XMarkdown => {
        return new Blueprint<Widget_markdown>('markdown', typeof config === 'string' ? { markdown: config } : config)
    }
    /** [markdown variant]: inline=true, label=false */
    header = (config: Widget_markdown_config | string): X.XMarkdown => {
        const config_: Widget_markdown_config =
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, justifyLabel: false, ...config }
        return new Blueprint<Widget_markdown>('markdown', config_)
    }
    image = (config: Widget_image_config = {}): X.XImage => {
        return new Blueprint<Widget_image>('image', config)
    }
    prompt = (config: Widget_prompt_config = {}): X.XPrompt => {
        return new Blueprint<Widget_prompt>('prompt', config)
    }
    int = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Blueprint<Widget_number>('number', { mode: 'int', ...config })
    }
    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Blueprint<Widget_number>('number', {
            mode: 'int',
            default: 100,
            step: 10,
            min: 0,
            max: 100,
            suffix: '%',
            ...config,
        })
    }
    float = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Blueprint<Widget_number>('number', { mode: 'float', ...config })
    }
    number = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Blueprint<Widget_number>('number', { mode: 'float', ...config })
    }
    remSize = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return this.number({ min: 1, max: 20, default: 2, step: 1, unit: 'rem', suffix: 'rem' })
    }
    custom = <T>(config: Widget_custom_config<T>): X.XCustom<T> => {
        return new Blueprint<Widget_custom<T>>('custom', config)
    }
    list = <T extends IBlueprint>(config: Widget_list_config<T>): X.XList<T> => {
        return new Blueprint<Widget_list<T>>('list', config)
    }
    listExt = <T extends IBlueprint>(config: Widget_listExt_config<T>): X.XListExt<T> => {
        return new Blueprint<Widget_listExt<T>>('listExt', config)
    }
    timeline = <T extends IBlueprint>(config: Widget_listExt_config<T>): X.XListExt<T> => {
        return new Blueprint<Widget_listExt<T>>('listExt', { mode: 'timeline', ...config })
    }
    regional = <T extends IBlueprint>(config: Widget_listExt_config<T>): X.XListExt<T> => {
        return new Blueprint<Widget_listExt<T>>('listExt', { mode: 'regional', ...config })
    }
    selectOneV2 = <T extends string>(
        p: T[],
        config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): X.XSelectOne_<T> => {
        return new Blueprint<Widget_selectOne<BaseSelectEntry<T>>>('selectOne', { choices: p.map((id) => ({ id, label: id })), appearance:'tab', ...config }) // prettier-ignore
    }
    selectOne = <const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>): X.XSelectOne<T> => {
        return new Blueprint<Widget_selectOne<T>>('selectOne', config)
    }
    selectMany = <const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>): X.XSelectMany<T> => {
        return new Blueprint<Widget_selectMany<T>>('selectMany', config)
    }
    /** see also: `fields` for a more practical api */
    group = <T extends SchemaDict>(config: Widget_group_config<T> = {}): X.XGroup<T> => {
        return new Blueprint<Widget_group<T>>('group', config)
    }
    /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
    column = <T extends SchemaDict>(config: Widget_group_config<T> = {}): X.XGroup<T> => {
        return new Blueprint<Widget_group<T>>('group', { border: false, label: false, collapsed: false, ...config })
    }
    /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
    row = <T extends SchemaDict>(config: Widget_group_config<T> = {}): X.XGroup<T> => {
        return new Blueprint<Widget_group<T>>('group', { border: false, label: false, collapsed: false, layout: 'H', ...config })
    }
    /** simpler way to create `group` */
    fields = <T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}): X.XGroup<T> => {
        return new Blueprint<Widget_group<T>>('group', { items: fields, ...config })
    }
    choice = <T extends { [key: string]: IBlueprint }>(config: Omit<Widget_choices_config<T>, 'multi'>): X.XChoice<T> => {
        return new Blueprint<Widget_choices<T>>('choices', { multi: false, ...config })
    }
    choiceV2 = <T extends { [key: string]: IBlueprint }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ): X.XChoice<T> => {
        return new Blueprint<Widget_choices<T>>('choices', { multi: false, items, ...config })
    }
    choices = <T extends { [key: string]: IBlueprint }>(config: Omit<Widget_choices_config<T>, 'multi'>): X.XChoices<T> => {
        return new Blueprint<Widget_choices<T>>('choices', { multi: true, ...config })
    }
    choicesV2 = <T extends { [key: string]: IBlueprint }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ): X.XChoices<T> => {
        return new Blueprint<Widget_choices<T>>('choices', { items, multi: true, appearance: 'tab', ...config })
    }
    empty = (config: Widget_group_config<NO_PROPS> = {}): X.XEmpty => {
        return new Blueprint<Widget_group<NO_PROPS>>('group', config)
    }
    /** simple choice alternative api */
    tabs = <T extends { [key: string]: IBlueprint }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ) => new Blueprint<Widget_choices<T>>('choices', { items, multi: false, ...config, appearance: 'tab' })
    // optional wrappers
    optional = <T extends IBlueprint>(p: Widget_optional_config<T>) => new Blueprint<Widget_optional<T>>('optional', p)
    llmModel = (p: { default?: OpenRouter_Models } = {}) => {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = choices ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

    // /** @deprecated ; if you need this widget, you should copy paste that into a prefab */
    // inlineRun = (config: Widget_button_config = {}) =>
    //     new Spec<Widget_button<DraftL>>('button', {
    //         useContext: useDraft,
    //         onClick: (p) =>
    //             runInAction(() => {
    //                 if (p.widget.value === true) return
    //                 const draft = p.context
    //                 p.widget.value = true
    //                 draft.setAutostart(false)
    //                 draft.start({})
    //                 setTimeout(() => (p.widget.value = false), 100) // Reset value back to false for future runs
    //                 p.widget.bumpValue()
    //             }),
    //         icon: (p) => {
    //             if (p.context.shouldAutoStart) return 'pause'
    //             return 'play_arrow'
    //         },
    //         ...config,
    //     })

    /**
     * Calling this function will mount and instanciate the subform right away
     * Subform will be register in the root form `group`, using `__${key}__` as the key
     * This is a core abstraction that enables features like
     *  - mountting a widget at several places in the form
     *  - recursive forms
     *  - dynamic widgets depending on other widgets values
     * */
    shared = <W extends IBlueprint>(key: string, spec: W): Widget_shared<W> => {
        const prevSerial = this.form.shared[key]
        let widget
        if (prevSerial && prevSerial.type === spec.type) {
            widget = this._HYDRATE(null, spec, prevSerial)
        } else {
            widget = this._HYDRATE(null, spec, null)
        }
        this.form.shared[key] = widget.serial
        this.form.knownShared.set(key, widget)
        const sharedSpec = new Blueprint<Widget_shared<W>>('shared', { rootKey: key, widget })
        return new Widget_shared<W>(this.form, null, sharedSpec) as any
    }

    // --------------------

    // enum = /*<const T extends KnownEnumNames>*/ (config: Widget_enum_config<any, any>) => new Widget_enum(this.form, config)
    get auto(): AutoBuilder {
        const _ = mkFormAutoBuilder(this) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'auto', { value: _ })
        return _
    }
    get autoField(): AutoBuilder {
        const _ = mkFormAutoBuilder(this)
        Object.defineProperty(this, 'autoField', { value: _ })
        return _
    }
    get enum(): EnumBuilder {
        const _ = new EnumBuilder(this.form) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'enum', { value: _ })
        return _
    }
    get enums(): EnumListBuilder {
        const _ = new EnumListBuilder(this.form) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'enums', { value: _ })
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
    private __HYDRATE = <T extends IBlueprint>( //
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): BaseField<any> /* T['$Field'] */ => {
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

        if (!(spec instanceof Blueprint)) {
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
            new Blueprint<Widget_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }

    _HYDRATE = <T extends IBlueprint>( //
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): T['$Field'] => {
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
}

export type CushyFormManager = ModelManager<FormBuilder>
export const CushyFormManager: CushyFormManager = new ModelManager<FormBuilder>(FormBuilder)
