import type { BaseField } from './BaseField'
import type { WidgetConfig_CommonProperties } from './WidgetConfig'
import type { WidgetSerial_CommonProperties } from './WidgetSerialFields'

/**
 * base widget type; default type-level param when we work with unknown widget
 * still allow to use SharedConfig properties, and SharedSerial properties
 * */

export type $FieldTypes = {
    $Type: string
    $Config: WidgetConfig_CommonProperties<any>
    $Serial: WidgetSerial_CommonProperties
    $Value: any
    $Widget: BaseField
}
