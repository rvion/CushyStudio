import type { CovariantFn } from '../variance/BivariantHack'
import type { BaseSchema } from './BaseSchema'
import type { Field } from './Field'
import type { FieldSerial_CommonProperties } from './FieldSerial'
import type { Repository } from './Repository'

// prettier-ignore
export type FieldConstructor<FIELD extends Field> =
    | FieldConstructor_ViaFunction<FIELD>
    | FieldConstructor_ViaClass<FIELD>

export type UNVALIDATED<T> = T | unknown

export type FieldConstructor_ViaFunction<out FIELD extends Field> = {
    type: FIELD['$Type']
    readonly emptySerial: FIELD['$Serial']
    readonly migrateSerial: SerialMigrationFunction<FIELD['$Serial']>
    build: CovariantFn<
        [
            //
            repo: Repository,
            root: Field | null,
            parent: Field | null,
            schema: BaseSchema<FIELD>,
            initialMountKey: string,
            serial?: UNVALIDATED<Maybe<FIELD['$Serial']>>,
        ],
        FIELD
    >
}

export type FieldConstructor_ViaClass<out FIELD extends Field> = {
    readonly build: 'new'
    readonly type: FIELD['$Type']
    readonly emptySerial: FIELD['$Serial']
    readonly migrateSerial: SerialMigrationFunction<FIELD['$Serial']>
    new (
        // 💬 2024-08-20 rvion:
        // | 🔶 we can't use FIELD here, for variance reasons.
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<any /* ❌ FIELD */>,
        initialMountKey: string,
        serial?: Maybe<any /* ❌ FIELD['$Serial'] */>,
    ): FIELD
}

// export type UnsafeSerial<Serial extends FieldSerial_CommonProperties> = UNVALIDATED2<Serrial>

export type SerialMigrationFunction<Serial extends FieldSerial_CommonProperties> = //
    (serial: object) => void | Maybe<Serial>
//  (serial: unknown) => Maybe<Serial>
