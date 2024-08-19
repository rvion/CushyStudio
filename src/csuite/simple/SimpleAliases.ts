import type { Field_bool } from '../fields/bool/FieldBool'
import type { Field_button } from '../fields/button/FieldButton'
import type { Field_choices } from '../fields/choices/FieldChoices'
import type { Field_color } from '../fields/color/FieldColor'
import type { Field_group, FieldGroup } from '../fields/group/FieldGroup'
import type { Field_link } from '../fields/link/FieldLink'
import type { Field_list } from '../fields/list/FieldList'
import type { Field_markdown } from '../fields/markdown/FieldMarkdown'
import type { Field_matrix } from '../fields/matrix/FieldMatrix'
import type { Field_number } from '../fields/number/FieldNumber'
import type { Field_optional } from '../fields/optional/FieldOptional'
import type { Field_seed } from '../fields/seed/FieldSeed'
import type { Field_selectMany } from '../fields/selectMany/FieldSelectMany'
import type { Field_selectOne, SelectOption } from '../fields/selectOne/FieldSelectOne'
import type { Field_shared } from '../fields/shared/FieldShared'
import type { Field_size } from '../fields/size/FieldSize'
import type { Field_string } from '../fields/string/FieldString'
import type { BaseSchema } from '../model/BaseSchema'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { SimpleSchema } from './SimpleSchema'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace S {
        //  ====== core ==============================================================
        type SchemaDict = import('../model/SchemaDict').SchemaDict
        type Builder = import('./SimpleBuilder').SimpleBuilder
        type Field = import('../model/Field').Field

        //  ====== field aliases ======================================================
        type Shared<T extends Field> = Field_shared<T>
        //
        type Group<T extends SchemaDict> = Field_group<T>
        type List<T extends BaseSchema> = Field_list<T>
        type Link<A extends BaseSchema, B extends BaseSchema> = Field_link<A, B>
        type Choices<T extends SchemaDict = SchemaDict> = Field_choices<T>
        type Optional<T extends BaseSchema> = Field_optional<T>
        //

        //  🔴 loco select fields changes not ported to other builders
        type SelectOne<T extends SelectOption<any>> = Field_selectOne<T>
        //  🔴 loco select fields changes not ported to other builders
        type SelectMany<T extends SelectOption<any>> = Field_selectMany<T>
        type SelectOne_<T extends string> = Field_selectOne<SelectOption<T>>
        type SelectMany_<T extends string> = Field_selectMany<SelectOption<T>>
        //
        type Empty = Field_group<NO_PROPS>
        type Bool = Field_bool
        type String = Field_string
        type Number = Field_number
        type Color = Field_color
        type Seed = Field_seed
        type Matrix = Field_matrix
        type Size = Field_size
        //
        type Button<T> = Field_button<T>
        type Markdown = Field_markdown

        //  ====== schema aliases ======================================================
        type SShared<T extends Field> = SimpleSchema<Field_shared<T>>
        //
        type SGroup<T extends SchemaDict> = SimpleSchema<FieldGroup<T>>
        type SList<T extends BaseSchema> = SimpleSchema<Field_list<T>>
        type SLink<A extends BaseSchema, B extends BaseSchema> = SimpleSchema<Field_link<A, B>>
        type SChoices<T extends SchemaDict = SchemaDict> = SimpleSchema<Field_choices<T>>
        type SOptional<T extends BaseSchema> = SimpleSchema<Field_optional<T>>
        //
        //  🔴 loco select fields changes not ported to other builders
        type SSelectOne<T extends SelectOption<any>> = SimpleSchema<Field_selectOne<T>>
        //  🔴 loco select fields changes not ported to other builders
        type SSelectMany<T extends SelectOption<any>> = SimpleSchema<Field_selectMany<T>>
        type SSelectOne_<T extends string> = SimpleSchema<Field_selectOne<SelectOption<T>>> // variant that may be shorter to read
        type SSelectMany_<T extends string> = SimpleSchema<Field_selectMany<SelectOption<T>>> // variant that may be shorter to read
        //
        type SEmpty = SimpleSchema<Field_group<NO_PROPS>>
        type SBool = SimpleSchema<Field_bool>
        type SString = SimpleSchema<Field_string>
        type SNumber = SimpleSchema<Field_number>
        type SColor = SimpleSchema<Field_color>
        type SSeed = SimpleSchema<Field_seed>
        type SMatrix = SimpleSchema<Field_matrix>
        type SSize = SimpleSchema<Field_size>
        //
        type SButton<T> = SimpleSchema<Field_button<T>>
        type SMarkdown = SimpleSchema<Field_markdown>
    }
}
