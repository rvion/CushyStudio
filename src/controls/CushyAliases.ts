import type { ComfyUnionValue } from '../comfyui/comfyui-types'
import type { Field_board } from '../csuite/fields/board/Field_board'
import type { Field_bool } from '../csuite/fields/bool/FieldBool'
import type { Field_choices, MAGICCHOICES } from '../csuite/fields/choices/FieldChoices'
import type { Field_color } from '../csuite/fields/color/FieldColor'
import type { Field_custom } from '../csuite/fields/custom/FieldCustom'
import type { Field_date } from '../csuite/fields/date/FieldDate'
import type { Field_dynamic } from '../csuite/fields/dynamic/FieldDynamic'
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
import type { NO_PROPS } from '../csuite/types/NO_PROPS'
import type { Field_prompt } from '../prompt/FieldPrompt'
import type { Temporal } from '@js-temporal/polyfill'

// TODO:
// alias should only be $type &
// {Field:..., Schema:...}
//  => would make EVERYTHING so much simpler

// prettier-ignore
declare global {
   // eslint-disable-next-line @typescript-eslint/no-namespace
   namespace Z {
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type SchemaDict = import('../csuite/model/SchemaDict').SchemaDict
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type Builder = import('./CushyBuilder').CushySchemaBuilder
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type Field = import('../csuite/model/Field').Field
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
      type Runtime = import('../runtime/Runtime').Runtime

      // #region core types

      // schema aliases
      type Shared<T extends Field>                    = CSchema<Field_shared<T>>

      type Group<T extends SchemaDict>                = CSchema<Field_group<T> & MAGICFIELDS<T>>
      type Record<T extends SchemaDict>               = CSchema<Field_group<T> & MAGICFIELDS<T>>

      type Empty                                      = CSchema<Field_group<NO_PROPS>>
      type Maybe<T extends CSchema>                   = CSchema<Field_optional<T>>
      type Bool                                       = CSchema<Field_bool>
      type Link<A extends CSchema, B extends CSchema> = CSchema<Field_link<A, B>>
      type String                                     = CSchema<Field_string>

      type Union<T extends SchemaDict>                = CSchema<Field_choices<T>>
      type Choices<T extends SchemaDict = SchemaDict> = CSchema<Field_choices<T> & MAGICCHOICES<T>>
      type Choice<T extends SchemaDict = SchemaDict>  = CSchema<Field_choices<T> & MAGICCHOICES<T>>

      type Number                                     = CSchema<Field_number>
      type Color                                      = CSchema<Field_color>
      type List<T extends CSchema>                    = CSchema<Field_list<T>>
      type Dynamic<T extends CSchema>                 = CSchema<Field_dynamic<T>>
      type Board<T extends CSchema>                   = CSchema<Field_board<T>>
      type Seed                                       = CSchema<Field_seed>
      type Matrix                                     = CSchema<Field_matrix>

      // dates
      type SDate                                      = CSchema<Field_date<Date>>
      type XDate                                      = CSchema<Field_date<Date>>
      type SDatePlain                                 = CSchema<Field_date<Temporal.PlainDate>>
      type XDatePlain                                 = CSchema<Field_date<Temporal.PlainDate>>
      type DateTimeZoned                              = CSchema<Field_date<Temporal.ZonedDateTime>>
      type XDateTimeZoned                             = CSchema<Field_date<Temporal.ZonedDateTime>>

      // #region select
      // naming v1
      type XSelectOne<T, ID extends SelectKey>        = CSchema<Field_selectOne<T, ID>>
      type XSelectMany<T, ID extends SelectKey>       = CSchema<Field_selectMany<T, ID>>
      type XSelectOne_<T extends SelectKey>           = CSchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type XSelectMany_<T extends SelectKey>          = CSchema<Field_selectMany<T, T>> // variant that may be shorter to read
      // naming v2
      type SelectOne<T, ID extends SelectKey>        = CSchema<Field_selectOne<T, ID>>
      type SelectMany<T, ID extends SelectKey>       = CSchema<Field_selectMany<T, ID>>
      type SelectOne_<T extends SelectKey>           = CSchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type SelectMany_<T extends SelectKey>          = CSchema<Field_selectMany<T, T>> // variant that may be shorter to read
      // naming v3
      type OneOf<T, ID extends SelectKey>        = CSchema<Field_selectOne<T, ID>>
      type Many<T, ID extends SelectKey>       = CSchema<Field_selectMany<T, ID>>
      type OneOf_<T extends SelectKey>           = CSchema<Field_selectOne<T, T>> // variant that may be shorter to read
      type Many_<T extends SelectKey>          = CSchema<Field_selectMany<T, T>> // variant that may be shorter to read

      type Size                                       = CSchema<Field_size>
      type Markdown                                   = CSchema<Field_markdown>

      type Prompt                                     = CSchema<Field_prompt>
      type Enum<ENUM_NAME extends keyof Comfy.Slots>  = CSchema<Field_enum<Comfy.Slots[ENUM_NAME]>>
      type EnumOf<O extends ComfyUnionValue>          = CSchema<Field_enum<O>>
      type Orbit                                      = CSchema<Field_orbit>
      type Image                                      = CSchema<Field_image>
      type Custom<T>                                  = CSchema<Field_custom<T>>
   }
}
