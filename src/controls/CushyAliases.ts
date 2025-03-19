import type { ComfyUnionValue } from '../comfyui/comfyui-types'
import type { OpenRouter_Models } from '../csuite'
import type { Field_board } from '../csuite/fields/board/Field_board'
import type { Field_bool } from '../csuite/fields/bool/FieldBool'
import type { Field_choices, MAGICCHOICES } from '../csuite/fields/choices/FieldChoices'
import type { Field_color } from '../csuite/fields/color/FieldColor'
import type { Field_custom } from '../csuite/fields/custom/FieldCustom'
import type { Field_date } from '../csuite/fields/date/FieldDate'
import type { Field_enum } from '../csuite/fields/enum/FieldEnum'
import type { Field_group, MAGICFIELDS } from '../csuite/fields/group/FieldGroup'
import type { Field_image } from '../csuite/fields/image/FieldImage'
import type { Field_link } from '../csuite/fields/link/FieldLink'
import type { Field_list } from '../csuite/fields/list/FieldList'
import type { Field_markdown } from '../csuite/fields/markdown/FieldMarkdown'
import type { Field_matrix } from '../csuite/fields/matrix/FieldMatrix'
import type { Field_number } from '../csuite/fields/number/FieldNumber'
import type { Field_optional } from '../csuite/fields/optional/FieldOptional'
import type { Field_orbit } from '../csuite/fields/orbit/FieldOrbit'
import type { Field_seed } from '../csuite/fields/seed/FieldSeed'
import type { Field_selectMany } from '../csuite/fields/selectMany/FieldSelectMany'
import type { Field_selectOne } from '../csuite/fields/selectOne/FieldSelectOne'
import type { SelectKey } from '../csuite/fields/selectOne/SelectOneKey'
import type { Field_shared } from '../csuite/fields/shared/FieldShared'
import type { Field_size } from '../csuite/fields/size/FieldSize'
import type { Field_string } from '../csuite/fields/string/FieldString'
import type { CSchema } from '../csuite/model/CSchema'
import type { Field as Field_ } from '../csuite/model/Field'
import type { SchemaDict as SchemaDict_ } from '../csuite/model/SchemaDict'
import type { OpenRouter_ModelInfo } from '../csuite/openrouter/OpenRouter_ModelInfo'
import type { NO_PROPS } from '../csuite/types/NO_PROPS'
import type { Field_prompt } from '../prompt/FieldPrompt'
import type { Runtime as Runtime_ } from '../runtime/Runtime'
import type { CushySchemaBuilder as CushySchemaBuilder_ } from './CushyBuilder'
import type { Temporal } from '@js-temporal/polyfill'

// prettier-ignore
declare global {
   // eslint-disable-next-line @typescript-eslint/no-namespace
   namespace Z {
      type Tuple<T extends CSchema[]> = any
      type SchemaDict = SchemaDict_
      type Builder = CushySchemaBuilder_
      type Field = Field_
      type Runtime = Runtime_
      type Schema<FIELD extends Field = Field> = CSchema<FIELD>

      // #region core types
      type Shared<T extends Field>                    = CSchema<Field_shared<T>>
      type SharedAlt<S extends CSchema>               = CSchema<Field_shared<S['$field']>>
      type Group<T extends SchemaDict>                = CSchema<Field_group<T> & MAGICFIELDS<T>>
      type Record<T extends SchemaDict>               = CSchema<Field_group<T> & MAGICFIELDS<T>>
      type Empty                                      = CSchema<Field_group<NO_PROPS>>
      type Maybe<T extends CSchema>                   = CSchema<Field_optional<T>>
      type Optional<T extends CSchema>                = CSchema<Field_optional<T>>
      type Bool                                       = CSchema<Field_bool>
      type Link<A extends CSchema, B extends CSchema> = CSchema<Field_link<A, B>>
      type String                                     = CSchema<Field_string>
      type Union<T extends SchemaDict>                = CSchema<Field_choices<T>>
      type Choices<T extends SchemaDict = SchemaDict> = CSchema<Field_choices<T> & MAGICCHOICES<T>>
      type Choice<T extends SchemaDict = SchemaDict>  = CSchema<Field_choices<T> & MAGICCHOICES<T>>
      type Number                                     = CSchema<Field_number>
      type Color                                      = CSchema<Field_color>
      type List<T extends CSchema>                    = CSchema<Field_list<T>>
      type Board<T extends CSchema>                   = CSchema<Field_board<T>>
      type Seed                                       = CSchema<Field_seed>
      type Matrix                                     = CSchema<Field_matrix>
      type SDate                                      = CSchema<Field_date<Date>>
      // dates
      type XDate                                      = CSchema<Field_date<Date>>
      type SDatePlain                                 = CSchema<Field_date<Temporal.PlainDate>>
      type XDatePlain                                 = CSchema<Field_date<Temporal.PlainDate>>
      type DateTimeZoned                              = CSchema<Field_date<Temporal.ZonedDateTime>>
      type XDateTimeZoned                             = CSchema<Field_date<Temporal.ZonedDateTime>>
      type LLM                                        = CSchema<Field_selectOne<OpenRouter_ModelInfo, OpenRouter_Models>>
      // naming v1
      type XSelectOne<T, ID extends SelectKey>        = CSchema<Field_selectOne<T, ID>>
      type XSelectMany<T, ID extends SelectKey>       = CSchema<Field_selectMany<T, ID>>
      type XSelectOne_<T extends SelectKey>           = CSchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type XSelectMany_<T extends SelectKey>          = CSchema<Field_selectMany<T, T>> // variant that may be shorter to read
      // naming v2
      type SelectOne<T, ID extends SelectKey>         = CSchema<Field_selectOne<T, ID>>
      type SelectMany<T, ID extends SelectKey>        = CSchema<Field_selectMany<T, ID>>
      type SelectOne_<T extends SelectKey>            = CSchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type SelectMany_<T extends SelectKey>           = CSchema<Field_selectMany<T, T>> // variant that may be shorter to read
      // naming v3
      type OneOf<T, ID extends SelectKey>             = CSchema<Field_selectOne<T, ID>>
      type Many<T, ID extends SelectKey>              = CSchema<Field_selectMany<T, ID>>
      type OneOf_<T extends SelectKey>                = CSchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type Many_<T extends SelectKey>                 = CSchema<Field_selectMany<T, T>> // variant that may be shorter to read
      type Size                                       = CSchema<Field_size>
      type Markdown                                   = CSchema<Field_markdown>
      type Prompt                                     = CSchema<Field_prompt>
      type Enum<ENUM_NAME extends keyof Comfy.Slots>  = CSchema<Field_enum<Comfy.Slots[ENUM_NAME]>>
      type EnumOf<O extends ComfyUnionValue>          = CSchema<Field_enum<O>>
      type Orbit                                      = CSchema<Field_orbit>
      type Image                                      = CSchema<Field_image>
      type Custom<T>                                  = CSchema<Field_custom<T>>

      // Fields
      type FShared<T extends Field>                    = Field_shared<T>
      type FSharedAlt<S extends CSchema>               = Field_shared<S['$field']>
      type FGroup<T extends SchemaDict>                = Field_group<T> & MAGICFIELDS<T>
      type FRecord<T extends SchemaDict>               = Field_group<T> & MAGICFIELDS<T>
      type FEmpty                                      = Field_group<NO_PROPS>
      type FMaybe<T extends CSchema>                   = Field_optional<T>
      type FOptional<T extends CSchema>                = Field_optional<T>
      type FBool                                       = Field_bool
      type FLink<A extends CSchema, B extends CSchema> = Field_link<A, B>
      type FString                                     = Field_string
      type FUnion<T extends SchemaDict>                = Field_choices<T>
      type FChoices<T extends SchemaDict = SchemaDict> = Field_choices<T> & MAGICCHOICES<T>
      type FChoice<T extends SchemaDict = SchemaDict>  = Field_choices<T> & MAGICCHOICES<T>
      type FNumber                                     = Field_number
      type FColor                                      = Field_color
      type FList<T extends CSchema>                    = Field_list<T>
      type FBoard<T extends CSchema>                   = Field_board<T>
      type FSeed                                       = Field_seed
      type FMatrix                                     = Field_matrix
      type FSDate                                      = Field_date<Date>
      // dates
      type FXDate                                      = Field_date<Date>
      type FSDatePlain                                 = Field_date<Temporal.PlainDate>
      type FXDatePlain                                 = Field_date<Temporal.PlainDate>
      type FDateTimeZoned                              = Field_date<Temporal.ZonedDateTime>
      type FXDateTimeZoned                             = Field_date<Temporal.ZonedDateTime>
      type FLLM                                        = Field_selectOne<OpenRouter_ModelInfo, OpenRouter_Models>
      // naming v1
      type FXSelectOne<T, ID extends SelectKey>        = Field_selectOne<T, ID>
      type FXSelectMany<T, ID extends SelectKey>       = Field_selectMany<T, ID>
      type FXSelectOne_<T extends SelectKey>           = Field_selectOne<T, T> // variant that may be shorter to read
      type FXSelectMany_<T extends SelectKey>          = Field_selectMany<T, T> // variant that may be shorter to read
      // naming v2
      type FSelectOne<T, ID extends SelectKey>         = Field_selectOne<T, ID>
      type FSelectMany<T, ID extends SelectKey>        = Field_selectMany<T, ID>
      type FSelectOne_<T extends SelectKey>            = Field_selectOne<T, T> // variant that may be shorter to read
      type FSelectMany_<T extends SelectKey>           = Field_selectMany<T, T> // variant that may be shorter to read
      // naming v3
      type FOneOf<T, ID extends SelectKey>             = Field_selectOne<T, ID>
      type FMany<T, ID extends SelectKey>              = Field_selectMany<T, ID>
      type FOneOf_<T extends SelectKey>                = Field_selectOne<T, T> // variant that may be shorter to read
      type FMany_<T extends SelectKey>                 = Field_selectMany<T, T> // variant that may be shorter to read
      type FSize                                       = Field_size
      type FMarkdown                                   = Field_markdown
      type FPrompt                                     = Field_prompt
      type FEnum<ENUM_NAME extends keyof Comfy.Slots>  = Field_enum<Comfy.Slots[ENUM_NAME]>
      type FEnumOf<O extends ComfyUnionValue>          = Field_enum<O>
      type FOrbit                                      = Field_orbit
      type FImage                                      = Field_image
      type FCustom<T>                                  = Field_custom<T>

   }
}
