import type { WidgetSerial_CommonProperties } from './WidgetSerialFields'

/** quick type alias used for unknown serial; for now, default to shared fields */
export type AnyWidgetSerial = WidgetSerial_CommonProperties /* {} */

/** a form serial ready to be persisted somewhere */
export type FormSerial = {
    type: 'FormSerial'
    name: string
    root: AnyWidgetSerial
    shared: Record<string, AnyWidgetSerial>
    valueLastUpdatedAt: Timestamp
    serialLastUpdatedAt: Timestamp
}
