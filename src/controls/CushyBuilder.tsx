import type { Field_board_config } from '../csuite/fields/board/Field_board'
import type { SimpleShape$ } from '../csuite/fields/core-prefabs/ShapeSchema'
import type { Field_list_config } from '../csuite/fields/list/FieldList'
import type { Field_matrix_config } from '../csuite/fields/matrix/FieldMatrix'
import type { Field_number } from '../csuite/fields/number/FieldNumber'
import type { Field_optional_config } from '../csuite/fields/optional/FieldOptional'
import type { SelectOption } from '../csuite/fields/selectOne/SelectOption'
// import type { IBuilder } from '../csuite/model/IBuilder'
import type { OpenRouter_Models } from '../csuite/openrouter/OpenRouter_models'

import { nanoid } from 'nanoid'

import { simpleBuilder } from '../csuite'
import { csuiteConfig } from '../csuite/config/configureCsuite'
import { Field_board } from '../csuite/fields/board/Field_board'
import { WidgetListExtUI__Timeline } from '../csuite/fields/board/WidgetListExtUI'
import { Field_color } from '../csuite/fields/color/FieldColor'
import { simpleShape$ } from '../csuite/fields/core-prefabs/ShapeSchema'
import { Field_custom } from '../csuite/fields/custom/FieldCustom'
import { Field_image } from '../csuite/fields/image/FieldImage'
import { Field_list } from '../csuite/fields/list/FieldList'
import { Field_matrix } from '../csuite/fields/matrix/FieldMatrix'
import { Field_optional } from '../csuite/fields/optional/FieldOptional'
import { Field_orbit } from '../csuite/fields/orbit/FieldOrbit'
import { WidgetSelectOneUI } from '../csuite/fields/selectOne/WidgetSelectOneUI'
import { BuilderBoolDescriptors, type BuilderBoolMixin } from '../csuite/model/builders/BuilderBoolTypes'
import { BuilderChoicesDescriptors, type BuilderChoicesMixin } from '../csuite/model/builders/BuilderChoices'
import { BuilderDateDescriptors, type BuilderDateMixin } from '../csuite/model/builders/BuilderDateTypes'
import { BuilderGroupDescriptors, type BuilderGroupMixin } from '../csuite/model/builders/BuilderGroup'
import { BuilderLLMDescriptors, type BuilderLLMMixin } from '../csuite/model/builders/BuilderLLM'
import { BuilderMiscDescriptors, type BuilderMiscMixin } from '../csuite/model/builders/BuilderMisc'
import {
   BuilderNumberDescriptors,
   type BuilderNumberMixin,
} from '../csuite/model/builders/BuilderNumberTypes'
import {
   BuilderSelectManyDescriptorsFn,
   type BuilderSelectManyMixin,
} from '../csuite/model/builders/BuilderSelectMany'
import {
   BuilderSelectOneDescriptorsFn,
   type BuilderSelectOneMixin,
} from '../csuite/model/builders/BuilderSelectOne'
import { BuilderSharedDescriptors, type BuilderSharedMixin } from '../csuite/model/builders/BuilderShared'
import {
   BuilderStringDescriptors,
   type BuilderStringMixin,
} from '../csuite/model/builders/BuilderStringTypes'
import { CSchema } from '../csuite/model/CSchema'
import { Factory } from '../csuite/model/Factory'
import { openRouterInfos } from '../csuite/openrouter/OpenRouter_infos'
import { SelectDefaultOptionUI } from '../csuite/select/SelectOptionBadgeUI'
import { _FIX_INDENTATION } from '../csuite/utils/_FIX_INDENTATION'
import { bang } from '../csuite/utils/bang'
import { Field_prompt } from '../prompt/FieldPrompt'
import { type AutoBuilder, mkFormAutoBuilder } from './AutoBuilder'
import { BuilderPrefabs } from './BuilderPrefabs'
import { EnumBuilder } from './EnumBuilder'
import { EnumBuilderOpt } from './EnumBuilderOpt'
import { EnumListBuilder } from './EnumListBuilder'

/** cushy studio form builder */
export class CushySchemaBuilder /* implements IBuilder */ {
   orbit(config: Field_orbit['…config'] = {}): Z.Orbit {
      return CSchema.new<Field_orbit>(Field_orbit, config)
   }

   color(config: Field_color['…config'] = {}): Z.Color {
      return CSchema.new<Field_color>(Field_color, config)
   }

   matrix(config: Field_matrix_config): Z.Matrix {
      return CSchema.new<Field_matrix>(Field_matrix, config)
   }

   /** image field, defaulting to `cushy.defaultImage` if no default provided */
   image(config: Field_image['…config'] = {}): Z.Image {
      const def = config.default ?? cushy.defaultImage
      return this.image_({ default: def, ...config })
   }

   /** image field, without any default */
   image_(config: Field_image['…config'] = {}): Z.Image {
      return CSchema.new<Field_image>(Field_image, config)
   }

   /** prompt, defaulting to '' */
   prompt(config: Field_prompt['…config'] = {}): Z.Prompt {
      const def = config.default ?? ''
      return this.prompt_({ default: def, ...config })
   }

   prompt_(config: Field_prompt['…config'] = {}): Z.Prompt {
      return CSchema.new<Field_prompt>(Field_prompt, config)
   }

   remSize(config: Omit<Field_number['…config'], 'mode'> = {}): Z.Number {
      return this.number({
         min: 1,
         max: 20,
         default: 2,
         step: 1,
         unit: 'rem',
         suffix: 'rem',
      })
   }

   custom<T>(config: Field_custom<T>['…config']): Z.Custom<T> {
      return CSchema.new<Field_custom<T>>(Field_custom, config)
   }

   list<T extends CSchema>(config: Field_list_config<T>): CSchema<Field_list<T>> {
      return CSchema.new<Field_list<T>>(Field_list, { defaultLength: 0, ...config })
   }

   cube(): SimpleShape$ {
      return simpleShape$()
   }

   PREFABS = new BuilderPrefabs(this)
   private __uid: string = nanoid(4)
   get _uid(): string { return this.__uid + '/' + this.PREFABS._uid } // prettier-ignore

   // #region ListExt
   timeline<T extends CSchema>(
      sub: Field_board_config<T>,
      config: Omit<Field_board_config<T>, 'element'> = {},
   ): Z.Board<T> {
      const x = Field_board.schema(simpleBuilder, sub)
      return x.withConfig({ body: WidgetListExtUI__Timeline, ...config })
   }

   regional<T extends CSchema>(sub: Field_board_config<T>): Z.Board<T> {
      return Field_board.schema(simpleBuilder, sub) //
   }

   listExt<T extends CSchema>(sub: Field_board_config<T>): Z.Board<T> {
      return Field_board.schema(simpleBuilder, sub)
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
   // with<const SCHEMA1 extends CSchema, SCHEMA2 extends CSchema>(
   //     /** the schema of the field you'll want to re-use the in second part */
   //     injected: SCHEMA1,
   //     children: (shared: SCHEMA1['$field']) => SCHEMA2,
   // ): X.XLink<SCHEMA1, SCHEMA2> {
   //     return CSchema.new<Field_link<SCHEMA1, SCHEMA2>>(Field_link, { share: injected, children })
   // }

   // linked<T extends Field>(field: T): X.XShared<T> {
   //     return CSchema.new<Field_shared<T>>(Field_shared<any /* 🔴 */>, { field })
   // }

   // /** see also: `fields` for a more practical api */
   // group<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
   //     return CSchema.new<Field_group<T>>(Field_group, config) as any
   // }

   // /** Convenience function for `group({ border: false, label: false, collapsed: false })` */
   // column<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
   //     return CSchema.new<Field_group<T>>(Field_group, { border: false, label: false, collapsed: false, ...config }) as any
   // }

   // /** Convenience function for `group({ border: false, label: false, collapsed: false, layout:'H' })` */
   // row<T extends SchemaDict>(config: Field_group_config<T> = {}): X.XGroup<T> {
   //     return CSchema.new<Field_group<T>>(Field_group, {
   //         border: false,
   //         label: false,
   //         collapsed: false,
   //         layout: 'H',
   //         ...config,
   //     }) as any
   // }

   // /** simpler way to create `group` */
   // fields<T extends SchemaDict>(fields: T, config: Omit<Field_group_config<T>, 'items'> = {}): X.XGroup<T> {
   //     return CSchema.new<Field_group<T>>(Field_group, { items: fields, ...config }) as any
   // }

   // choice<T extends { [key: string]: CSchema }>(config: Omit<Field_choices_config<T>, 'multi'>): X.XChoice<T> {
   //     return CSchema.new<Field_choices<T>>(Field_choices, { multi: false, ...config })
   // }

   // choices<T extends { [key: string]: CSchema }>(config: Omit<Field_choices_config<T>, 'multi'>): X.XChoices<T> {
   //     return CSchema.new<Field_choices<T>>(Field_choices, { multi: true, ...config })
   // }

   // choiceV2<T extends { [key: string]: CSchema }>(
   //     items: Field_choices_config<T>['items'],
   //     config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
   // ): X.XChoice<T> {
   //     return CSchema.new<Field_choices<T>>(Field_choices, { multi: false, items, ...config })
   // }

   // choicesV2<T extends { [key: string]: CSchema }>(
   //     items: Field_choices_config<T>['items'],
   //     config: Omit<Field_choices_config<T>, 'multi' | 'items'> = {},
   // ): X.XChoices<T> {
   //     return CSchema.new<Field_choices<T>>(Field_choices, { items, multi: true, appearance: 'tab', ...config })
   // }

   // /** simple choice alternative api */
   // tabs<T extends { [key: string]: CSchema }>(
   //     items: Field_choices_config<T>['items'],
   //     config: Omit<Field_choices_config<NoInfer<T>>, 'multi' | 'items'> = {},
   // ): X.XChoices<T> {
   //     return CSchema.new<Field_choices<T>>(Field_choices, { items, multi: false, ...config, appearance: 'tab' })
   // }
   // empty(config: Field_group_config<NO_PROPS> = {}): X.XEmpty {
   //     return CSchema.new<Field_group<NO_PROPS>>(Field_group, config)
   // }

   // optional wrappers
   optional<T extends CSchema>(p: Field_optional_config<T>): Z.Maybe<T> {
      return CSchema.new<Field_optional<T>>(Field_optional, p)
   }

   llmModel(p: { default?: OpenRouter_Models } = {}): Z.LLM {
      const knownModels = Object.values(openRouterInfos)
      const def = p.default ? knownModels.find((c) => c.id === p.default) : undefined
      return this.selectOne({
         values: knownModels,
         OptionLabelUI(t, where) {
            if (t?.id == null) return '🔶DEFAULT🔶'
            const model = openRouterInfos[t.id]
            if (!model) return '🔶DEFAULT🔶'
            const moderationEmoji = model.top_provider.is_moderated ? '😇' : '😈'
            const pricing = model.pricing
            const pricingText = `(💰: ${pricing.prompt}/tok${pricing.request !== '0' ? ` + ${pricing.request}/req` : ''})`
            const label = `${moderationEmoji} ${model.name} ${pricingText}`
            return <SelectDefaultOptionUI label={label} />
         },
         getIdFromValue: (v) => v.id,
         getOptionFromId: (id) => {
            const model = bang(knownModels.find((c) => c.id === id))
            return { id: model.id, label: model.name, value: model }
         },
         getValueFromId: (id) => knownModels.find((c) => c.id === id),
         default: def?.id ?? knownModels[0]!.id,
      })
   }

   // TODO: clean that up
   app(): Z.XSelectOne<{ id: CushyAppID; label: string }, CushyAppID> {
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
   draft(): Z.XSelectOne<{ id: DraftID; label: string }, DraftID> {
      type OX = { id: DraftID; label: string }
      return this.selectOne<OX, DraftID>({
         getIdFromValue: (v): DraftID => v.id,
         getOptionFromId: (id: DraftID): SelectOption<OX, DraftID> => {
            const draft = cushy.db.draft.selectOne((q) => q.where('id', 'is', id))
            if (!draft)
               return { id: 'NotFound', label: 'Not Found', value: { id: 'NotFound', label: 'Not Found' } }
            const value = { id: draft.id, label: draft.name }
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

export interface CushySchemaBuilder
   extends BuilderStringMixin,
      BuilderBoolMixin,
      BuilderChoicesMixin,
      BuilderNumberMixin,
      BuilderDateMixin,
      BuilderMiscMixin,
      BuilderGroupMixin,
      BuilderSharedMixin,
      BuilderSelectOneMixin,
      BuilderSelectManyMixin,
      BuilderLLMMixin {}

const emptyPlaceholder = csuiteConfig.i18n.ui.field.empty

Object.defineProperties(CushySchemaBuilder.prototype, BuilderStringDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderBoolDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderChoicesDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderNumberDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderDateDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderMiscDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderGroupDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderSharedDescriptors)
Object.defineProperties(CushySchemaBuilder.prototype, BuilderSelectOneDescriptorsFn({ wrap: true, placeholder: emptyPlaceholder, header: WidgetSelectOneUI })) // prettier-ignore
Object.defineProperties(CushySchemaBuilder.prototype, BuilderSelectManyDescriptorsFn({ wrap: false, placeholder: emptyPlaceholder, appearance: 'select' })) // prettier-ignore
Object.defineProperties(CushySchemaBuilder.prototype, BuilderLLMDescriptors)
