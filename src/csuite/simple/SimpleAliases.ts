import type { Widget_bool } from '../fields/bool/WidgetBool'
import type { Widget_button } from '../fields/button/WidgetButton'
import type { Widget_choices } from '../fields/choices/WidgetChoices'
import type { Widget_color } from '../fields/color/WidgetColor'
import type { Widget_group } from '../fields/group/WidgetGroup'
import type { Widget_list } from '../fields/list/WidgetList'
import type { Widget_markdown } from '../fields/markdown/WidgetMarkdown'
import type { Widget_matrix } from '../fields/matrix/WidgetMatrix'
import type { Widget_number } from '../fields/number/WidgetNumber'
import type { Widget_optional } from '../fields/optional/WidgetOptional'
import type { Widget_seed } from '../fields/seed/WidgetSeed'
import type { Widget_selectMany } from '../fields/selectMany/WidgetSelectMany'
import type { BaseSelectEntry, Widget_selectOne } from '../fields/selectOne/WidgetSelectOne'
import type { Widget_size } from '../fields/size/WidgetSize'
import type { Widget_spacer } from '../fields/spacer/WidgetSpacer'
import type { Widget_string } from '../fields/string/WidgetString'
import type { ISchema, SchemaDict } from '../model/ISchema'
import type { SimpleSchema } from './SimpleSchema'

export type SGroup<T extends SchemaDict> = SimpleSchema<Widget_group<T>>
export type SOptional<T extends ISchema> = SimpleSchema<Widget_optional<T>>
export type SBool = SimpleSchema<Widget_bool>
export type SString = SimpleSchema<Widget_string>
export type SChoices<T extends SchemaDict = SchemaDict> = SimpleSchema<Widget_choices<T>>
export type SNumber = SimpleSchema<Widget_number>
export type SColor = SimpleSchema<Widget_color>
export type SList<T extends ISchema> = SimpleSchema<Widget_list<T>>
export type SButton<T> = SimpleSchema<Widget_button<T>>
export type SSeed = SimpleSchema<Widget_seed>
export type SMatrix = SimpleSchema<Widget_matrix>
export type SSelectOne<T extends BaseSelectEntry> = SimpleSchema<Widget_selectOne<T>>
export type SSelectMany<T extends BaseSelectEntry> = SimpleSchema<Widget_selectMany<T>>
export type SSelectOne_<T extends string> = SimpleSchema<Widget_selectOne<BaseSelectEntry<T>>> // variant that may be shorter to read
export type SSelectMany_<T extends string> = SimpleSchema<Widget_selectMany<BaseSelectEntry<T>>> // variant that may be shorter to read
export type SSize = SimpleSchema<Widget_size>
export type SSpacer = SimpleSchema<Widget_spacer>
export type SMarkdown = SimpleSchema<Widget_markdown>
