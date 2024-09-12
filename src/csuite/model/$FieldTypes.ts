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
    $Type: string
    $Config: FieldConfig_CommonProperties<any>
    $Serial: FieldSerial_CommonProperties
    $Field: Field
    $Value: any
    $Unchecked: any
}

export type $FieldTypes_Nullable = $FieldTypes & {
    $Config: FieldConfig_CommonProperties<any> & { nullable?: boolean }
}
