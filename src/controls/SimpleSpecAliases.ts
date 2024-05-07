import type { ISpec, SchemaDict } from './ISpec'
import type { SimpleSpec } from './SimpleSpec'
import type { Widget_bool } from './widgets/bool/WidgetBool'
import type { Widget_button } from './widgets/button/WidgetButton'
import type { Widget_choices } from './widgets/choices/WidgetChoices'
import type { Widget_color } from './widgets/color/WidgetColor'
import type { Widget_group } from './widgets/group/WidgetGroup'
import type { Widget_list } from './widgets/list/WidgetList'
import type { Widget_markdown } from './widgets/markdown/WidgetMarkdown'
import type { Widget_matrix } from './widgets/matrix/WidgetMatrix'
import type { Widget_number } from './widgets/number/WidgetNumber'
import type { Widget_optional } from './widgets/optional/WidgetOptional'
import type { Widget_seed } from './widgets/seed/WidgetSeed'
import type { Widget_selectMany } from './widgets/selectMany/WidgetSelectMany'
import type { BaseSelectEntry, Widget_selectOne } from './widgets/selectOne/WidgetSelectOne'
import type { Widget_size } from './widgets/size/WidgetSize'
import type { Widget_spacer } from './widgets/spacer/WidgetSpacer'
import type { Widget_string } from './widgets/string/WidgetString'

export type SGroup<T extends SchemaDict> = SimpleSpec<Widget_group<T>>
export type SOptional<T extends ISpec> = SimpleSpec<Widget_optional<T>>
export type SBool = SimpleSpec<Widget_bool>
export type SString = SimpleSpec<Widget_string>
export type SChoices<T extends SchemaDict = SchemaDict> = SimpleSpec<Widget_choices<T>>
export type SNumber = SimpleSpec<Widget_number>
export type SColor = SimpleSpec<Widget_color>
export type SList<T extends ISpec> = SimpleSpec<Widget_list<T>>
export type SButton<T> = SimpleSpec<Widget_button<T>>
export type SSeed = SimpleSpec<Widget_seed>
export type SMatrix = SimpleSpec<Widget_matrix>
export type SSelectOne<T extends BaseSelectEntry> = SimpleSpec<Widget_selectOne<T>>
export type SSelectMany<T extends BaseSelectEntry> = SimpleSpec<Widget_selectMany<T>>
export type SSelectOne_<T extends string> = SimpleSpec<Widget_selectOne<BaseSelectEntry<T>>> // variant that may be shorter to read
export type SSelectMany_<T extends string> = SimpleSpec<Widget_selectMany<BaseSelectEntry<T>>> // variant that may be shorter to read
export type SSize = SimpleSpec<Widget_size>
export type SSpacer = SimpleSpec<Widget_spacer>
export type SMarkdown = SimpleSpec<Widget_markdown>
