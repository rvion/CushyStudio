import type { Field_board_config } from '../csuite/fields/board/Field_board'
import type { Field_bool } from '../csuite/fields/bool/FieldBool'
import type { Field_button_config } from '../csuite/fields/button/FieldButton'
import type { Field_choices } from '../csuite/fields/choices/FieldChoices'
import type { Field_color_config } from '../csuite/fields/color/FieldColor'
import type { SimpleShape$ } from '../csuite/fields/core-prefabs/ShapeSchema'
import type { Field_custom_config } from '../csuite/fields/custom/FieldCustom'
import type { Field_date } from '../csuite/fields/date/FieldDate'
import type { Field_datePlain } from '../csuite/fields/date_plain/FieldDatePlain'
import type { Field_dateTimeZoned } from '../csuite/fields/datetime_zoned/FieldDateTimeZoned'
import type { Field_enum } from '../csuite/fields/enum/FieldEnum'
import type { Field_group, Field_group_types, FieldGroup } from '../csuite/fields/group/FieldGroup'
import type { Field_image_config } from '../csuite/fields/image/FieldImage'
import type { Field_link } from '../csuite/fields/link/FieldLink'
import type { Field_list_config } from '../csuite/fields/list/FieldList'
import type { Field_markdown_config } from '../csuite/fields/markdown/FieldMarkdown'
import type { Field_matrix_config } from '../csuite/fields/matrix/FieldMatrix'
import type { Field_number_config } from '../csuite/fields/number/FieldNumber'
import type { Field_optional_config } from '../csuite/fields/optional/FieldOptional'
import type { Field_orbit_config } from '../csuite/fields/orbit/FieldOrbit'
import type { Field_seed } from '../csuite/fields/seed/FieldSeed'
import type { Field_selectMany } from '../csuite/fields/selectMany/FieldSelectMany'
import type { Field_selectOne } from '../csuite/fields/selectOne/FieldSelectOne'
import type { SelectKey } from '../csuite/fields/selectOne/SelectOneKey'
import type { Field_shared } from '../csuite/fields/shared/FieldShared'
import type { Field_size } from '../csuite/fields/size/FieldSize'
import type { BaseSchema } from '../csuite/model/BaseSchema'
import type { IBuilder } from '../csuite/model/IBuilder'
import type { OpenRouter_Models } from '../csuite/openrouter/OpenRouter_models'
import type { SimpleSchema } from '../csuite/simple/SimpleSchema'
import type { NO_PROPS } from '../csuite/types/NO_PROPS'
import type { EnumValue } from '../models/ComfySchema'

import { makeAutoObservable } from 'mobx'
import { nanoid } from 'nanoid'
import { createElement } from 'react'

import { simpleBuilder } from '../csuite'
import { Field_board } from '../csuite/fields/board/Field_board'
import { WidgetListExtUI__Timeline } from '../csuite/fields/board/WidgetListExtUI'
import { Field_button } from '../csuite/fields/button/FieldButton'
import { Field_color } from '../csuite/fields/color/FieldColor'
import { simpleShape$ } from '../csuite/fields/core-prefabs/ShapeSchema'
import { Field_custom } from '../csuite/fields/custom/FieldCustom'
import { Field_image } from '../csuite/fields/image/FieldImage'
import { Field_list } from '../csuite/fields/list/FieldList'
import { Field_markdown } from '../csuite/fields/markdown/FieldMarkdown'
import { Field_matrix } from '../csuite/fields/matrix/FieldMatrix'
import { Field_number } from '../csuite/fields/number/FieldNumber'
import { Field_optional } from '../csuite/fields/optional/FieldOptional'
import { Field_orbit } from '../csuite/fields/orbit/FieldOrbit'
import { type SelectOption } from '../csuite/fields/selectOne/SelectOption'
import { WidgetSelectOneUI } from '../csuite/fields/selectOne/WidgetSelectOneUI'
import { Field_string, type Field_string_config } from '../csuite/fields/string/FieldString'
import { BuilderBool } from '../csuite/model/builders/BuilderBoolTypes'
import { BuilderChoices } from '../csuite/model/builders/BuilderChoices'
import { BuilderDate } from '../csuite/model/builders/BuilderDateTypes'
import { BuilderGroup } from '../csuite/model/builders/BuilderGroup'
import { BuilderMisc } from '../csuite/model/builders/BuilderMisc'
import { BuilderNumber } from '../csuite/model/builders/BuilderNumberTypes'
import { BuilderSelectMany } from '../csuite/model/builders/BuilderSelectMany'
import { BuilderSelectOne } from '../csuite/model/builders/BuilderSelectOne'
import { BuilderShared } from '../csuite/model/builders/BuilderShared'
import { BuilderString } from '../csuite/model/builders/BuilderStringTypes'
import { Factory } from '../csuite/model/Factory'
import { type OpenRouter_ModelInfo, openRouterInfos } from '../csuite/openrouter/OpenRouter_infos'
import { _FIX_INDENTATION } from '../csuite/utils/_FIX_INDENTATION'
import { bang } from '../csuite/utils/bang'
import { combine } from '../csuite/utils/combine'
import { Field_prompt, type Field_prompt_config } from '../prompt/FieldPrompt'
import { type AutoBuilder, mkFormAutoBuilder } from './AutoBuilder'
import { EnumBuilder } from './EnumBuilder'
import { EnumBuilderOpt } from './EnumBuilderOpt'
import { EnumListBuilder } from './EnumListBuilder'
import { CushySchema, type CushySchemaᐸ_ᐳ } from './Schema'

// TODO:
// alias should only be $Type &
// {Field:..., Schema:...}
//  => would make EVERYTHING so much simpler

declare global {
   // eslint-disable-next-line @typescript-eslint/no-namespace
   namespace X {
      // #region core types
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type SchemaDict = import('../csuite/model/SchemaDict').SchemaDict
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type Builder = import('./Builder').CushySchemaBuilder
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type Field<K extends FieldTypes = FieldTypes> = import('../csuite/model/Field').Field<K>
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type FieldTypes = import('../csuite/model/$FieldTypes').FieldTypes
      // prettier-ignore
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type BaseSchema<out TYPES extends FieldTypes = FieldTypes> = import('../csuite/model/BaseSchema').BaseSchema<TYPES>
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type Runtime = import('../runtime/Runtime').Runtime

      // #region core types

      // field aliases
      type Shared<T extends Field> = Field_shared<T>
      type Group<T extends SchemaDict> = FieldGroup<Field_group_types<T>>
      type Empty = Field_group<Field_group_types<NO_PROPS>>
      type Optional<T extends BaseSchema> = Field_optional<T>
      type Bool = Field_bool
      type Link<A extends BaseSchema, B extends BaseSchema> = Field_link<A, B>
      type String = Field_string
      type Prompt = Field_prompt
      type Choices<T extends SchemaDict = SchemaDict> = Field_choices<T>
      type Choice<T extends SchemaDict = SchemaDict> = Field_choices<T>
      type Number = Field_number
      type Color = Field_color
      type Enum<T extends EnumValue> = Field_enum<T>
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
      type XShared<T extends Field> = CushySchema<Field_shared<T>>
      type XGroup<T extends SchemaDict> = CushySchema<FieldGroup<Field_group_types<T>>>
      type XGroup_<T extends SchemaDict> = CushySchema<Field_group<Field_group_types<T>>>
      type XEmpty = CushySchema<Field_group<Field_group_types<NO_PROPS>>>
      type XOptional<T extends BaseSchema> = CushySchema<Field_optional<T>>
      type XBool = CushySchema<Field_bool>
      type XLink<A extends BaseSchema, B extends BaseSchema> = CushySchema<Field_link<A, B>>
      type XString = CushySchema<Field_string>
      type XChoices<T extends SchemaDict = SchemaDict> = CushySchema<Field_choices<T>>
      type XChoice<T extends SchemaDict = SchemaDict> = CushySchema<Field_choices<T>>
      type XNumber = CushySchema<Field_number>
      type XColor = CushySchema<Field_color>
      type XList<T extends BaseSchema> = CushySchema<Field_list<T>>
      type XBoard<T extends BaseSchema> = SimpleSchema<Field_board<T>>
      type XButton<T> = CushySchema<Field_button<T>>
      type XSeed = CushySchema<Field_seed>
      type XMatrix = CushySchema<Field_matrix>

      // dates
      type XDatePlain<NULLABLE extends boolean> = CushySchema<Field_datePlain<NULLABLE>>
      type XDatePlainRequired = CushySchema<Field_datePlain<false>>
      type XDatePlainNullable = CushySchema<Field_datePlain<true>>
      type XDate<NULLABLE extends boolean> = CushySchema<Field_date<NULLABLE>>
      type XDateRequired = CushySchema<Field_date<false>>
      type XDateNullable = CushySchema<Field_date<true>>
      type XDateTimeZoned<NULLABLE extends boolean> = CushySchema<Field_dateTimeZoned<NULLABLE>>
      type XDateTimeZonedRequired = CushySchema<Field_dateTimeZoned<false>>
      type XDateTimeZonedNullable = CushySchema<Field_dateTimeZoned<true>>

      // selects
      type XSelectOne<T, ID extends SelectKey> = CushySchema<Field_selectOne<T, ID>>
      type XSelectMany<T, ID extends SelectKey> = CushySchema<Field_selectMany<T, ID>>
      type XSelectOne_<T extends SelectKey> = CushySchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type XSelectMany_<T extends SelectKey> = CushySchema<Field_selectMany<T, T>> // variant that may be shorter to read

      type XSize = CushySchema<Field_size>
      type XMarkdown = CushySchema<Field_markdown>

      type XPrompt = CushySchema<Field_prompt>
      type XEnum<T extends EnumValue> = CushySchema<Field_enum<T>>
      type XOrbit = CushySchema<Field_orbit>
      type XImage = CushySchema<Field_image>
      type XCustom<T> = CushySchema<Field_custom<T>>
   }
}

export interface CushySchemaBuilder
   extends BuilderString<CushySchemaᐸ_ᐳ>,
      BuilderBool<CushySchemaᐸ_ᐳ>,
      BuilderNumber<CushySchemaᐸ_ᐳ>,
      BuilderDate<CushySchemaᐸ_ᐳ>,
      BuilderMisc<CushySchemaᐸ_ᐳ>,
      BuilderSelectOne<CushySchemaᐸ_ᐳ>,
      BuilderSelectMany<CushySchemaᐸ_ᐳ>,
      BuilderChoices<CushySchemaᐸ_ᐳ>,
      BuilderGroup<CushySchemaᐸ_ᐳ>,
      BuilderShared<CushySchemaᐸ_ᐳ> {
   //
}

/** cushy studio form builder */
export class CushySchemaBuilder implements IBuilder {
   constructor() {
      combine<any /* ts perf maybe ? */>(
         //
         this,
         BuilderString.fromSchemaClass(CushySchema),
         BuilderBool.fromSchemaClass(CushySchema),
         BuilderNumber.fromSchemaClass(CushySchema),
         BuilderDate.fromSchemaClass(CushySchema),
         BuilderMisc.fromSchemaClass(CushySchema),
         // loco specific options (default in french, custom widget, etc.)
         BuilderSelectOne.fromSchemaClass(CushySchema).withDefaultSelectOneConfig({
            wrap: false,
            placeholder: 'None',
            header: WidgetSelectOneUI,
         }),
         BuilderSelectMany.fromSchemaClass(CushySchema).withDefaultSelectManyConfig({
            wrap: false,
            placeholder: 'None',
            appearance: 'select',
         }),
         BuilderChoices.fromSchemaClass(CushySchema),
         BuilderGroup.fromSchemaClass(CushySchema),
         BuilderShared.fromSchemaClass(CushySchema),
      )

      // public model: Model<BaseSchema, Builder>,
      makeAutoObservable(this, {
         auto: false,
         autoField: false,
         enum: false,
         enums: false,
         enumOpt: false,
      })
   }

   /**
    * @deprecated
    * super ugly function; do not use
    */
   nanoid(config: Field_string_config = {}): X.XString {
      const uid = nanoid()
      return this.string({ ...config, header: (field) => createElement('div', {}, uid), default: uid })
   }

   textarea(config: Field_string_config = {}): X.XString {
      return new CushySchema<Field_string>(Field_string, { textarea: true, ...config })
   }

   orbit(config: Field_orbit_config = {}): X.XOrbit {
      return new CushySchema<Field_orbit>(Field_orbit, config)
   }

   color(config: Field_color_config = {}): X.XColor {
      return new CushySchema<Field_color>(Field_color, config)
   }

   // colorV2(config: Field_string_config = {}): X.XString {
   //     return new CushySchema<Field_string>(Field_string, { inputType: 'color', ...config })
   // }

   matrix(config: Field_matrix_config): X.XMatrix {
      return new CushySchema<Field_matrix>(Field_matrix, config)
   }

   button<K>(config: Field_button_config<K>): X.XButton<K> {
      return new CushySchema<Field_button<K>>(Field_button, config)
   }

   /** variants: `header` */
   markdown(config: Field_markdown_config | string): X.XMarkdown {
      return new CushySchema<Field_markdown>(
         Field_markdown,
         typeof config === 'string' ? { markdown: config } : config,
      )
   }

   /** [markdown variant]: inline=true, label=false */
   header(config: Field_markdown_config | string): X.XMarkdown {
      const config_: Field_markdown_config =
         typeof config === 'string'
            ? { markdown: config, inHeader: true, label: false }
            : { inHeader: true, label: false, justifyLabel: false, ...config }
      return new CushySchema<Field_markdown>(Field_markdown, config_)
   }

   /** image field, defaulting to `cushy.defaultImage` if no default provided */
   image(config: Field_image_config = {}): X.XImage {
      const def = config.default ?? cushy.defaultImage
      return this.image_({ default: def, ...config })
   }

   /** image field, without any default */
   image_(config: Field_image_config = {}): X.XImage {
      return new CushySchema<Field_image>(Field_image, config)
   }

   /** prompt, defaulting to '' */
   prompt(config: Field_prompt_config = {}): X.XPrompt {
      const def = config.default ?? ''
      return this.prompt_({ default: def, ...config })
   }

   prompt_(config: Field_prompt_config = {}): X.XPrompt {
      return new CushySchema<Field_prompt>(Field_prompt, config)
   }

   /**
    * [number variant] ratio = mode=float, default=0.5, step=0.01, min=0, max=1, suffix='%',
    * see also: `percent`
    */
   ratio(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
      return new CushySchema<Field_number>(Field_number, {
         mode: 'float',
         default: 0.5,
         step: 0.01,
         min: 0,
         max: 1,
         ...config,
      })
   }

   remSize(config: Omit<Field_number_config, 'mode'> = {}): X.XNumber {
      return this.number({ min: 1, max: 20, default: 2, step: 1, unit: 'rem', suffix: 'rem' })
   }

   custom<T>(config: Field_custom_config<T>): X.XCustom<T> {
      return new CushySchema<Field_custom<T>>(Field_custom, config)
   }

   list<T extends BaseSchema>(config: Field_list_config<T>): CushySchema<Field_list<T>> {
      return new CushySchema<Field_list<T>>(Field_list, config)
   }

   cube(): SimpleShape$ {
      return simpleShape$()
   }

   // #region ListExt
   timeline<T extends BaseSchema>(
      sub: Field_board_config<T>,
      config: Omit<Field_board_config<T>, 'element'> = {},
   ): X.XBoard<T> {
      const x = Field_board.getSchema(simpleBuilder, sub)
      type T01 = (typeof x)['$Field']
      type T02 = (typeof x)['$Reflect']['$Field']
      type T1 = (typeof x)['$Config']['body']
      return x.withConfig({ body: WidgetListExtUI__Timeline, ...config })
   }

   regional<T extends BaseSchema>(sub: Field_board_config<T>): X.XBoard<T> {
      return Field_board.getSchema(simpleBuilder, sub) //
   }

   listExt<T extends BaseSchema>(sub: Field_board_config<T>): X.XBoard<T> {
      return Field_board.getSchema(simpleBuilder, sub)
   }

   // SELECT ONE
   // private _sob = new SelectOneBuilder()
   // selectOne: SelectOneBuilder['selectOne'] = this._sob.selectOne.bind(this._sob)
   // selectOneString: SelectOneBuilder['selectOneString'] = this._sob.selectOneString.bind(this._sob)
   // selectOneOption: SelectOneBuilder['selectOneOption'] = this._sob.selectOneOption.bind(this._sob)
   // selectOneOptionFn: SelectOneBuilder['selectOneOptionFn'] = this._sob.selectOneOptionFn.bind(this._sob)
   // selectOneOptionValue: SelectOneBuilder['selectOneOptionValue'] = this._sob.selectOneOptionValue.bind(this._sob)
   // selectOneOptionId: SelectOneBuilder['selectOneOptionId'] = this._sob.selectOneOptionId.bind(this._sob)

   // // SELECT MANY
   // private _smb = new SelectManyBuilder()
   // selectMany: SelectManyBuilder['selectMany'] = this._smb.selectMany.bind(this._smb)
   // selectManyStrings: SelectManyBuilder['selectManyString'] = this._smb.selectManyString.bind(this._smb)
   // selectManyOptions: SelectManyBuilder['selectManyOptions'] = this._smb.selectManyOptions.bind(this._smb)
   // selectManyOptionIds: SelectManyBuilder['selectManyOptionIds'] = this._smb.selectManyOptionIds.bind(this._smb)
   // selectManyOptionValues: SelectManyBuilder['selectManyOptionValues'] = this._smb.selectManyOptionValues.bind(this._smb)

   // Dynamic

   // /**
   //  * Allow to instanciate a field early, so you can re-use it in multiple places
   //  * or access it's instance to dynamically change some other field schema.
   //  *
   //  * @since 2024-06-27
   //  * @stability unstable
   //  */
   // with<const SCHEMA1 extends BaseSchema, SCHEMA2 extends BaseSchema>(
   //     /** the schema of the field you'll want to re-use the in second part */
   //     injected: SCHEMA1,
   //     children: (shared: SCHEMA1['$Field']) => SCHEMA2,
   // ): X.XLink<SCHEMA1, SCHEMA2> {
   //     return new CushySchema<Field_link<SCHEMA1, SCHEMA2>>(Field_link, { share: injected, children })
   // }

   // linked<T extends Field>(field: T): X.XShared<T> {
   //     return new CushySchema<Field_shared<T>>(Field_shared<any /* 🔴 */>, { field })
   // }

   // /** see also: `fields` for a more practical api */
   // group<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
   //     return new CushySchema<Field_group<T>>(Field_group, config) as any
   // }

   // /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
   // column<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
   //     return new CushySchema<Field_group<T>>(Field_group, { border: false, label: false, collapsed: false, ...config }) as any
   // }

   // /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
   // row<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
   //     return new CushySchema<Field_group<T>>(Field_group, {
   //         border: false,
   //         label: false,
   //         collapsed: false,
   //         layout: 'H',
   //         ...config,
   //     }) as any
   // }

   // /** simpler way to create `group` */
   // fields<T extends SchemaDict>(fields: T, config: Omit<Field_group_config<T>, 'items'> = {}): X.XGroup<T> {
   //     return new CushySchema<Field_group<T>>(Field_group, { items: fields, ...config }) as any
   // }

   // choice<T extends { [key: string]: BaseSchema }>(config: Omit<Field_choices_config<T>, 'multi'>): X.XChoice<T> {
   //     return new CushySchema<Field_choices<T>>(Field_choices, { multi: false, ...config })
   // }

   // choices<T extends { [key: string]: BaseSchema }>(config: Omit<Field_choices_config<T>, 'multi'>): X.XChoices<T> {
   //     return new CushySchema<Field_choices<T>>(Field_choices, { multi: true, ...config })
   // }

   // choiceV2<T extends { [key: string]: BaseSchema }>(
   //     items: Field_choices_config<T>['items'],
   //     config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
   // ): X.XChoice<T> {
   //     return new CushySchema<Field_choices<T>>(Field_choices, { multi: false, items, ...config })
   // }

   // choicesV2<T extends { [key: string]: BaseSchema }>(
   //     items: Field_choices_config<T>['items'],
   //     config: Omit<Field_choices_config<T>, 'multi' | 'items'> = {},
   // ): X.XChoices<T> {
   //     return new CushySchema<Field_choices<T>>(Field_choices, { items, multi: true, appearance: 'tab', ...config })
   // }

   // /** simple choice alternative api */
   // tabs<T extends { [key: string]: BaseSchema }>(
   //     items: Field_choices_config<T>['items'],
   //     config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
   // ): X.XChoices<T> {
   //     return new CushySchema<Field_choices<T>>(Field_choices, { items, multi: false, ...config, appearance: 'tab' })
   // }
   // empty(config: Field_group_config<NO_PROPS> = {}): X.XEmpty {
   //     return new CushySchema<Field_group<NO_PROPS>>(Field_group, config)
   // }

   // optional wrappers
   optional<T extends BaseSchema>(p: Field_optional_config<T>): X.XOptional<T> {
      return new CushySchema<Field_optional<T>>(Field_optional, p)
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

   // TODO: clean that up
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
               const Q1 = q
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
   // TODO: clean that up
   draft(): X.XSelectOne<{ id: DraftID; label: string }, DraftID> {
      type OX = { id: DraftID; label: string }
      return this.selectOne<OX, DraftID>({
         getIdFromValue: (v): DraftID => v.id,
         getOptionFromId: (id: DraftID): SelectOption<OX, DraftID> => {
            const app = bang(cushy.db.draft.selectOne((q) => q.where('id', 'is', id)))
            const value = { id: app.id, label: app.name }
            return { ...value, value: value }
         },
         getValueFromId: (id: DraftID): OX => {
            const app = cushy.db.draft.selectOne((q) => q.where('id', 'is', id))
            return { id: app?.id ?? 'NotFound', label: app?.name ?? 'Not Found' }
         },
         values: (self) => {
            const matchingApps = cushy.db.draft.selectRaw((q) => {
               const query = self.serial.query
               const Q1 = q
                  .innerJoin('step', 'draft.id', 'step.draftID')
                  .groupBy('draft.id')
                  .select(({ fn }) => [
                     //
                     'draft.id',
                     'draft.title',
                     fn.count('step.id').as('count'),
                  ])
               return query?.length //
                  ? Q1.where('draft.title', 'like', `%${query}%`)
                  : Q1
            })
            return matchingApps.map((i) => ({ id: i.id, label: `${i.title} (${i.count} steps)` }))
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

export const builder = new CushySchemaBuilder()
export type CushyFactory = Factory<CushySchemaBuilder>
export const cushyFactory: CushyFactory = new Factory<CushySchemaBuilder>(builder)

/**
 * zod does it with z, and is kinda praised for it's practicallity.
 * So why don't we try it too
 *
 * @since 2024-10-11
 */
export const b = builder
