import type { SqlColDef } from './_getAllColumnsForTable'
import type { Metafile } from 'esbuild'
import type { Status } from 'src/back/Status'
import type { Widget_group_serial } from 'src/controls/widgets/group/WidgetGroup'
import type { ImageInfos_ComfyGenerated } from 'src/models/ImageInfos_ComfyGenerated'
import type { EmbeddingName } from 'src/models/Schema'
import type { ComfyNodeID, ComfyNodeMetadata } from 'src/types/ComfyNodeID'
import type { ComfyPromptJSON } from 'src/types/ComfyPrompt'
import type { ComfySchemaJSON } from 'src/types/ComfySchemaJSON'
import type { WsMsgExecutionError } from 'src/types/ComfyWsApi'

import { TObject, TSchema, Type } from '@sinclair/typebox'

export type StatusT = keyof typeof Status

export const Nullable = <T extends TSchema>(schema: T) => Type.Union([schema, Type.Null(), Type.Undefined()])

export type CushyScript_metafile = Metafile
// export type CushyScript_metafile = {
//     inputs: { [relPath: string]: { bytes: number /* incomplete types */ } }
//     outputs: any
// }
export const CushyScript_metafile_Schema = Type.Record(Type.String(), Type.Any())

export type Graph_metadata = { [key: ComfyNodeID]: ComfyNodeMetadata }
export const Graph_metadata_Schema = Type.Record(Type.String(), Type.Any())

export type Graph_comfyPromptJSON = ComfyPromptJSON
export const Graph_comfyPromptJSON_Schema = Type.Record(Type.String(), Type.Any())

export type Draft_formSerial = Widget_group_serial<any>
export const Draft_formSerial_Schema = Type.Record(Type.String(), Type.Any())

export type CustomData_json = any
export const CustomData_json_Schema = Type.Any()

export type Step_formResult = Maybe<any>
export const Step_formResult_Schema = Type.Record(Type.String(), Type.Any())

export type Step_formSerial = Maybe<any>
export const Step_formSerial_Schema = Type.Record(Type.String(), Type.Any())

export type ComfyPrompt_error = Maybe<WsMsgExecutionError>
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

export class TableInfo<T = any> {
    cols: SqlColDef[]
    // insertSQL: string
    constructor(
        //
        public sql_name: string,
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

    hydrateJSONFields = (data: any): T => {
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
            // when value is present
            data[col.name] = JSON.parse(rawCol)
        }
        return data
    }
}
