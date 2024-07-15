import type { Field } from './Field'
import type { FieldConfig_CommonProperties } from './FieldConfig'
import type { FieldSerial_CommonProperties } from './FieldSerial'

/**
 * base widget type; default type-level param when we work with unknown widget
 * still allow to use SharedConfig properties, and SharedSerial properties
 */

export type $FieldTypes = {
    $Type: string
    $Config: FieldConfig_CommonProperties<any>
    $Serial: FieldSerial_CommonProperties
    $Value: any
    $Field: Field
}
