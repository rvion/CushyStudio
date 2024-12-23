import type { AnyFieldSerial } from '../model/EntitySerial'
import type { Field } from '../model/Field'

/**
 * data-structure that preserve invalid serial
 * so they can be migrated over later, preventing data loss
 *
 * Anomalies are scoped to a specific field, usually the document root.
 *
 * 🔶 it's important to hoist anomalies to the root field so they are not lost/nested.
 */
export type FieldAnomaly = {
   type: 'invalid-serial'
   date: Timestamp
   path: string
   pathExt: string
   got: AnyFieldSerial
}

export type BoundAnomaly = {
   document: Field
   anomaly: FieldAnomaly
}
