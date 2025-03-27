/*
🔶 2024-03-27 rvion:
| In order to make splitting forms as easy as possible
| transitively; but I'm ok with some types to be imported,
| like group, optional, shared, etc, because I expect all standalone
| build to include those.
*/

// 🚂 import type { Field_address } from '../../../../csuite-loco/fields/address/FieldAddress'
// 🚂 import type { Field_file } from '../../../../csuite-loco/fields/file/FieldFile'
// 🚂 import type { Field_relationship } from '../../../../csuite-loco/fields/relationship/FieldRelationship'
// 🚂 import type { Field_relationships } from '../../../../csuite-loco/fields/relationship/FieldRelationships'
import type { CSchema } from '../model/CSchema'
import type { Field } from '../model/Field'
import type { FieldSerial_CommonProperties } from '../model/FieldSerial'
import type { SchemaDict } from '../model/SchemaDict'
import type { Field_bool } from './bool/FieldBool'
import type { Field_choices } from './choices/FieldChoices'
import type { Field_date } from './date/FieldDate'
import type { Field_group } from './group/FieldGroup'
import type { Field_image } from './image/FieldImage'
import type { Field_list } from './list/FieldList'
import type { Field_markdown } from './markdown/FieldMarkdown'
import type { Field_number } from './number/FieldNumber'
import type { Field_optional } from './optional/FieldOptional'
import type { Field_selectMany } from './selectMany/FieldSelectMany'
import type { Field_selectOne } from './selectOne/FieldSelectOne'
import type { SelectKey } from './selectOne/SelectOneKey'
import type { Field_shared } from './shared/FieldShared'
import type { Field_string } from './string/FieldString'

import { bang } from '../utils/bang'

/**
 * DI (Dependency Injection)
 * this is here to allow for hot reloading of complex widgets
 * regardless of circular dependencies.
 * 2024-03-27 update: now that we support splitting parts of
 * */
export const KNOWN_FIELDS: CATALOG.AllFields = {} as any

export const getFieldClass = (fieldType: CATALOG.AllFieldTypes): unknown => {
   return bang(KNOWN_FIELDS[fieldType] as any)
}

export const getFieldOptionalClass = (): typeof Field_optional => getFieldClass('optional') as any
export const getFieldSharedClass = (): typeof Field_shared => getFieldClass('shared') as any
export const getFieldGroupClass = (): typeof Field_group<any> => getFieldClass('group') as any
export const getFieldStringClass = (): typeof Field_string => getFieldClass('str') as any
export const getFieldNumberClass = (): typeof Field_number => getFieldClass('number') as any
export const getFieldListClass = (): typeof Field_list<any> => getFieldClass('list') as any
export const getFieldSelectOneClass = (): typeof Field_selectOne<any, string> =>
   getFieldClass('selectOne') as any

export const registerFieldClass = <T extends { ['Ҩtype']: CATALOG.AllFieldTypes }>(
   //
   type: T['Ҩtype'],
   kls: { new (...args: any[]): T },
): void => {
   KNOWN_FIELDS[type] = kls as any
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isSchemaOptional = _checkIfIsSchemaOf<Field_optional>('optional')
export const isSchemaShared = _checkIfIsSchemaOf<Field_shared>('shared')
export const isSchemaGroup = _checkIfIsSchemaOf<Field_group<SchemaDict>>('group')
export const isSchemaString = _checkIfIsSchemaOf<Field_string>('str')
export const isSchemaNumber = _checkIfIsSchemaOf<Field_number>('number')
export const isSchemaBool = _checkIfIsSchemaOf<Field_bool>('bool')
export const isSchemaList = _checkIfIsSchemaOf<Field_list<any>>('list')
export const isSchemaSelectOne = _checkIfIsSchemaOf<Field_selectOne<any, any>>('selectOne')
export const isSchemaSelectMany = _checkIfIsSchemaOf<Field_selectMany<any, any>>('selectMany')
export const isSchemaChoices = _checkIfIsSchemaOf<Field_choices<any>>('choices', (f) => f.multi === true)
export const isSchemaChoice = _checkIfIsSchemaOf<Field_choices<any>>('choices', (f) => f.multi !== true)
export const isSchemaDate = _checkIfIsSchemaOf<Field_date<any>>('date')
// 🚂 export const isSchemaFile = _checkIfIsSchemaOf<Field_file>('file')
// 🚂 export const isSchemaAddress = _checkIfIsSchemaOf<Field_address>('address')
// 🚂 export const isSchemaRelationship = _checkIfIsSchemaOf<Field_relationship<any>>('relationship')
// 🚂 export const isSchemaRelationships = _checkIfIsSchemaOf<Field_relationships<any>>('relationships')

function _checkIfIsSchemaOf<F extends Field>(
   /** widget type to check */
   type: F['Ҩtype'],
   predicate?: (schema: F['Ҩconfig']) => boolean,
): (widget: any) => widget is CSchema<F> {
   return (widget): widget is CSchema<F> => {
      if (widget == null) return false
      if (typeof widget !== 'object') return false
      if (widget.type !== type) return false
      if (predicate && !predicate(widget.config)) return false
      return true
   }
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isFieldOptional = _checkIfIs<Field_optional>('optional')
export const isFieldShared = _checkIfIs<Field_shared>('shared')
export const isFieldGroup = _checkIfIs<Field_group<any>>('group')
export const isFieldString = _checkIfIs<Field_string>('str')
export const isFieldMarkdown = _checkIfIs<Field_markdown>('markdown')
export const isFieldNumber = _checkIfIs<Field_number>('number')
export const isFieldBool = _checkIfIs<Field_bool>('bool')
export const isFieldImage = _checkIfIs<Field_image>('image')
export const isFieldList = _checkIfIs<Field_list<any>>('list')
export const isFieldSelectOne = _checkIfIs<Field_selectOne<any, any>>('selectOne')
export const isFieldSelectMany = _checkIfIs<Field_selectMany<any, any>>('selectMany')
export const isFieldChoices = _checkIfIs<Field_choices<any>>('choices', (f) => f.isMulti)
export const isFieldChoice = _checkIfIs<Field_choices<any>>('choices', (f) => f.isSingle)
export const isFieldDate = _checkIfIs<Field_date<any>>('date')
export const isFieldDateOptional = _checkIfIsOptionalOf<Z.SDatePlain>('date')
// 🚂 export const isFieldFile = _checkIfIs<Field_file>('file')
// 🚂 export const isFieldAddress = _checkIfIs<Field_address>('address')
// 🚂 export const isFieldRelationship = _checkIfIs<Field_relationship<any>>('relationship')
// 🚂 export const isFieldRelationships = _checkIfIs<Field_relationships<any>>('relationships')

function _checkIfIs<F extends Field>(
   /** widget type to check */
   type: F['Ҩtype'],
   predicate?: (field: F) => boolean,
): (field: any) => field is F {
   return (field): field is F => {
      if (field == null) return false
      if (typeof field !== 'object') return false
      if (field.type !== type) return false
      if (predicate && !predicate(field)) return false
      return true
   }
}

function _checkIfIsOptionalOf<S extends CSchema>(
   type: S['Ҩtype'],
   predicate?: (field: S['Ҩfield']) => boolean,
): (field: any) => field is Field_optional<S> {
   const checkChild = _checkIfIs<S['Ҩfield']>(type, predicate)

   return (field): field is Field_optional<S> => {
      if (!isFieldOptional(field)) return false
      const child = field.child
      return checkChild(child)
   }
}

// help with DI, and help around some typescript bug not able to narrow types
// in conditional when instance of is used with a ctor stored in a dictionary
export const isProbablySerialOptional = isProbablySerialOf<Field_optional>('optional')
export const isProbablySerialShared = isProbablySerialOf<Field_shared>('shared')
export const isProbablySerialGroup = isProbablySerialOf<Field_group<SchemaDict>>('group')
export const isProbablySerialString = isProbablySerialOf<Field_string>('str')
export const isProbablySerialList = isProbablySerialOf<Field_list<CSchema>>('list')
export const isProbablySerialDate = isProbablySerialOf<Field_date<any>>('date')
export const isProbablySerialNumber = isProbablySerialOf<Field_number>('number')
export const isProbablySerialBool = isProbablySerialOf<Field_bool>('bool')
export const isProbablySerialSelectOne = isProbablySerialOf<Field_selectOne<unknown, SelectKey>>('selectOne')
export const isProbablySerialSelectMany = isProbablySerialOf<Field_selectMany<unknown, SelectKey>>('selectMany') // prettier-ignore
export const isProbablySerialChoices = isProbablySerialOf<Field_choices>('choices')

const OBJECT_PROTO = Object.getPrototypeOf({})

// TODO: unify those 3 functions

export const isProbablySomeFieldSerial = (object: object): object is FieldSerial_CommonProperties => {
   if (object == null) return false
   if (typeof object !== 'object') return false
   if (Object.getPrototypeOf(object) !== OBJECT_PROTO) return false
   return '$' in object && typeof object.$ === 'string'
}

export const isProbablySomeFieldSerialOf = (
   object: unknown,
   type: string,
): object is FieldSerial_CommonProperties => {
   if (object == null) return false
   if (typeof object !== 'object') return false
   if (Object.getPrototypeOf(object) !== OBJECT_PROTO) return false
   return '$' in object && object.$ === type
}

function isProbablySerialOf<F extends Field>(
   /** widget type to check */
   type: F['Ҩserial']['$'],
): (serial: any) => serial is F['Ҩserial'] {
   return (serial): serial is F['Ҩserial'] => {
      // not null
      if (serial == null) return false
      // serial should be an object
      if (typeof serial !== 'object') return false
      // without prototype
      if (Object.getPrototypeOf(serial) !== OBJECT_PROTO) return false
      // with a '$' string property
      if (serial.$ !== type) return false
      return true
   }
}
