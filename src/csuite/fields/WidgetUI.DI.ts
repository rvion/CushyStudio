/*

🔶 2024-03-27 rvion:
| In order to make splitting forms as easy as possible
| transitively; but I'm ok with some types to be imported,
| like group, optional, shared, etc, because I expect all standalone
| build to include those.

*/
import type { Field } from '../model/Field'
import type { Field_group } from './group/FieldGroup'
import type { Field_link } from './link/FieldLink'
import type { Field_list } from './list/FieldList'
import type { Field_number } from './number/FieldNumber'
import type { Field_optional } from './optional/FieldOptional'
import type { Field_selectOne } from './selectOne/FieldSelectOne'
import type { Field_shared } from './shared/FieldShared'
import type { Field_string } from './string/FieldString'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * 2024-03-27 update: now that we support splitting parts of
 * */
const WidgetDI: { [widgetName: string]: Field<any> } = {}

export const getFieldClass = <Type extends { $Type: string }>(widgetName: Type['$Type']): Type => {
    return WidgetDI[widgetName] as any
}

/* TODO: rename to `registerFieldClass` */
//           VVVVVVVVVVVVVVVVVVV
export const registerWidgetClass = <T extends { $Type: string }>(type: T['$Type'], kls: { new (...args: any[]): T }): void => {
    WidgetDI[type] = kls as any
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isWidgetOptional = _isWidget<Field_optional>('optional')
export const isWidgetLink = _isWidget<Field_link<any, any>>('link')
export const isWidgetShared = _isWidget<Field_shared>('shared')
export const isWidgetGroup = _isWidget<Field_group<any>>('group')
export const isWidgetString = _isWidget<Field_string>('str')
export const isWidgetNumber = _isWidget<Field_number>('number')
export const isWidgetList = _isWidget<Field_list<any>>('list')
export const isWidgetSelectOne = _isWidget<Field_selectOne<any>>('selectOne')

function _isWidget<W extends { $Type: string }>(type: W['$Type']): (widget: any) => widget is W {
    return (widget): widget is W => widget.type === type
}
