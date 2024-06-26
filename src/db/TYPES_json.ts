import type { Status } from '../back/Status'
import type { ModelSerial } from '../csuite/model/ModelSerial'
import type { EmbeddingName } from '../models/ComfySchema'
import type { ImageInfos_ComfyGenerated } from '../models/ImageInfos_ComfyGenerated'
import type { ComfyNodeID, ComfyNodeMetadata } from '../types/ComfyNodeID'
import type { ComfyPromptJSON } from '../types/ComfyPrompt'
import type { ComfySchemaJSON } from '../types/ComfySchemaJSON'
import type { WsMsgExecutionError } from '../types/ComfyWsApi'
import type { SqlColDef } from './_getAllColumnsForTable'
import type { BaseInstanceFields } from './LiveInstance'
import type { KyselyTables } from './TYPES.gen'
import type { Metafile } from 'esbuild'

import { TObject, TSchema, Type } from '@sinclair/typebox'

export type StatusT = keyof typeof Status
// export type JSONColumnType< =
export const Nullable = <T extends TSchema>(schema: T) => Type.Union([schema, Type.Null(), Type.Undefined()])

export type CushyScript_metafile = Metafile
// export type CushyScript_metafile = {
//     inputs: { [relPath: string]: { bytes: number /* incomplete types */ } }
//     outputs: any
// }
export const CushyScript_metafile_Schema = Type.Record(Type.String(), Type.Any())

export type MediaCustom_params = Record<string, any>
export const MediaCustom_params_Schema = Type.Record(Type.String(), Type.Any())

export type ComfyWorkflow_metadata = { [key: ComfyNodeID]: ComfyNodeMetadata }
export const ComfyWorkflow_metadata_Schema = Type.Record(Type.String(), Type.Any())

export type ComfyWorkflow_comfyPromptJSON = ComfyPromptJSON
export const ComfyWorkflow_comfyPromptJSON_Schema = Type.Record(Type.String(), Type.Any())

/** media scenes can store any short metadata needed to reconstruct the scene */
export type Media3dScene_params = Record<string, any>
export const Media3dScene_params_Schema = Type.Record(Type.String(), Type.Any())

export type Draft_formSerial = ModelSerial
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

export class TableInfo<
    //
    TableName extends keyof KyselyTables = any,
    T extends BaseInstanceFields = BaseInstanceFields,
    L = any,
    N = any,
    U = any,
    ID = any,
> {
    $TableName!: TableName
    $T!: T
    $L!: L
    $N!: N
    $Update!: U
    $ID!: ID

    cols: SqlColDef[]
    // insertSQL: string
    constructor(
        //
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
        if (data == null) debugger
        for (const col of this.cols) {
            if (col.type !== 'json') continue
            const rawCol = data[col.name]
            if (rawCol == null) continue
            data[col.name] = JSON.parse(rawCol)
        }
        return data
    }

    hydrateJSONFields_crashOnMissingData = (data: any): T => {
        if (data == null) debugger
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
            } catch (e) {
                console.log(`[🔴] ERROR parsing field ${col.name} of table ${this.sql_name}`)
                throw e
            }
            // -----------------------------------------------------------------------
        }
        return data
    }
}
