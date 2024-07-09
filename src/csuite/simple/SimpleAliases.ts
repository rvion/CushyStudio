import type { Field_bool } from '../fields/bool/FieldBool'
import type { Field_button } from '../fields/button/FieldButton'
import type { Field_choices } from '../fields/choices/FieldChoices'
import type { Field_color } from '../fields/color/FieldColor'
import type { Field_group } from '../fields/group/WidgetGroup'
import type { Field_link } from '../fields/link/WidgetLink'
import type { Field_list } from '../fields/list/WidgetList'
import type { Field_markdown } from '../fields/markdown/WidgetMarkdown'
import type { Field_matrix } from '../fields/matrix/WidgetMatrix'
import type { Field_number } from '../fields/number/FieldNumber'
import type { Field_optional } from '../fields/optional/WidgetOptional'
import type { Field_seed } from '../fields/seed/WidgetSeed'
import type { Field_selectMany } from '../fields/selectMany/WidgetSelectMany'
import type { BaseSelectEntry, Field_selectOne } from '../fields/selectOne/WidgetSelectOne'
import type { Field_shared } from '../fields/shared/WidgetShared'
import type { Field_size } from '../fields/size/WidgetSize'
import type { Field_string } from '../fields/string/WidgetString'
import type { ISchema } from '../model/ISchema'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { SimpleSchema } from './SimpleSchema'

declare global {
    namespace S {
        // core utils
        type SchemaDict = import('../model/SchemaDict').SchemaDict
        type Builder = import('./SimpleBuilder').SimpleBuilder
        type Field = import('../model/Field').Field

        // field aliases
        // ...

        // schema aliases
        type SShared<T extends Field> = SimpleSchema<Field_shared<T>>
        type SGroup<T extends SchemaDict> = SimpleSchema<Field_group<T>>
        type SEmpty = SimpleSchema<Field_group<NO_PROPS>>
        type SOptional<T extends ISchema> = SimpleSchema<Field_optional<T>>
        type SBool = SimpleSchema<Field_bool>
        type SLink<A extends ISchema, B extends ISchema> = SimpleSchema<Field_link<A, B>>
        type SString = SimpleSchema<Field_string>
        type SChoices<T extends SchemaDict = SchemaDict> = SimpleSchema<Field_choices<T>>
        type SNumber = SimpleSchema<Field_number>
        type SColor = SimpleSchema<Field_color>
        type SList<T extends ISchema> = SimpleSchema<Field_list<T>>
        type SButton<T> = SimpleSchema<Field_button<T>>
        type SSeed = SimpleSchema<Field_seed>
        type SMatrix = SimpleSchema<Field_matrix>
        type SSelectOne<T extends BaseSelectEntry> = SimpleSchema<Field_selectOne<T>>
        type SSelectMany<T extends BaseSelectEntry> = SimpleSchema<Field_selectMany<T>>
        type SSelectOne_<T extends string> = SimpleSchema<Field_selectOne<BaseSelectEntry<T>>> // variant that may be shorter to read
        type SSelectMany_<T extends string> = SimpleSchema<Field_selectMany<BaseSelectEntry<T>>> // variant that may be shorter to read
        type SSize = SimpleSchema<Field_size>
        type SMarkdown = SimpleSchema<Field_markdown>
    }
}
