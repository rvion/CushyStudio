/*

🔶 2024-03-27 rvion:
| In order to make splitting forms as easy as possible
| transitively; but I'm ok with some types to be imported,
| like group, optional, shared, etc, because I expect all standalone
| build to include those.

*/
import type { BaseField } from '../model/BaseField'
import type { Widget_group } from './group/WidgetGroup'
import type { Widget_list } from './list/WidgetList'
import type { Widget_number } from './number/WidgetNumber'
import type { Widget_optional } from './optional/WidgetOptional'
import type { Widget_selectOne } from './selectOne/WidgetSelectOne'
import type { Widget_shared } from './shared/WidgetShared'
import type { Widget_string } from './string/WidgetString'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * 2024-03-27 update: now that we support splitting parts of
 * */
const WidgetDI: { [widgetName: string]: BaseField<any> } = {}

export const getWidgetClass = <Type extends { $Type: string }>(widgetName: Type['$Type']): Type => {
    return WidgetDI[widgetName] as any
}

export const registerWidgetClass = <T extends { $Type: string }>(type: T['$Type'], kls: { new (...args: any[]): T }) => {
    WidgetDI[type] = kls as any
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isWidgetOptional = _isWidget<Widget_optional>('optional')
export const isWidgetShared = _isWidget<Widget_shared>('shared')
export const isWidgetGroup = _isWidget<Widget_group<any>>('group')
export const isWidgetString = _isWidget<Widget_string>('str')
export const isWidgetNumber = _isWidget<Widget_number>('number')
export const isWidgetList = _isWidget<Widget_list<any>>('list')
export const isWidgetSelectOne = _isWidget<Widget_selectOne<any>>('selectOne')

function _isWidget<W extends { $Type: string }>(type: W['$Type']): ((widget: any) => widget is W) {
    return (widget): widget is W => widget.type === type
}
