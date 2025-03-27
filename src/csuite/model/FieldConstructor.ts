import type { CSchema } from './CSchema'
import type { Field } from './Field'
import type { FieldSerial_CommonProperties } from './FieldSerial'
import type { Repository } from './Repository'

export type SchemaWithSerialPath = {
   schema: CSchema
   serialPath: string | null
}
export type SchemaDictWithPaths = Record<string, SchemaWithSerialPath>

export type TravelEdge = Tagged<string, 'TravelKey'>
export type UNVALIDATED<T> = T | unknown
export type FieldConstructor<FIELD extends Field> = {
   readonly type: FIELD['ҨType']
   readonly migrateSerial: SerialMigrationFunction<FIELD['ҨSerial']>

   /** various codegen utilities */
   codeForTypescriptValue(config: FIELD['ҨConfig'], codegenOpts: CodegenOpts): string

   /**
    * regular traversal (for real "chilcren"; i.e. sub schemas from the config that will
    * most probably be instanciated as child when instanciating the field
    */
   getChildren(config: FIELD['ҨConfig']): SchemaDictWithPaths

   /** extra traversal you may want to implement following very specific rules */
   getTravels(config: FIELD['ҨConfig']): SchemaDictWithPaths

   readonly patchedSerialPaths: readonly string[]

   generateSerial(value: Maybe<FIELD['ҨValue']>, config: FIELD['ҨConfig']): FIELD['ҨSerial']

   new (
      // 💬 2024-08-20 rvion:
      // | 🔶 we can't use FIELD here, for variance reasons.
      repo: Repository,
      root: Field | null,
      parent: Field | null,
      schema: CSchema<any /* ❌ FIELD */>,
      initialMountKey: string,
      serial?: Maybe<any /* ❌ FIELD['ҨSerial'] */>,
   ): FIELD
}

export type SerialMigrationFunction<Serial extends FieldSerial_CommonProperties> = //
   (serial: object) => void | Maybe<Serial>

export type CodegenOpts = {
   indent?: number
   tab: string
}
