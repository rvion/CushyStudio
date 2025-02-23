import type { CSchema } from './CSchema'
import type { Field } from './Field'
import type { FieldSerial_CommonProperties } from './FieldSerial'
import type { Repository } from './Repository'

export type UNVALIDATED<T> = T | unknown
export type FieldConstructor<FIELD extends Field> = {
   // ⏸️ readonly build: 'new'
   readonly type: FIELD['$type']
   readonly emptySerial: FIELD['$serial']
   readonly migrateSerial: SerialMigrationFunction<FIELD['$serial']>
   codeForTypescriptValue(config: FIELD['$config'], codegenOpts: CodegenOpts): string
   getChildren(config: FIELD['$config']): { [childSchemaKey: string]: CSchema }
   getChild(config: FIELD['$config'], key: string): Maybe<CSchema>
   new (
      // 💬 2024-08-20 rvion:
      // | 🔶 we can't use FIELD here, for variance reasons.
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<any /* ❌ FIELD */>,
      initialMountKey: string,
      serial?: Maybe<any /* ❌ FIELD['$serial'] */>,
   ): FIELD
}

export type SerialMigrationFunction<Serial extends FieldSerial_CommonProperties> = //
   (serial: object) => void | Maybe<Serial>

export type CodegenOpts = {
   indent?: number
   tab: string
}
