import type { Entity } from '../csuite/model/Entity'
import type { IBuilder } from '../csuite/model/IBuilder'
import type { ISchema, SchemaDict } from '../csuite/model/ISchema'
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
import { Widget_link } from '../csuite/fields/link/WidgetLink'
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
import { BaseField } from '../csuite/model/BaseField'
import { Repository } from '../csuite/model/EntityManager'
import { openRouterInfos } from '../csuite/openrouter/OpenRouter_infos'
import { _FIX_INDENTATION } from '../csuite/utils/_FIX_INDENTATION'
import { Widget_prompt, type Widget_prompt_config } from '../prompt/WidgetPrompt'
import { type AutoBuilder, mkFormAutoBuilder } from './AutoBuilder'
import { EnumBuilder, EnumBuilderOpt, EnumListBuilder } from './EnumBuilder'
import { Schema } from './Schema'

// export type { SchemaDict } from './ISpec'
declare global {
    namespace X {
        type SchemaDict = import('../csuite/model/ISchema').SchemaDict
        type Builder = import('./Builder').Builder

        // field aliases
        type Shared<T extends ISchema> = Widget_shared<T>
        type Group<T extends SchemaDict> = Widget_group<T>
        type Empty = Widget_group<NO_PROPS>
        type Optional<T extends ISchema> = Widget_optional<T>
        type Bool = Widget_bool
        type Link<A extends ISchema, B extends ISchema> = Widget_link<A, B>
        type String = Widget_string
        type Prompt = Widget_prompt
        type Choices<T extends SchemaDict = SchemaDict> = Widget_choices<T>
        type Choice<T extends SchemaDict = SchemaDict> = Widget_choices<T>
        type Number = Widget_number
        type Color = Widget_color
        type Enum<T> = Widget_enum<T>
        type List<T extends ISchema> = Widget_list<T>
        type Orbit = Widget_orbit
        type ListExt<T extends ISchema> = Widget_listExt<T>
        type Button<T> = Widget_button<T>
        type Seed = Widget_seed
        type Matrix = Widget_matrix
        type Image = Widget_image
        type SelectOne<T extends BaseSelectEntry> = Widget_selectOne<T>
        type SelectMany<T extends BaseSelectEntry> = Widget_selectMany<T>
        type SelectOne_<T extends string> = Widget_selectOne<BaseSelectEntry<T>> // variant that may be shorter to read
        type SelectMany_<T extends string> = Widget_selectMany<BaseSelectEntry<T>> // variant that may be shorter to read
        type Size = Widget_size
        type Spacer = Widget_spacer
        type Markdown = Widget_markdown
        type Custom<T> = Widget_custom<T>

        // schema aliases
        type XShared<T extends ISchema> = Schema<Widget_shared<T['$Field']>>
        type XGroup<T extends SchemaDict> = Schema<Widget_group<T>>
        type XEmpty = Schema<Widget_group<NO_PROPS>>
        type XOptional<T extends ISchema> = Schema<Widget_optional<T>>
        type XBool = Schema<Widget_bool>
        type XLink<A extends ISchema, B extends ISchema> = Schema<Widget_link<A, B>>
        type XString = Schema<Widget_string>
        type XPrompt = Schema<Widget_prompt>
        type XChoices<T extends SchemaDict = SchemaDict> = Schema<Widget_choices<T>>
        type XChoice<T extends SchemaDict = SchemaDict> = Schema<Widget_choices<T>>
        type XNumber = Schema<Widget_number>
        type XColor = Schema<Widget_color>
        type XEnum<T> = Schema<Widget_enum<T>>
        type XList<T extends ISchema> = Schema<Widget_list<T>>
        type XOrbit = Schema<Widget_orbit>
        type XListExt<T extends ISchema> = Schema<Widget_listExt<T>>
        type XButton<T> = Schema<Widget_button<T>>
        type XSeed = Schema<Widget_seed>
        type XMatrix = Schema<Widget_matrix>
        type XImage = Schema<Widget_image>
        type XSelectOne<T extends BaseSelectEntry> = Schema<Widget_selectOne<T>>
        type XSelectMany<T extends BaseSelectEntry> = Schema<Widget_selectMany<T>>
        type XSelectOne_<T extends string> = Schema<Widget_selectOne<BaseSelectEntry<T>>> // variant that may be shorter to read
        type XSelectMany_<T extends string> = Schema<Widget_selectMany<BaseSelectEntry<T>>> // variant that may be shorter to read
        type XSize = Schema<Widget_size>
        type XSpacer = Schema<Widget_spacer>
        type XMarkdown = Schema<Widget_markdown>
        type XCustom<T> = Schema<Widget_custom<T>>
    }
}

/** cushy studio form builder */
export class Builder implements IBuilder {
    SpecCtor = Schema

    /**
     * (@internal) don't call this yourself
     *
     * empty model/entity to build
     * API is a bit weird; but since every project
     * can have different widgets, we need all of those features
     * to be moved in a dedicated file, outside of the model/entity file
     */
    constructor() {
        // public model: Model<ISchema, Builder>,
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
        return new Schema<Widget_string>('str', { inputType: 'time', ...config })
    }
    date = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { inputType: 'date', ...config })
    }
    datetime = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { inputType: 'datetime-local', ...config })
    }
    password = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { inputType: 'password', ...config })
    }
    email = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { inputType: 'email', ...config })
    }
    url = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { inputType: 'url', ...config })
    }
    string = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', config)
    }
    text = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', config)
    }
    textarea = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { textarea: true, ...config })
    }
    boolean = (config: Widget_bool_config = {}): X.XBool => {
        return new Schema<Widget_bool>('bool', config)
    }
    bool = (config: Widget_bool_config = {}): X.XBool => {
        return new Schema<Widget_bool>('bool', config)
    }
    size = (config: Widget_size_config = {}): X.XSize => {
        return new Schema<Widget_size>('size', config)
    }
    spacer = (config: Widget_spacer_config = {}): X.XSpacer => {
        return new Schema<Widget_spacer>('spacer', { justifyLabel: false, label: false, collapsed: false, border: false })
    }
    orbit = (config: Widget_orbit_config = {}): X.XOrbit => {
        return new Schema<Widget_orbit>('orbit', config)
    }
    seed = (config: Widget_seed_config = {}): X.XSeed => {
        return new Schema<Widget_seed>('seed', config)
    }
    color = (config: Widget_color_config = {}): X.XColor => {
        return new Schema<Widget_color>('color', config)
    }
    colorV2 = (config: Widget_string_config = {}): X.XString => {
        return new Schema<Widget_string>('str', { inputType: 'color', ...config })
    }
    matrix = (config: Widget_matrix_config): X.XMatrix => {
        return new Schema<Widget_matrix>('matrix', config)
    }
    button = <K>(config: Widget_button_config<K>): X.XButton<K> => {
        return new Schema<Widget_button<K>>('button', config)
    }
    /** variants: `header` */
    markdown = (config: Widget_markdown_config | string): X.XMarkdown => {
        return new Schema<Widget_markdown>('markdown', typeof config === 'string' ? { markdown: config } : config)
    }
    /** [markdown variant]: inline=true, label=false */
    header = (config: Widget_markdown_config | string): X.XMarkdown => {
        const config_: Widget_markdown_config =
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, justifyLabel: false, ...config }
        return new Schema<Widget_markdown>('markdown', config_)
    }
    image = (config: Widget_image_config = {}): X.XImage => {
        return new Schema<Widget_image>('image', config)
    }
    prompt = (config: Widget_prompt_config = {}): X.XPrompt => {
        return new Schema<Widget_prompt>('prompt', config)
    }
    int = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Schema<Widget_number>('number', { mode: 'int', ...config })
    }
    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Schema<Widget_number>('number', {
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
        return new Schema<Widget_number>('number', { mode: 'float', ...config })
    }
    number = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return new Schema<Widget_number>('number', { mode: 'float', ...config })
    }
    remSize = (config: Omit<Widget_number_config, 'mode'> = {}): X.XNumber => {
        return this.number({ min: 1, max: 20, default: 2, step: 1, unit: 'rem', suffix: 'rem' })
    }
    custom = <T>(config: Widget_custom_config<T>): X.XCustom<T> => {
        return new Schema<Widget_custom<T>>('custom', config)
    }
    list = <T extends ISchema>(config: Widget_list_config<T>): X.XList<T> => {
        return new Schema<Widget_list<T>>('list', config)
    }
    listExt = <T extends ISchema>(config: Widget_listExt_config<T>): X.XListExt<T> => {
        return new Schema<Widget_listExt<T>>('listExt', config)
    }
    timeline = <T extends ISchema>(config: Widget_listExt_config<T>): X.XListExt<T> => {
        return new Schema<Widget_listExt<T>>('listExt', { mode: 'timeline', ...config })
    }
    regional = <T extends ISchema>(config: Widget_listExt_config<T>): X.XListExt<T> => {
        return new Schema<Widget_listExt<T>>('listExt', { mode: 'regional', ...config })
    }
    selectOneV2 = <T extends string>(
        p: readonly T[],
        config: Omit<Widget_selectOne_config<BaseSelectEntry<T>>, 'choices'> = {},
    ): X.XSelectOne_<T> => {
        return new Schema<Widget_selectOne<BaseSelectEntry<T>>>('selectOne', {
            choices: p.map((id) => ({ id, label: id })),
            appearance: 'tab',
            ...config,
        })
    }
    selectOne = <const T extends BaseSelectEntry>(config: Widget_selectOne_config<T>): X.XSelectOne<T> => {
        return new Schema<Widget_selectOne<T>>('selectOne', config)
    }
    selectMany = <const T extends BaseSelectEntry>(config: Widget_selectMany_config<T>): X.XSelectMany<T> => {
        return new Schema<Widget_selectMany<T>>('selectMany', config)
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
    ): X.XLink<SCHEMA1, SCHEMA2> {
        return new Schema<Widget_link<SCHEMA1, SCHEMA2>>('link', { share: injected, children })
    }

    /**
     * @since 2024-06-27
     * @stability unstable
     */
    linkedV0 = <T extends BaseField>(fn: (parent: BaseField) => T): X.XShared<T> => {
        return new Schema<Widget_shared<T>>('shared', { widget: fn })
    }

    linked = <T extends BaseField>(parent: T): X.XShared<T> => {
        return new Schema<Widget_shared<T>>('shared', { widget: () => parent })
    }

    /** see also: `fields` for a more practical api */
    group = <T extends SchemaDict>(config: Widget_group_config<T> = {}): X.XGroup<T> => {
        return new Schema<Widget_group<T>>('group', config)
    }
    /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
    column = <T extends SchemaDict>(config: Widget_group_config<T> = {}): X.XGroup<T> => {
        return new Schema<Widget_group<T>>('group', { border: false, label: false, collapsed: false, ...config })
    }
    /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
    row = <T extends SchemaDict>(config: Widget_group_config<T> = {}): X.XGroup<T> => {
        return new Schema<Widget_group<T>>('group', { border: false, label: false, collapsed: false, layout: 'H', ...config })
    }
    /** simpler way to create `group` */
    fields = <T extends SchemaDict>(fields: T, config: Omit<Widget_group_config<T>, 'items'> = {}): X.XGroup<T> => {
        return new Schema<Widget_group<T>>('group', { items: fields, ...config })
    }
    choice = <T extends { [key: string]: ISchema }>(config: Omit<Widget_choices_config<T>, 'multi'>): X.XChoice<T> => {
        return new Schema<Widget_choices<T>>('choices', { multi: false, ...config })
    }
    choiceV2 = <T extends { [key: string]: ISchema }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ): X.XChoice<T> => {
        return new Schema<Widget_choices<T>>('choices', { multi: false, items, ...config })
    }
    choices = <T extends { [key: string]: ISchema }>(config: Omit<Widget_choices_config<T>, 'multi'>): X.XChoices<T> => {
        return new Schema<Widget_choices<T>>('choices', { multi: true, ...config })
    }
    choicesV2 = <T extends { [key: string]: ISchema }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<T>, 'multi' | 'items'> = {},
    ): X.XChoices<T> => {
        return new Schema<Widget_choices<T>>('choices', { items, multi: true, appearance: 'tab', ...config })
    }
    empty = (config: Widget_group_config<NO_PROPS> = {}): X.XEmpty => {
        return new Schema<Widget_group<NO_PROPS>>('group', config)
    }
    /** simple choice alternative api */
    tabs = <T extends { [key: string]: ISchema }>(
        items: Widget_choices_config<T>['items'],
        config: Omit<Widget_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ) => new Schema<Widget_choices<T>>('choices', { items, multi: false, ...config, appearance: 'tab' })
    // optional wrappers
    optional = <T extends ISchema>(p: Widget_optional_config<T>) => new Schema<Widget_optional<T>>('optional', p)
    llmModel = (p: { default?: OpenRouter_Models } = {}) => {
        const choices = Object.entries(openRouterInfos).map(([id, info]) => ({ id: id as OpenRouter_Models, label: info.name }))
        const def = choices ? choices.find((c) => c.id === p.default) : undefined
        return this.selectOne({ default: def, choices })
    }

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
        const _ = new EnumBuilder(this) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'enum', { value: _ })
        return _
    }
    get enums(): EnumListBuilder {
        const _ = new EnumListBuilder(this) /*<const T extends KnownEnumNames>*/
        Object.defineProperty(this, 'enums', { value: _ })
        return _
    }
    get enumOpt() {
        const _ = new EnumBuilderOpt(this)
        Object.defineProperty(this, 'enumOpt', { value: _ })
        return _
    }

    _FIX_INDENTATION = _FIX_INDENTATION

    _HYDRATE = <T extends ISchema>( //
        model: Entity<any>,
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): T['$Field'] => {
        // 1. instanciate the widget
        const w = this.__HYDRATE(model, parent, spec, serial) as T['$Field']

        // 2. start publish mechanism
        w.publishValue()

        // 3. start reactions & subscribe mechanism
        // 🔴 TODO: Need to dispose later
        for (const { expr, effect } of spec.reactions) {
            reaction(
                () => expr(w),
                (arg) => effect(arg, w),
                { fireImmediately: true },
            )
        }
        return w
    }

    /** (@internal) advanced way to restore form state. used internally */
    private __HYDRATE = <T extends ISchema>( //
        model: Entity<any>,
        parent: BaseField | null,
        spec: T,
        serial: any | null,
    ): BaseField<any> => {
        // ensure the serial is compatible
        if (serial != null && serial.type !== spec.type) {
            console.log(`[🔶] INVALID SERIAL (expected: ${spec.type}, got: ${serial.type})`)
            serial = null
        }
        // if we've been given an already instanciated widget, we just return it
        if (spec instanceof BaseField) return spec

        // invalid schema => we just crash
        if (!(spec instanceof Schema)) {
            throw new Error(`[❌] _HYDRATE received an invalid unmounted widget. This is probably a bug.`)
        }

        const type = spec.type
        const spec2 = spec as any

        if (type === 'group') return new Widget_group(model, parent, spec2, serial, model._ROOT ? undefined : (x) => { model._ROOT = x }) // prettier-ignore
        if (type === 'shared') return new Widget_shared(model, parent, spec2, serial)
        if (type === 'link') return new Widget_link(model, parent, spec2, serial)
        if (type === 'optional') return new Widget_optional(model, parent, spec2, serial)
        if (type === 'bool') return new Widget_bool(model, parent, spec2, serial)
        if (type === 'str') return new Widget_string(model, parent, spec2, serial)
        if (type === 'prompt') return new Widget_prompt(model, parent, spec2, serial)
        if (type === 'choices') return new Widget_choices(model, parent, spec2, serial)
        if (type === 'number') return new Widget_number(model, parent, spec2, serial)
        if (type === 'color') return new Widget_color(model, parent, spec2, serial)
        if (type === 'enum') return new Widget_enum(model, parent, spec2, serial)
        if (type === 'list') return new Widget_list(model, parent, spec2, serial)
        if (type === 'orbit') return new Widget_orbit(model, parent, spec2, serial)
        if (type === 'listExt') return new Widget_listExt(model, parent, spec2, serial)
        if (type === 'button') return new Widget_button(model, parent, spec2, serial)
        if (type === 'seed') return new Widget_seed(model, parent, spec2, serial)
        if (type === 'matrix') return new Widget_matrix(model, parent, spec2, serial)
        if (type === 'image') return new Widget_image(model, parent, spec2, serial)
        if (type === 'selectOne') return new Widget_selectOne(model, parent, spec2, serial)
        if (type === 'selectMany') return new Widget_selectMany(model, parent, spec2, serial)
        if (type === 'size') return new Widget_size(model, parent, spec2, serial)
        if (type === 'spacer') return new Widget_spacer(model, parent, spec2, serial)
        if (type === 'markdown') return new Widget_markdown(model, parent, spec2, serial)
        if (type === 'custom') return new Widget_custom(model, parent, spec2, serial)

        console.log(`🔴 unknown widget "${type}" in serial.`)

        return new Widget_markdown(
            model,
            parent,
            new Schema<Widget_markdown>('markdown', { markdown: `🔴 unknown widget "${type}" in serial.` }),
        )
    }

    /** (@internal); */ _cache: { count: number } = { count: 0 }
}

export const builder = new Builder()
export type CushyRepo = Repository<Builder>
export const cushyRepo: CushyRepo = new Repository<Builder>(builder)

/**
 * Calling this function will mount and instanciate the subform right away
 * Subform will be register in the root form `group`, using `__${key}__` as the key
 * This is a core abstraction that enables features like
 *  - mountting a widget at several places in the form
 *  - recursive forms
 *  - dynamic widgets depending on other widgets values
 * */
// shared = <W extends ISchema>(key: string, spec: W): Widget_shared<W> => {
//     const field = this.model.hydrateSubtree(key, spec)
//     const sharedSpec = new Schema<Widget_shared<W>>('shared', { rootKey: key, widget: field })
//     return new Widget_shared<W>(this.model, null, sharedSpec) as any
// }
