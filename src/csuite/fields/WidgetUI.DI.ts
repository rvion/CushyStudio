/*
🔶 2024-03-27 rvion:
| In order to make splitting forms as easy as possible
| transitively; but I'm ok with some types to be imported,
| like group, optional, shared, etc, because I expect all standalone
| build to include those.
*/

import type { Field } from '../model/Field'
import type { Repository } from '../model/Repository'
import type { Field_group } from './group/FieldGroup'
import type { Field_link } from './link/FieldLink'
import type { Field_list } from './list/FieldList'
import type { Field_number } from './number/FieldNumber'
import type { Field_optional } from './optional/FieldOptional'
import type { Field_selectOne } from './selectOne/FieldSelectOne'
import type { Field_shared } from './shared/FieldShared'
import type { Field_string } from './string/FieldString'

import { bang } from '../utils/bang'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * 2024-03-27 update: now that we support splitting parts of
 * */
const KNOWN_FIELDS: { [widgetName: string]: Field<any> } = {}

export const getFieldClass = (fieldType: string): unknown => {
    return bang(KNOWN_FIELDS[fieldType] as any)
}

export const getFieldOptionalClass = (): typeof Field_optional => getFieldClass('optional') as any
export const getFieldLinkClass = (): typeof Field_link<any, any> => getFieldClass('link') as any
export const getFieldSharedClass = (): typeof Field_shared => getFieldClass('shared') as any
export const getFieldGroupClass = (): typeof Field_group<any> => getFieldClass('group') as any
export const getFieldStringClass = (): typeof Field_string => getFieldClass('str') as any
export const getFieldNumberClass = (): typeof Field_number => getFieldClass('number') as any
export const getFieldListClass = (): typeof Field_list<any> => getFieldClass('list') as any
export const getFieldSelectOneClass = (): typeof Field_selectOne<any> => getFieldClass('selectOne') as any

export const registerFieldClass = <T extends { $Type: string }>(
    //
    type: T['$Type'],
    kls: { new (...args: any[]): T },
): void => {
    KNOWN_FIELDS[type] = kls as any
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isFieldOptional = _checkIfIs<Field_optional>('optional')
export const isFieldLink = _checkIfIs<Field_link<any, any>>('link')
export const isFieldShared = _checkIfIs<Field_shared>('shared')
export const isFieldGroup = _checkIfIs<Field_group<any>>('group')
export const isFieldString = _checkIfIs<Field_string>('str')
export const isFieldNumber = _checkIfIs<Field_number>('number')
export const isFieldList = _checkIfIs<Field_list<any>>('list')
export const isFieldSelectOne = _checkIfIs<Field_selectOne<any>>('selectOne')

function _checkIfIs<W extends { $Type: string }>(
    /** widget type to check */
    type: W['$Type'],
): (widget: any) => widget is W {
    return (widget): widget is W => widget.type === type
}
