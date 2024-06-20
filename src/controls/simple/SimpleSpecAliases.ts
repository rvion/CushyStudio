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
import type { IBlueprint, SchemaDict } from '../model/IBlueprint'
import type { SimpleBlueprint } from './SimpleBlueprint'

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
