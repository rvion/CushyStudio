import type { Status } from '../back/Status'
import type { ComfyUIAPIRequest } from '../comfyui/comfyui-prompt-api'
import type { EmbeddingName } from '../comfyui/comfyui-types'
import type { AnyFieldSerial } from '../csuite/model/EntitySerial'
import type { ImageInfos_ComfyGenerated } from '../models/ImageInfos_ComfyGenerated'
import type { SafetyResult } from '../safety/Safety'
import type { ComfyNodeID, ComfyNodeMetadata } from '../types/ComfyNodeID'
import type { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import type { WsMsgExecutionError } from '../types/ComfyWsApi'
import type { SqlColDef } from './_getAllColumnsForTable'
import type { BaseInstanceFields } from './LiveInstance'
import type { KyselyTables } from './TYPES.gen'
import type { TNull, TObject, TSchema, TUndefined, TUnion } from '@sinclair/typebox'
import type { Metafile } from 'esbuild'
import type { IJsonModel } from 'flexlayout-react'

import { Type } from '@sinclair/typebox'

export type StatusT = keyof typeof Status
// export type JSONColumnType< =
export const Nullable = <T extends TSchema>(schema: T): TUnion<[T, TNull, TUndefined]> =>
   Type.Union([schema, Type.Null(), Type.Undefined()])

// #region CushyApp
export type CushyScript_metafile = Metafile
// export type CushyScript_metafile = {
//     inputs: { [relPath: string]: { bytes: number /* incomplete types */ } }
//     outputs: any
// }
export const CushyScript_metafile_Schema = Type.Record(Type.String(), Type.Any())

// #region Perspective
export type Perspective_layout = IJsonModel
export const Perspective_layout_Schema = Type.Record(Type.String(), Type.Any())

export type Perspective_layoutDefault = IJsonModel
export const Perspective_layoutDefault_Schema = Type.Record(Type.String(), Type.Any())

// #region MediaCustom
export type MediaCustom_params = Record<string, any>
export const MediaCustom_params_Schema = Type.Record(Type.String(), Type.Any())

// #region MediaImage
export type MediaImage_safetyRating = SafetyResult
export const MediaImage_safetyRating_Schema = Type.Record(Type.String(), Type.Any())

// #region ComfyWorkflow
export type ComfyWorkflow_metadata = { [key: ComfyNodeID]: ComfyNodeMetadata }
export const ComfyWorkflow_metadata_Schema = Type.Record(Type.String(), Type.Any())

export type ComfyWorkflow_comfyPromptJSON = ComfyUIAPIRequest
export const ComfyWorkflow_comfyPromptJSON_Schema = Type.Record(Type.String(), Type.Any())

// #region Media3dScene
/** media scenes can store any short metadata needed to reconstruct the scene */
export type Media3dScene_params = Record<string, any>
export const Media3dScene_params_Schema = Type.Record(Type.String(), Type.Any())

// #region Draft
export type Draft_formSerial = AnyFieldSerial
export const Draft_formSerial_Schema = Type.Record(Type.String(), Type.Any())

export type CustomData_json = any
export const CustomData_json_Schema = Type.Any()

export type Step_formResult = Maybe<any>
export const Step_formResult_Schema = Type.Record(Type.String(), Type.Any())

export type Step_formSerial = Maybe<any>
export const Step_formSerial_Schema = Type.Record(Type.String(), Type.Any())

export type ComfyPrompt_error = WsMsgExecutionError
export const ComfyPrompt_error_Schema = Type.Record(Type.String(), Type.Any())

export type ComfySchema_spec = ComfySchemaJSON
export const ComfySchema_spec_Schema = Type.Record(Type.String(), Type.Any())

export type ComfySchema_embeddings = EmbeddingName[]
export const ComfySchema_embeddings_Schema = Type.Array(Type.String())

export type MediaImage_comfyUIInfos = ImageInfos_ComfyGenerated
export const MediaImage_comfyUIInfos_Schema = Type.Record(Type.String(), Type.Any())

export type RuntimeError_infos = { [key: string]: any }
export const RuntimeError_infos_Schema = Type.Record(Type.String(), Type.Any())

export type DBRef = { fromTable: string; fromField: string; toTable: string; tofield: string }

// export type TableTypes = {
//     TableName: string
//     JSName: string
//     Read: object
//     Instance: BaseInst<TableTypes>
//     Create: object
//     Update: object
//     ID: string
//     Delete: Record<string, TableTypes>
// }

export type DeleteInstructionsFor<B> = {
   [backref in keyof B]: 'set null' | 'cascade' | DeleteInstructionsFor<B[backref]> //
}

export class TableInfo<
   /** table name const-expr */
   TableName extends keyof KyselyTables = any,
   /* data you get when you select */
   T extends BaseInstanceFields = BaseInstanceFields,
   /* live entity class (wrapper around T) */
   L = any,
   /* data required for create */
   N = any,
   /* data required for update */
   U = any,
   /* data unique identifier */
   ID = any,
   /* BackRefsToHandleOnDelete */
   B extends object = any,
> {
   $TableName!: TableName
   $T!: T
   $L!: L
   $N!: N
   $B!: B
   $Update!: U
   $ID!: ID
   $DeleteInstructions!: DeleteInstructionsFor<B>

   cols: SqlColDef[]
   // insertSQL: string
   constructor(
      public sql_name: TableName,
      public ts_name: string,
      public fields: { [fieldName: string]: SqlColDef },
      public schema: TObject<any>,
      public refs: DBRef[],
      public backrefs: DBRef[],
   ) {
      this.cols = Object.values(fields)
      // this.insertSQL = [
      //     `insert into ${this.sql_name}`,
      //     `(${this.cols.map((c) => c.name).join(', ')})`,
      //     `values`,
      //     `(${this.cols.map((c) => `@${c.name}`).join(', ')})`,
      // ].join(' ')
   }

   // TODO: use
   hydrateJSONFields_skipMissingData = (data: any): T => {
      // if (data == null) debugger
      for (const col of this.cols) {
         if (col.type !== 'json') continue
         const rawCol = data[col.name]
         if (rawCol == null) continue
         stats[`${this.sql_name}.${col.name}`] = (stats[col.name] || 0) + 1
         data[col.name] = JSON.parse(rawCol)
      }
      return data
   }

   hydrateJSONFields_crashOnMissingData = (data: any): T => {
      // if (data == null) debugger
      for (const col of this.cols) {
         if (col.type !== 'json') continue
         const rawCol = data[col.name]
         // when value is null
         if (rawCol == null) {
            if (col.notnull) throw new Error(`json column ${col.name} is null`)
            data[col.name] = null
            continue
         }
         // 2024-06-26 ------------------------------------------------------------
         try {
            // when value is present
            data[col.name] = JSON.parse(rawCol)
            stats[`${this.sql_name}.${col.name}`] = (stats[col.name] || 0) + 1
         } catch (e) {
            console.log(`[🔴] ERROR parsing field ${col.name} of table ${this.sql_name}`)
            throw e
         }
         // -----------------------------------------------------------------------
      }
      return data
   }
}

const stats: any = {}

// setInterval(() => {
//     console.table(stats)
// }, 2000)
