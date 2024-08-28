import type { CovariantFn } from '../variance/BivariantHack'
import type { BaseSchema } from './BaseSchema'
import type { Field } from './Field'
import type { FieldSerial } from './FieldSerial'
import type { Repository } from './Repository'

// prettier-ignore
export type FieldConstructor<FIELD extends Field> =
    | FieldConstructor_ViaFunction<FIELD>
    | FieldConstructor_ViaClass<FIELD>

type FieldConstructor_ViaFunction<out FIELD extends Field> = {
    type: FIELD['$Type']
    readonly migrateSerial: (serial: FieldSerial<unknown>) => FIELD['$Serial'] | null
    build: CovariantFn<
        [
            //
            repo: Repository,
            root: Field | null,
            parent: Field | null,
            schema: BaseSchema<FIELD>,
            serial?: Maybe<FIELD['$Serial']>,
        ],
        FIELD
    >
}
type FieldConstructor_ViaClass<out FIELD extends Field> = {
    readonly build: 'new'
    readonly type: FIELD['$Type']
    readonly migrateSerial: (serial: FieldSerial<unknown>) => FIELD['$Serial'] | null
    new (
        // 💬 2024-08-20 rvion:
        // | 🔶 we can't use FIELD here, for variance reasons.
        repo: Repository,
        root: Field | null,
        parent: Field | null,
        schema: BaseSchema<any /* ❌ FIELD */>,
        serial?: Maybe<any /* ❌ FIELD['$Serial'] */>,
    ): FIELD
}
