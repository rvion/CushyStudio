import type { SharedWidgetSerial } from './IWidget'

/** quick type alias used for unknown serial; for now, default to shared fields */
export type AnyWidgetSerial = SharedWidgetSerial /* {} */

/** a form serial ready to be persisted somewhere */
export type FormSerial = {
    type: 'FormSerial'
    name: string
    root: AnyWidgetSerial
    shared: Record<string, AnyWidgetSerial>
    valueLastUpdatedAt: Timestamp
    serialLastUpdatedAt: Timestamp
}
