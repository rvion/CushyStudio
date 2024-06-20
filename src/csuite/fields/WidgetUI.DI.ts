/*

🔶 2024-03-27 rvion:
| In order to make splitting forms as easy as possible
| we need to make sure this is not importing all cushy types
| transitively; but I'm ok with some types to be imported,
| like group, optional, shared, etc, because I expect all standalone
| build to include those.

*/
import type { BaseField } from '../model/BaseField'
import type { Widget_group } from './group/WidgetGroup'
import type { Widget_optional } from './optional/WidgetOptional'
import type { Widget_shared } from './shared/WidgetShared'
import type { Widget_string } from './string/WidgetString'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * 2024-03-27 update: now that we support splitting parts of
 * */
let WidgetDI: { [widgetName: string]: BaseField<any> } = {}

export const getWidgetClass = <Type extends { $Type: string }>(widgetName: Type['$Type']): Type => {
    return WidgetDI[widgetName] as any
}

export const registerWidgetClass = <T extends { $Type: string }>(type: T['$Type'], kls: { new (...args: any[]): T }) => {
    WidgetDI[type] = kls as any
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isWidgetOptional = (widget: any): widget is Widget_optional => widget.type === 'optional'
export const isWidgetShared = (widget: any): widget is Widget_shared => widget.type === 'shared'
export const isWidgetGroup = (widget: any): widget is Widget_group<any> => widget.type === 'group'
export const isWidgetString = (widget: any): widget is Widget_string => widget.type === 'string'
