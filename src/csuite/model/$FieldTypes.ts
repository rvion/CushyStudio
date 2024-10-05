import type { Field } from './Field'
import type { FieldConfig_CommonProperties } from './FieldConfig'
import type { FieldSerial_CommonProperties } from './FieldSerial'

/**
 * 💬 2024-08-22 rvion: rewrite the crappy description below so it makes actual sense
 * | > base field types;
 * | > default type-level param when we work with unknown widget
 * | > still allow to use SharedConfig properties, and SharedSerial properties
 */
export type $FieldTypes = {
    $Type: CATALOG.AllFieldTypes
    $Config: FieldConfig_CommonProperties<any>
    $Serial: FieldSerial_CommonProperties
    $Field: Field // 💡 <$FieldTypes_ANY>
    $Value: any
    $Unchecked: any
    $Child: $FieldTypes | never
}

// 💬 2024-09-27 rvion:
// | not quite sure what it would achieve, but we could manually unroll it a few time providing any
// | on the 2nd or third recursion; might help with some variance check... maybe.

// export type $FieldTypes_ANY = {
//     $Type: CATALOG.AllFieldTypes
//     $Config: FieldConfig_CommonProperties<any>
//     $Serial: FieldSerial_CommonProperties
//     $Field: Field<any>
//     $Value: any
//     $Unchecked: any
//     $Child: $FieldTypes | never
// }
