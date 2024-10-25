import type { CovariantFn } from '../variance/BivariantHack'
import type { FieldTypes } from './$FieldTypes'
import type { BaseSchema } from './BaseSchema'
import type { Field } from './Field'
import type { FieldSerial_CommonProperties } from './FieldSerial'
import type { Repository } from './Repository'

// prettier-ignore
export type FieldConstructor<TYPES extends FieldTypes> =
    | FieldConstructor_ViaFunction<TYPES>
    | FieldConstructor_ViaClass<TYPES>

export type UNVALIDATED<T> = T | unknown

interface FieldConstructor_ViaFunction<out TYPES extends FieldTypes> {
   readonly type: TYPES['$Type']
   readonly emptySerial: TYPES['$Serial']
   readonly migrateSerial: SerialMigrationFunction<TYPES['$Serial']>
   codegenValueType(c: TYPES['$Config']): string
   build: CovariantFn<
      [
         //
         repo: Repository,
         root: Field | null,
         parent: Field | null,
         schema: BaseSchema<TYPES>,
         initialMountKey: string,
         serial?: UNVALIDATED<Maybe<TYPES['$Serial']>>,
      ],
      TYPES['$Field']
   >
}

export interface FieldConstructor_ViaClass<out TYPES extends FieldTypes> {
   readonly build: 'new'
   readonly type: TYPES['$Type']
   readonly emptySerial: TYPES['$Serial']
   readonly migrateSerial: SerialMigrationFunction<TYPES['$Serial']>
   codegenValueType(c: TYPES['$Config']): string
   new (
      // 💬 2024-08-20 rvion:
      // | 🔶 we can't use FIELD here, for variance reasons.
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: BaseSchema<any /* ❌ FIELD */>,
      initialMountKey: string,
      serial?: Maybe<any /* ❌ FIELD['$Serial'] */>,
   ): TYPES['$Field']
}

// export type UnsafeSerial<Serial extends FieldSerial_CommonProperties> = UNVALIDATED2<Serrial>

export type SerialMigrationFunction<Serial extends FieldSerial_CommonProperties> = //
   (serial: object) => void | Maybe<Serial>
//  (serial: unknown) => Maybe<Serial>
