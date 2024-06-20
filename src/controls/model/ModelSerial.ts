import type { FieldSerial_CommonProperties } from './FieldSerial'

/** quick type alias used for unknown serial; for now, default to shared fields */
export type AnyWidgetSerial = FieldSerial_CommonProperties /* {} */

/** a form serial ready to be persisted somewhere */
export type ModelSerial = {
    type: 'FormSerial'
    uid: string
    name: string
    root: AnyWidgetSerial
    snapshot?: AnyWidgetSerial
    shared: Record<string, AnyWidgetSerial>
    valueLastUpdatedAt: Timestamp
    serialLastUpdatedAt: Timestamp
}
