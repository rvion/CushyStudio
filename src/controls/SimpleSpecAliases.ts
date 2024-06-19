import type { IBlueprint, SchemaDict } from './IBlueprint'
import type { SimpleBlueprint } from './SimpleSpec'
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

export type SGroup<T extends SchemaDict> = SimpleBlueprint<Widget_group<T>>
export type SOptional<T extends IBlueprint> = SimpleBlueprint<Widget_optional<T>>
export type SBool = SimpleBlueprint<Widget_bool>
export type SString = SimpleBlueprint<Widget_string>
export type SChoices<T extends SchemaDict = SchemaDict> = SimpleBlueprint<Widget_choices<T>>
export type SNumber = SimpleBlueprint<Widget_number>
export type SColor = SimpleBlueprint<Widget_color>
export type SList<T extends IBlueprint> = SimpleBlueprint<Widget_list<T>>
export type SButton<T> = SimpleBlueprint<Widget_button<T>>
export type SSeed = SimpleBlueprint<Widget_seed>
export type SMatrix = SimpleBlueprint<Widget_matrix>
export type SSelectOne<T extends BaseSelectEntry> = SimpleBlueprint<Widget_selectOne<T>>
export type SSelectMany<T extends BaseSelectEntry> = SimpleBlueprint<Widget_selectMany<T>>
export type SSelectOne_<T extends string> = SimpleBlueprint<Widget_selectOne<BaseSelectEntry<T>>> // variant that may be shorter to read
export type SSelectMany_<T extends string> = SimpleBlueprint<Widget_selectMany<BaseSelectEntry<T>>> // variant that may be shorter to read
export type SSize = SimpleBlueprint<Widget_size>
export type SSpacer = SimpleBlueprint<Widget_spacer>
export type SMarkdown = SimpleBlueprint<Widget_markdown>
