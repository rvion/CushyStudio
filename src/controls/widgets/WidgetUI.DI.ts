import type { Widget_bool } from './bool/WidgetBool'
import type { Widget_button } from './button/WidgetButton'
import type { Widget_choices } from './choices/WidgetChoices'
import type { Widget_color } from './color/WidgetColor'
import type { Widget_custom } from './custom/WidgetCustom'
import type { Widget_enum } from './enum/WidgetEnum'
import type { Widget_group } from './group/WidgetGroup'
import type { Widget_image } from './image/WidgetImage'
import type { Widget_list } from './list/WidgetList'
import type { Widget_listExt } from './listExt/WidgetListExt'
import type { Widget_markdown } from './markdown/WidgetMarkdown'
import type { Widget_matrix } from './matrix/WidgetMatrix'
import type { Widget_number } from './number/WidgetNumber'
import type { Widget_optional } from './optional/WidgetOptional'
import type { Widget_orbit } from './orbit/WidgetOrbit'
import type { Widget_prompt } from './prompt/WidgetPrompt'
import type { Widget_seed } from './seed/WidgetSeed'
import type { Widget_selectMany } from './selectMany/WidgetSelectMany'
import type { Widget_selectOne } from './selectOne/WidgetSelectOne'
import type { Widget_shared } from './shared/WidgetShared'
import type { Widget_size } from './size/WidgetSize'
import type { Widget_spacer } from './spacer/WidgetSpacer'
import type { Widget_string } from './string/WidgetString'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * */
export let WidgetDI = {
    Widget_shared /*     */: 0 as any as typeof Widget_shared,
    Widget_optional /*   */: 0 as any as typeof Widget_optional,
    Widget_color /*      */: 0 as any as typeof Widget_color,
    Widget_string /*     */: 0 as any as typeof Widget_string,
    Widget_prompt /*     */: 0 as any as typeof Widget_prompt,
    Widget_seed /*       */: 0 as any as typeof Widget_seed,
    Widget_number /*     */: 0 as any as typeof Widget_number,
    Widget_bool /*       */: 0 as any as typeof Widget_bool,
    Widget_button /*     */: 0 as any as typeof Widget_button,
    Widget_markdown /*   */: 0 as any as typeof Widget_markdown,
    Widget_custom /*     */: 0 as any as typeof Widget_custom,
    Widget_size /*       */: 0 as any as typeof Widget_size,
    Widget_spacer /*     */: 0 as any as typeof Widget_spacer,
    Widget_matrix /*     */: 0 as any as typeof Widget_matrix,
    Widget_image /*      */: 0 as any as typeof Widget_image,
    Widget_selectMany /* */: 0 as any as typeof Widget_selectMany,
    Widget_selectOne /*  */: 0 as any as typeof Widget_selectOne,
    Widget_list /*       */: 0 as any as typeof Widget_list,
    Widget_group /*      */: 0 as any as typeof Widget_group,
    Widget_choices /*    */: 0 as any as typeof Widget_choices,
    Widget_enum /*       */: 0 as any as typeof Widget_enum,
    Widget_listExt /*    */: 0 as any as typeof Widget_listExt,
    Widget_orbit /*      */: 0 as any as typeof Widget_orbit,
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isWidgetChoice = (widget: any): widget is Widget_choices => widget.type === 'choices'
export const isWidgetOptional = (widget: any): widget is Widget_optional => widget.type === 'optional'
export const isWidgetPrompt = (widget: any): widget is Widget_prompt => widget.type === 'prompt'
export const isWidgetShared = (widget: any): widget is Widget_shared => widget.type === 'shared'
export const isWidgetGroup = (widget: any): widget is Widget_group<any> => widget.type === 'group'
export const isWidgetList = (widget: any): widget is Widget_list<any> => widget.type === 'list'
