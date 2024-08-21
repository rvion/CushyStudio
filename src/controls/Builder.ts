import type { BaseSchema } from '../csuite/model/BaseSchema'
import type { IBuilder } from '../csuite/model/IBuilder'
import type { SchemaDict } from '../csuite/model/SchemaDict'
import type { OpenRouter_Models } from '../csuite/openrouter/OpenRouter_models'
import type { NO_PROPS } from '../csuite/types/NO_PROPS'
import type { PartialOmit } from '../types/Misc'

import { makeAutoObservable } from 'mobx'

import { simpleBuilder } from '../csuite'
import { SpacerUI } from '../csuite/components/SpacerUI'
import { Field_bool, type Field_bool_config } from '../csuite/fields/bool/FieldBool'
import { Field_button, type Field_button_config } from '../csuite/fields/button/FieldButton'
import { Field_choices, type Field_choices_config } from '../csuite/fields/choices/FieldChoices'
import { Field_color, type Field_color_config } from '../csuite/fields/color/FieldColor'
import { Field_custom, type Field_custom_config } from '../csuite/fields/custom/FieldCustom'
import { Field_enum } from '../csuite/fields/enum/FieldEnum'
import { Field_group, type Field_group_config, type FieldGroup } from '../csuite/fields/group/FieldGroup'
import { Field_image, type Field_image_config } from '../csuite/fields/image/FieldImage'
import { Field_link } from '../csuite/fields/link/FieldLink'
import { Field_list, type Field_list_config } from '../csuite/fields/list/FieldList'
import { mkShapeSchema, type ShapeSchema } from '../csuite/fields/listExt/ShapeSchema'
import { type Field_listExt_config, listExt, type SListExt } from '../csuite/fields/listExt/WidgetListExt'
import { WidgetListExtUI__Regional, WidgetListExtUI__Timeline } from '../csuite/fields/listExt/WidgetListExtUI'
import { Field_markdown, Field_markdown_config } from '../csuite/fields/markdown/FieldMarkdown'
import { Field_matrix, type Field_matrix_config } from '../csuite/fields/matrix/FieldMatrix'
import { Field_number, type Field_number_config } from '../csuite/fields/number/FieldNumber'
import { Field_optional, type Field_optional_config } from '../csuite/fields/optional/FieldOptional'
import { Field_orbit, type Field_orbit_config } from '../csuite/fields/orbit/FieldOrbit'
import { Field_seed, type Field_seed_config } from '../csuite/fields/seed/FieldSeed'
import { Field_selectMany, type Field_selectMany_config } from '../csuite/fields/selectMany/FieldSelectMany'
import { Field_selectOne, type Field_selectOne_config } from '../csuite/fields/selectOne/FieldSelectOne'
import { type SelectOption, type SelectOption_NO_VALUE } from '../csuite/fields/selectOne/SelectOption'
import { Field_shared } from '../csuite/fields/shared/FieldShared'
import { Field_size, type Field_size_config } from '../csuite/fields/size/FieldSize'
import { Field_string, type Field_string_config } from '../csuite/fields/string/FieldString'
import { Factory } from '../csuite/model/Factory'
import { Field } from '../csuite/model/Field'
import { type OpenRouter_ModelInfo, openRouterInfos } from '../csuite/openrouter/OpenRouter_infos'
import { _FIX_INDENTATION } from '../csuite/utils/_FIX_INDENTATION'
import { bang } from '../csuite/utils/bang'
import { Field_prompt, type Field_prompt_config } from '../prompt/FieldPrompt'
import { type AutoBuilder, mkFormAutoBuilder } from './AutoBuilder'
import { EnumBuilder, EnumBuilderOpt, EnumListBuilder } from './EnumBuilder'
import { Schema } from './Schema'

declare global {
    namespace X {
        type SchemaDict = import('../csuite/model/SchemaDict').SchemaDict
        type Builder = import('./Builder').Builder
        type Field = import('../csuite/model/Field').Field
        type BaseSchema<out FIELD extends Field = Field> = import('../csuite/model/BaseSchema').BaseSchema<FIELD>

        type Runtime = import('../runtime/Runtime').Runtime

        // field aliases
        type Shared<T extends Field> = Field_shared<T>
        type Group<T extends SchemaDict> = Field_group<T>
        type Empty = Field_group<NO_PROPS>
        type Optional<T extends BaseSchema> = Field_optional<T>
        type Bool = Field_bool
        type Link<A extends BaseSchema, B extends BaseSchema> = Field_link<A, B>
        type String = Field_string
        type Prompt = Field_prompt
        type Choices<T extends SchemaDict = SchemaDict> = Field_choices<T>
        type Choice<T extends SchemaDict = SchemaDict> = Field_choices<T>
        type Number = Field_number
        type Color = Field_color
        type Enum<T> = Field_enum<T>
        type List<T extends BaseSchema> = Field_list<T>
        type Orbit = Field_orbit
        // type ListExt<T extends BaseSchema> = Field_listExt<T>
        type Button<T> = Field_button<T>
        type Seed = Field_seed
        type Matrix = Field_matrix
        type Image = Field_image
        type SelectOne<T, KEY extends string> = Field_selectOne<T, KEY>
        type SelectMany<T, KEY extends string> = Field_selectMany<T, KEY>
        type SelectOne_<T extends string> = Field_selectOne<T, T> // variant that may be shorter to read
        type SelectMany_<T extends string> = Field_selectMany<T, T> // variant that may be shorter to read
        type Size = Field_size
        type Markdown = Field_markdown
        type Custom<T> = Field_custom<T>

        // schema aliases
        type XShared<T extends Field> = Schema<Field_shared<T>>
        type XGroup<T extends SchemaDict> = Schema<FieldGroup<T>>
        type XGroup_<T extends SchemaDict> = Schema<Field_group<T>>
        type XEmpty = Schema<Field_group<NO_PROPS>>
        type XOptional<T extends BaseSchema> = Schema<Field_optional<T>>
        type XBool = Schema<Field_bool>
        type XLink<A extends BaseSchema, B extends BaseSchema> = Schema<Field_link<A, B>>
        type XString = Schema<Field_string>
        type XPrompt = Schema<Field_prompt>
        type XChoices<T extends SchemaDict = SchemaDict> = Schema<Field_choices<T>>
        type XChoice<T extends SchemaDict = SchemaDict> = Schema<Field_choices<T>>
        type XNumber = Schema<Field_number>
        type XColor = Schema<Field_color>
        type XEnum<T> = Schema<Field_enum<T>>
        type XList<T extends BaseSchema> = Schema<Field_list<T>>
        type XOrbit = Schema<Field_orbit>
        type XListExt<T extends BaseSchema> = SListExt<T>
        type XButton<T> = Schema<Field_button<T>>
        type XSeed = Schema<Field_seed>
        type XMatrix = Schema<Field_matrix>
        type XImage = Schema<Field_image>

        type XSelectOne<T, ID extends string> = Schema<Field_selectOne<T, ID>>
        type XSelectMany<T, ID extends string> = Schema<Field_selectMany<T, ID>>
        type XSelectOne_<T extends string> = Schema<Field_selectOne<T, T>> // variant that may be shorter to read
        type XSelectMany_<T extends string> = Schema<Field_selectMany<T, T>> // variant that may be shorter to read

        type XSize = Schema<Field_size>
        type XMarkdown = Schema<Field_markdown>
        type XCustom<T> = Schema<Field_custom<T>>
    }
}

/** cushy studio form builder */
export class Builder implements IBuilder {
    constructor() {
        // public model: Model<BaseSchema, Builder>,
        makeAutoObservable(this, {
            auto: false,
            autoField: false,
            enum: false,
            enums: false,
            enumOpt: false,
        })
    }

    time(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'time', ...config })
    }

    date(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'date', ...config })
    }

    datetime(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'datetime-local', ...config })
    }

    password(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'password', ...config })
    }

    email(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'email', ...config })
    }

    url(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'url', ...config })
    }

    string(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, config)
    }

    text(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, config)
    }

    textarea(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { textarea: true, ...config })
    }

    boolean(config: Field_bool_config = {}): X.XBool {
        return new Schema<Field_bool>(Field_bool, config)
    }

    bool(config: Field_bool_config = {}): X.XBool {
        return new Schema<Field_bool>(Field_bool, config)
    }

    size(config: Field_size_config = {}): X.XSize {
        return new Schema<Field_size>(Field_size, config)
    }

    spacer(): X.XBool {
        return this.bool({ header: SpacerUI, justifyLabel: false, label: false, collapsed: false, border: false })
    }

    orbit(config: Field_orbit_config = {}): X.XOrbit {
        return new Schema<Field_orbit>(Field_orbit, config)
    }

    seed(config: Field_seed_config = {}): X.XSeed {
        return new Schema<Field_seed>(Field_seed, config)
    }

    color(config: Field_color_config = {}): X.XColor {
        return new Schema<Field_color>(Field_color, config)
    }

    colorV2(config: Field_string_config = {}): X.XString {
        return new Schema<Field_string>(Field_string, { inputType: 'color', ...config })
    }

    matrix(config: Field_matrix_config): X.XMatrix {
        return new Schema<Field_matrix>(Field_matrix, config)
    }

    button<K>(config: Field_button_config<K>): X.XButton<K> {
        return new Schema<Field_button<K>>(Field_button, config)
    }

    /** variants: `header` */
    markdown(config: Field_markdown_config | string): X.XMarkdown {
        return new Schema<Field_markdown>(Field_markdown, typeof config === 'string' ? { markdown: config } : config)
    }

    /** [markdown variant]: inline=true, label=false */
    header(config: Field_markdown_config | string): X.XMarkdown {
        const config_: Field_markdown_config =
            typeof config === 'string'
                ? { markdown: config, inHeader: true, label: false }
                : { inHeader: true, label: false, justifyLabel: false, ...config }
        return new Schema<Field_markdown>(Field_markdown, config_)
    }

    image(config: Field_image_config = {}): X.XImage {
        return new Schema<Field_image>(Field_image, config)
    }

    prompt(config: Field_prompt_config = {}): X.XPrompt {
        return new Schema<Field_prompt>(Field_prompt, config)
    }

    int(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
        return new Schema<Field_number>(Field_number, { mode: 'int', ...config })
    }

    /** [number variant] precent = mode=int, default=100, step=10, min=1, max=100, suffix='%', */
    percent(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
        return new Schema<Field_number>(Field_number, {
            mode: 'int',
            default: 100,
            step: 10,
            min: 0,
            max: 100,
            suffix: '%',
            ...config,
        })
    }

    /**
     * [number variant] ratio = mode=float, default=0.5, step=0.01, min=0, max=1, suffix='%',
     * see also: `percent`
     */
    ratio(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
        return new Schema<Field_number>(Field_number, {
            mode: 'float',
            default: 0.5,
            step: 0.01,
            min: 0,
            max: 1,
            ...config,
        })
    }

    float(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
        return new Schema<Field_number>(Field_number, { mode: 'float', ...config })
    }

    number(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
        return new Schema<Field_number>(Field_number, { mode: 'float', ...config })
    }

    remSize(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
        return this.number({ min: 1, max: 20, default: 2, step: 1, unit: 'rem', suffix: 'rem' })
    }

    custom<T>(config: Field_custom_config<T>): X.XCustom<T> {
        return new Schema<Field_custom<T>>(Field_custom, config)
    }

    list<T extends BaseSchema>(config: Field_list_config<T>): X.XList<T> {
        return new Schema<Field_list<T>>(Field_list, config)
    }

    cube(): ShapeSchema {
        return mkShapeSchema(simpleBuilder)
    }

    timeline<T extends BaseSchema>(sub: Field_listExt_config<T>): SListExt<T> {
        return listExt(simpleBuilder, sub).withConfig({ body: WidgetListExtUI__Timeline })
    }

    regional<T extends BaseSchema>(sub: Field_listExt_config<T>): SListExt<T> {
        return listExt(simpleBuilder, sub).withConfig({ body: WidgetListExtUI__Regional })
    }

    listExt<T extends BaseSchema>(sub: Field_listExt_config<T>): SListExt<T> {
        return listExt(simpleBuilder, sub)
    }

    // SELECT ONE ------------------------------------------------------------------------------------

    // 🆘 selectOne = <const T extends SelectOption>(config: Field_selectOne_config<T>): X.XSelectOne<T> => {
    // 🆘     return new Schema<Field_selectOne<T>>(Field_selectOne, config)
    // 🆘 }
    // 🆘
    // 🆘 selectOneV2 = <T extends string>(
    // 🆘     p: readonly T[],
    // 🆘     config: Omit<Field_selectOne_config<SelectOption<T>>, 'choices'> = {},
    // 🆘 ): X.XSelectOne_<T> => {
    // 🆘     return new Schema<Field_selectOne<SelectOption<T>>>(Field_selectOne, {
    // 🆘         choices: p.map((id) => ({ id, label: id })),
    // 🆘         appearance: 'tab',
    // 🆘         ...config,
    // 🆘     })
    // 🆘 }

    selectOne<VALUE, KEY extends string = string>(config: Field_selectOne_config<VALUE, KEY>): X.XSelectOne<VALUE, KEY> {
        return new Schema<Field_selectOne<VALUE, KEY>>(Field_selectOne<VALUE, KEY>, config)
    }

    selectOneString<const VALUE extends string>(
        choices: VALUE[],
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

    selectOneStringWithMeta<const VALUE extends string>(
        options: SelectOption_NO_VALUE<VALUE, VALUE>[],
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

    // SELECT MANY

    selectMany = <const VALUE, const KEY extends string>(
        config: Field_selectMany_config<VALUE, KEY>,
    ): X.XSelectMany<VALUE, KEY> => {
        return new Schema<Field_selectMany<VALUE, KEY>>(Field_selectMany, config)
    }

    selectManyString = <const KEY extends string>(
        p: KEY[],
        config: Omit<Field_selectMany_config<KEY, KEY>, 'choices' | 'getIdFromValue' | 'getOptionFromId' | 'getValueFromId'> = {},
    ): X.XSelectMany_<KEY> => {
        return new Schema<Field_selectMany<KEY, KEY>>(Field_selectMany, {
            choices: p,
            getOptionFromId: (id) => ({ id, label: id, value: id }),
            getValueFromId: (id) => id,
            getIdFromValue: (v) => v,
            ...config,
        })
    }

    // Dynamic

    /**
     * Allow to instanciate a field early, so you can re-use it in multiple places
     * or access it's instance to dynamically change some other field schema.
     *
     * @since 2024-06-27
     * @stability unstable
     */
    with<const SCHEMA1 extends BaseSchema, SCHEMA2 extends BaseSchema>(
        /** the schema of the field you'll want to re-use the in second part */
        injected: SCHEMA1,
        children: (shared: SCHEMA1['$Field']) => SCHEMA2,
    ): X.XLink<SCHEMA1, SCHEMA2> {
        return new Schema<Field_link<SCHEMA1, SCHEMA2>>(Field_link, { share: injected, children })
    }

    linked<T extends Field>(field: T): X.XShared<T> {
        return new Schema<Field_shared<T>>(Field_shared<any /* 🔴 */>, { field })
    }

    /** see also: `fields` for a more practical api */
    group<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
        return new Schema<Field_group<T>>(Field_group, config) as any
    }

    /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
    column<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
        return new Schema<Field_group<T>>(Field_group, { border: false, label: false, collapsed: false, ...config }) as any
    }

    /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
    row<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
        return new Schema<Field_group<T>>(Field_group, {
            border: false,
            label: false,
            collapsed: false,
            layout: 'H',
            ...config,
        }) as any
    }

    /** simpler way to create `group` */
    fields<T extends SchemaDict>(fields: T, config: Omit<Field_group_config<T>, 'items'> = {}): X.XGroup<T> {
        return new Schema<Field_group<T>>(Field_group, { items: fields, ...config }) as any
    }

    choice<T extends { [key: string]: BaseSchema }>(config: Omit<Field_choices_config<T>, 'multi'>): X.XChoice<T> {
        return new Schema<Field_choices<T>>(Field_choices, { multi: false, ...config })
    }

    choices<T extends { [key: string]: BaseSchema }>(config: Omit<Field_choices_config<T>, 'multi'>): X.XChoices<T> {
        return new Schema<Field_choices<T>>(Field_choices, { multi: true, ...config })
    }

    choiceV2<T extends { [key: string]: BaseSchema }>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ): X.XChoice<T> {
        return new Schema<Field_choices<T>>(Field_choices, { multi: false, items, ...config })
    }

    choicesV2<T extends { [key: string]: BaseSchema }>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<T>, 'multi' | 'items'> = {},
    ): X.XChoices<T> {
        return new Schema<Field_choices<T>>(Field_choices, { items, multi: true, appearance: 'tab', ...config })
    }

    /** simple choice alternative api */
    tabs<T extends { [key: string]: BaseSchema }>(
        items: Field_choices_config<T>['items'],
        config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
    ): X.XChoices<T> {
        return new Schema<Field_choices<T>>(Field_choices, { items, multi: false, ...config, appearance: 'tab' })
    }

    empty(config: Field_group_config<NO_PROPS> = {}): X.XEmpty {
        return new Schema<Field_group<NO_PROPS>>(Field_group, config)
    }

    // optional wrappers
    optional<T extends BaseSchema>(p: Field_optional_config<T>): X.XOptional<T> {
        return new Schema<Field_optional<T>>(Field_optional, p)
    }

    llmModel(p: { default?: OpenRouter_Models } = {}): X.XSelectOne<OpenRouter_ModelInfo, OpenRouter_Models> {
        const knownModels = Object.values(openRouterInfos)
        const def = p.default ? knownModels.find((c) => c.id === p.default) : undefined
        return this.selectOne({
            values: knownModels,
            getIdFromValue: (v) => v.id,
            getOptionFromId: (id) => {
                const model = bang(knownModels.find((c) => c.id === id))
                return { id: model.id, label: model.name, value: model }
            },
            getValueFromId: (id) => knownModels.find((c) => c.id === id),
            default: def?.id,
        })
    }

    app(): X.XSelectOne<{ id: CushyAppID; label: string }, CushyAppID> {
        type OX = { id: CushyAppID; label: string }
        return this.selectOne<OX, CushyAppID>({
            getIdFromValue: (v): CushyAppID => v.id,
            getOptionFromId: (id: CushyAppID): SelectOption<OX, CushyAppID> => {
                const app = bang(cushy.db.cushy_app.selectOne((q) => q.where('id', 'is', id)))
                const value = { id: app.id, label: app.name }
                return { ...value, value: value }
            },
            getValueFromId: (id: CushyAppID): OX => {
                const app = cushy.db.cushy_app.selectOne((q) => q.where('id', 'is', id))
                return { id: app?.id ?? 'NotFound', label: app?.name ?? 'Not Found' }
            },
            values: (self) => {
                const matchingApps = cushy.db.cushy_app.selectRaw((q) => {
                    const query = self.serial.query
                    let Q1 = q
                        .innerJoin('step', 'cushy_app.id', 'step.appID')
                        .groupBy('cushy_app.id')
                        .select(({ fn }) => [
                            //
                            'cushy_app.id',
                            'cushy_app.name',
                            fn.count('step.id').as('count'),
                        ])
                    return query?.length //
                        ? Q1.where('cushy_app.name', 'like', `%${query}%`)
                        : Q1
                })
                return matchingApps.map((i) => ({ id: i.id, label: `${i.name} (${i.count} steps)` }))
            },
        })
    }

    // enum = /*<const T extends KnownEnumNames>*/ (config: Field_enum_config<any, any>) => new Field_enum(this.form, config)
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

    get enumOpt(): EnumBuilderOpt {
        const _ = new EnumBuilderOpt(this)
        Object.defineProperty(this, 'enumOpt', { value: _ })
        return _
    }

    _FIX_INDENTATION = _FIX_INDENTATION
}

export const builder = new Builder()
export type CushyFactory = Factory<Builder>
export const cushyFactory: CushyFactory = new Factory<Builder>(builder)
