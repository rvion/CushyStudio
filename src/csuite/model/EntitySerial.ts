import type { FieldSerial_CommonProperties } from './FieldSerial'

import { EntityId } from './EntityId'

/** quick type alias used for unknown serial; for now, default to shared fields */
export type AnyFieldSerial = FieldSerial_CommonProperties

/** a form serial ready to be persisted somewhere */
export type EntitySerial = {
    /**
     * practical to know what kind of json we're dealing with
     * when viewed from some other software.
     */
    type: 'FormSerial'

    /** unique entity serial */
    uid: EntityId

    /** live value */
    root: AnyFieldSerial

    /** last saved value in case you want a simple way to revert your models */
    snapshot?: AnyFieldSerial

    /** timestamp of last value update */
    valueLastUpdatedAt?: Timestamp

    /** timestamp of last serial update */
    serialLastUpdatedAt?: Timestamp

    /** timestamp of last snapshot update */
    snapshotLastUpdatedAt?: Timestamp

    /** unused internally, here so you can add whatever you want inside */
    custom?: any
}