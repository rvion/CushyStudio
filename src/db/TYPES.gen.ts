import type { AuthL } from '../models/Auth'
import type { ComfyPromptL } from '../models/ComfyPrompt'
import type { ComfySchemaL } from '../models/ComfySchema'
import type { ComfyWorkflowL } from '../models/ComfyWorkflow'
import type { CushyAppL } from '../models/CushyApp'
import type { CushyScriptL } from '../models/CushyScript'
import type { CustomDataL } from '../models/CustomData'
import type { DraftL } from '../models/Draft'
import type { HostL } from '../models/Host'
import type { Media3dDisplacementL } from '../models/Media3dDisplacement'
import type { MediaCustomL } from '../models/MediaCustom'
import type { MediaImageL } from '../models/MediaImage'
import type { MediaSplatL } from '../models/MediaSplat'
import type { MediaTextL } from '../models/MediaText'
import type { MediaVideoL } from '../models/MediaVideo'
import type { PerspectiveL } from '../models/Perspective'
import type { ProjectL } from '../models/Project'
import type { RuntimeErrorL } from '../models/RuntimeError'
import type { StepL } from '../models/Step'
import type { TreeEntryL } from '../models/TreeEntry'
import type { Generated } from 'kysely'

import { Type } from '@sinclair/typebox'

import * as T from './TYPES_json'

// #region ComfyWorkflow

export const asComfyWorkflowID = (s: string): ComfyWorkflowID => s as any

export type ComfyWorkflowTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<ComfyWorkflowID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: json */
   comfyPromptJSON: T.ComfyWorkflow_comfyPromptJSON
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: "'{}'", sqlType: json */
   metadata: Generated<T.ComfyWorkflow_metadata>
}

export type NewComfyWorkflow = {
   id?: ComfyWorkflowID
   comfyPromptJSON?: T.ComfyWorkflow_comfyPromptJSON
   stepID?: Maybe<StepID>
   metadata?: T.ComfyWorkflow_metadata
}

export type ComfyWorkflowUpdate = {
   id?: never // ComfyWorkflowID
   createdAt?: number
   updatedAt?: number
   comfyPromptJSON?: T.ComfyWorkflow_comfyPromptJSON
   stepID?: StepID | null
   metadata?: T.ComfyWorkflow_metadata
}

export type ComfyWorkflowBackRefsToHandleOnDelete = {
   project_rootGraphID: ProjectBackRefsToHandleOnDelete
   step_outputGraphID: StepBackRefsToHandleOnDelete
   comfy_prompt_graphID: ComfyPromptBackRefsToHandleOnDelete
   runtime_error_graphID?: RuntimeErrorBackRefsToHandleOnDelete | 'set null'
}

export type ComfyWorkflowT = {
   id: ComfyWorkflowID
   createdAt: number
   updatedAt: number
   comfyPromptJSON: T.ComfyWorkflow_comfyPromptJSON
   stepID?: StepID | null
   metadata: T.ComfyWorkflow_metadata
}

export type ComfyWorkflowTypes = {
   TableName: 'comfy_workflow'
   JSName: 'ComfyWorkflow'
   Read: ComfyWorkflowT
   Instance: ComfyWorkflowL
   Create: NewComfyWorkflow
   Update: ComfyWorkflowUpdate
   ID: ComfyWorkflowID
   Delete: ComfyWorkflowBackRefsToHandleOnDelete
}

export const ComfyWorkflowSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      comfyPromptJSON: T.ComfyWorkflow_comfyPromptJSON_Schema,
      stepID: Type.Optional(T.Nullable(Type.String())),
      metadata: T.ComfyWorkflow_metadata_Schema,
   },
   { additionalProperties: false },
)

// prettier-ignore
export const ComfyWorkflowRefs = [
    { fromTable:'comfy_workflow', fromField:'stepID', toTable:'step', tofield:'id' }
]

// prettier-ignore
export const ComfyWorkflowBackRefs = [
    { fromTable:'project', fromField:'rootGraphID', toTable:'comfy_workflow', tofield:'id' },
    { fromTable:'step', fromField:'outputGraphID', toTable:'comfy_workflow', tofield:'id' },
    { fromTable:'comfy_prompt', fromField:'graphID', toTable:'comfy_workflow', tofield:'id' },
    { fromTable:'runtime_error', fromField:'graphID', toTable:'comfy_workflow', tofield:'id' }
]

export const ComfyWorkflowFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   comfyPromptJSON: { cid: 3, name: 'comfyPromptJSON', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   stepID: { cid: 4, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   metadata: { cid: 5, name: 'metadata', type: 'json', notnull: 1, dflt_value: "'{}'", pk: 0 },
}

// #region Draft

export const asDraftID = (s: string): DraftID => s as any

export type DraftTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<DraftID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   title?: Maybe<string>
   /** @default: null, sqlType: json */
   formSerial: T.Draft_formSerial
   /** @default: null, sqlType: TEXT */
   appID: CushyAppID
   /** @default: null, sqlType: TEXT */
   illustration?: Maybe<string>
   /** @default: "0", sqlType: INT */
   isFavorite: Generated<number>
   /** @default: null, sqlType: INT */
   lastRunAt?: Maybe<number>
   /** @default: null, sqlType: TEXT */
   canvasToolCategory?: Maybe<string>
}

export type NewDraft = {
   id?: DraftID
   title?: Maybe<string>
   formSerial?: T.Draft_formSerial
   appID?: CushyAppID
   illustration?: Maybe<string>
   isFavorite?: number
   lastRunAt?: Maybe<number>
   canvasToolCategory?: Maybe<string>
}

export type DraftUpdate = {
   id?: never // DraftID
   createdAt?: number
   updatedAt?: number
   title?: string | null
   formSerial?: T.Draft_formSerial
   appID?: CushyAppID
   illustration?: string | null
   isFavorite?: number
   lastRunAt?: number | null
   canvasToolCategory?: string | null
}

export type DraftBackRefsToHandleOnDelete = {
   project_currentDraftID?: ProjectBackRefsToHandleOnDelete | 'set null'
   step_draftID?: StepBackRefsToHandleOnDelete | 'set null'
}

export type DraftT = {
   id: DraftID
   createdAt: number
   updatedAt: number
   title?: string | null
   formSerial: T.Draft_formSerial
   appID: CushyAppID
   illustration?: string | null
   isFavorite: number
   lastRunAt?: number | null
   canvasToolCategory?: string | null
}

export type DraftTypes = {
   TableName: 'draft'
   JSName: 'Draft'
   Read: DraftT
   Instance: DraftL
   Create: NewDraft
   Update: DraftUpdate
   ID: DraftID
   Delete: DraftBackRefsToHandleOnDelete
}

export const DraftSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      title: Type.Optional(T.Nullable(Type.String())),
      formSerial: T.Draft_formSerial_Schema,
      appID: Type.String(),
      illustration: Type.Optional(T.Nullable(Type.String())),
      isFavorite: Type.Number(),
      lastRunAt: Type.Optional(T.Nullable(Type.Number())),
      canvasToolCategory: Type.Optional(T.Nullable(Type.String())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const DraftRefs = [
    { fromTable:'draft', fromField:'appID', toTable:'cushy_app', tofield:'id' }
]

// prettier-ignore
export const DraftBackRefs = [
    { fromTable:'project', fromField:'currentDraftID', toTable:'draft', tofield:'id' },
    { fromTable:'step', fromField:'draftID', toTable:'draft', tofield:'id' }
]

export const DraftFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   title: { cid: 3, name: 'title', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   formSerial: { cid: 4, name: 'formSerial', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   appID: { cid: 5, name: 'appID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   illustration: { cid: 6, name: 'illustration', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   isFavorite: { cid: 7, name: 'isFavorite', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   lastRunAt: { cid: 8, name: 'lastRunAt', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   canvasToolCategory: {
      cid: 9,
      name: 'canvasToolCategory',
      type: 'TEXT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
}

// #region Project

export const asProjectID = (s: string): ProjectID => s as any

export type ProjectTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<ProjectID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   name?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   rootGraphID: ComfyWorkflowID
   /** @default: null, sqlType: TEXT */
   currentApp?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   currentDraftID?: Maybe<DraftID>
   /** @default: "0", sqlType: INT */
   filterNSFW: Generated<number>
   /** @default: "0", sqlType: INT */
   autostartDelay: Generated<number>
   /** @default: "100", sqlType: INT */
   autostartMaxDelay: Generated<number>
}

export type NewProject = {
   id?: ProjectID
   name?: Maybe<string>
   rootGraphID?: ComfyWorkflowID
   currentApp?: Maybe<string>
   currentDraftID?: Maybe<DraftID>
   filterNSFW?: number
   autostartDelay?: number
   autostartMaxDelay?: number
}

export type ProjectUpdate = {
   id?: never // ProjectID
   createdAt?: number
   updatedAt?: number
   name?: string | null
   rootGraphID?: ComfyWorkflowID
   currentApp?: string | null
   currentDraftID?: DraftID | null
   filterNSFW?: number
   autostartDelay?: number
   autostartMaxDelay?: number
}

export type ProjectBackRefsToHandleOnDelete = EmptyObject

export type ProjectT = {
   id: ProjectID
   createdAt: number
   updatedAt: number
   name?: string | null
   rootGraphID: ComfyWorkflowID
   currentApp?: string | null
   currentDraftID?: DraftID | null
   filterNSFW: number
   autostartDelay: number
   autostartMaxDelay: number
}

export type ProjectTypes = {
   TableName: 'project'
   JSName: 'Project'
   Read: ProjectT
   Instance: ProjectL
   Create: NewProject
   Update: ProjectUpdate
   ID: ProjectID
   Delete: ProjectBackRefsToHandleOnDelete
}

export const ProjectSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      name: Type.Optional(T.Nullable(Type.String())),
      rootGraphID: Type.String(),
      currentApp: Type.Optional(T.Nullable(Type.String())),
      currentDraftID: Type.Optional(T.Nullable(Type.String())),
      filterNSFW: Type.Number(),
      autostartDelay: Type.Number(),
      autostartMaxDelay: Type.Number(),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const ProjectRefs = [
    { fromTable:'project', fromField:'currentDraftID', toTable:'draft', tofield:'id' },
    { fromTable:'project', fromField:'rootGraphID', toTable:'comfy_workflow', tofield:'id' }
]

export const ProjectBackRefs = []

export const ProjectFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   name: { cid: 3, name: 'name', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   rootGraphID: { cid: 4, name: 'rootGraphID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   currentApp: { cid: 5, name: 'currentApp', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   currentDraftID: { cid: 6, name: 'currentDraftID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   filterNSFW: { cid: 7, name: 'filterNSFW', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   autostartDelay: { cid: 8, name: 'autostartDelay', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   autostartMaxDelay: {
      cid: 9,
      name: 'autostartMaxDelay',
      type: 'INT',
      notnull: 1,
      dflt_value: '100',
      pk: 0,
   },
}

// #region Step

export const asStepID = (s: string): StepID => s as any

export type StepTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<StepID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   name?: Maybe<string>
   /** @default: null, sqlType: json */
   formSerial: T.Step_formSerial
   /** @default: null, sqlType: TEXT */
   outputGraphID: ComfyWorkflowID
   /** @default: null, sqlType: TEXT */
   status: T.StatusT
   /** @default: "1", sqlType: INT */
   isExpanded: Generated<number>
   /** @default: null, sqlType: TEXT */
   appID: CushyAppID
   /** @default: null, sqlType: TEXT */
   draftID?: Maybe<DraftID>
}

export type NewStep = {
   id?: StepID
   name?: Maybe<string>
   formSerial?: T.Step_formSerial
   outputGraphID?: ComfyWorkflowID
   status?: T.StatusT
   isExpanded?: number
   appID?: CushyAppID
   draftID?: Maybe<DraftID>
}

export type StepUpdate = {
   id?: never // StepID
   createdAt?: number
   updatedAt?: number
   name?: string | null
   formSerial?: T.Step_formSerial
   outputGraphID?: ComfyWorkflowID
   status?: T.StatusT
   isExpanded?: number
   appID?: CushyAppID
   draftID?: DraftID | null
}

export type StepBackRefsToHandleOnDelete = {
   comfy_workflow_stepID?: ComfyWorkflowBackRefsToHandleOnDelete | 'set null'
   comfy_prompt_stepID: ComfyPromptBackRefsToHandleOnDelete
   media_text_stepID?: MediaTextBackRefsToHandleOnDelete | 'set null'
   media_video_stepID?: MediaVideoBackRefsToHandleOnDelete | 'set null'
   media_image_stepID?: MediaImageBackRefsToHandleOnDelete | 'set null'
   media_3d_displacement_stepID?: Media3dDisplacementBackRefsToHandleOnDelete | 'set null'
   runtime_error_stepID?: RuntimeErrorBackRefsToHandleOnDelete | 'set null'
   media_splat_stepID?: MediaSplatBackRefsToHandleOnDelete | 'set null'
   media_custom_stepID?: MediaCustomBackRefsToHandleOnDelete | 'set null'
}

export type StepT = {
   id: StepID
   createdAt: number
   updatedAt: number
   name?: string | null
   formSerial: T.Step_formSerial
   outputGraphID: ComfyWorkflowID
   status: T.StatusT
   isExpanded: number
   appID: CushyAppID
   draftID?: DraftID | null
}

export type StepTypes = {
   TableName: 'step'
   JSName: 'Step'
   Read: StepT
   Instance: StepL
   Create: NewStep
   Update: StepUpdate
   ID: StepID
   Delete: StepBackRefsToHandleOnDelete
}

export const StepSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      name: Type.Optional(T.Nullable(Type.String())),
      formSerial: T.Step_formSerial_Schema,
      outputGraphID: Type.String(),
      status: Type.String(),
      isExpanded: Type.Number(),
      appID: Type.String(),
      draftID: Type.Optional(T.Nullable(Type.String())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const StepRefs = [
    { fromTable:'step', fromField:'draftID', toTable:'draft', tofield:'id' },
    { fromTable:'step', fromField:'appID', toTable:'cushy_app', tofield:'id' },
    { fromTable:'step', fromField:'outputGraphID', toTable:'comfy_workflow', tofield:'id' }
]

// prettier-ignore
export const StepBackRefs = [
    { fromTable:'comfy_workflow', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'comfy_prompt', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_text', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_video', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_image', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_3d_displacement', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'runtime_error', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_splat', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_custom', fromField:'stepID', toTable:'step', tofield:'id' }
]

export const StepFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   name: { cid: 3, name: 'name', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   formSerial: { cid: 4, name: 'formSerial', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   outputGraphID: { cid: 5, name: 'outputGraphID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   status: { cid: 6, name: 'status', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   isExpanded: { cid: 7, name: 'isExpanded', type: 'INT', notnull: 1, dflt_value: '1', pk: 0 },
   appID: { cid: 8, name: 'appID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   draftID: { cid: 9, name: 'draftID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region ComfyPrompt

export const asComfyPromptID = (s: string): ComfyPromptID => s as any

export type ComfyPromptTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<ComfyPromptID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   stepID: StepID
   /** @default: null, sqlType: TEXT */
   graphID: ComfyWorkflowID
   /** @default: "0", sqlType: INT */
   executed: Generated<number>
   /** @default: null, sqlType: json */
   error?: Maybe<T.ComfyPrompt_error>
   /** @default: null, sqlType: TEXT */
   status?: Maybe<T.StatusT>
}

export type NewComfyPrompt = {
   id?: ComfyPromptID
   stepID?: StepID
   graphID?: ComfyWorkflowID
   executed?: number
   error?: Maybe<T.ComfyPrompt_error>
   status?: Maybe<T.StatusT>
}

export type ComfyPromptUpdate = {
   id?: never // ComfyPromptID
   createdAt?: number
   updatedAt?: number
   stepID?: StepID
   graphID?: ComfyWorkflowID
   executed?: number
   error?: T.ComfyPrompt_error | null
   status?: T.StatusT | null
}

export type ComfyPromptBackRefsToHandleOnDelete = {
   media_video_promptID?: MediaVideoBackRefsToHandleOnDelete | 'set null'
   media_image_promptID?: MediaImageBackRefsToHandleOnDelete | 'set null'
   media_3d_displacement_promptID?: Media3dDisplacementBackRefsToHandleOnDelete | 'set null'
   runtime_error_promptID?: RuntimeErrorBackRefsToHandleOnDelete | 'set null'
}

export type ComfyPromptT = {
   id: ComfyPromptID
   createdAt: number
   updatedAt: number
   stepID: StepID
   graphID: ComfyWorkflowID
   executed: number
   error?: T.ComfyPrompt_error | null
   status?: T.StatusT | null
}

export type ComfyPromptTypes = {
   TableName: 'comfy_prompt'
   JSName: 'ComfyPrompt'
   Read: ComfyPromptT
   Instance: ComfyPromptL
   Create: NewComfyPrompt
   Update: ComfyPromptUpdate
   ID: ComfyPromptID
   Delete: ComfyPromptBackRefsToHandleOnDelete
}

export const ComfyPromptSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      stepID: Type.String(),
      graphID: Type.String(),
      executed: Type.Number(),
      error: Type.Optional(T.Nullable(T.ComfyPrompt_error_Schema)),
      status: Type.Optional(T.Nullable(Type.String())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const ComfyPromptRefs = [
    { fromTable:'comfy_prompt', fromField:'graphID', toTable:'comfy_workflow', tofield:'id' },
    { fromTable:'comfy_prompt', fromField:'stepID', toTable:'step', tofield:'id' }
]

// prettier-ignore
export const ComfyPromptBackRefs = [
    { fromTable:'media_video', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' },
    { fromTable:'media_image', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' },
    { fromTable:'media_3d_displacement', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' },
    { fromTable:'runtime_error', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' }
]

export const ComfyPromptFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   stepID: { cid: 3, name: 'stepID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   graphID: { cid: 4, name: 'graphID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   executed: { cid: 5, name: 'executed', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   error: { cid: 6, name: 'error', type: 'json', notnull: 0, dflt_value: null, pk: 0 },
   status: { cid: 7, name: 'status', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region ComfySchema

export const asComfySchemaID = (s: string): ComfySchemaID => s as any

export type ComfySchemaTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<ComfySchemaID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: json */
   spec: T.ComfySchema_spec
   /** @default: null, sqlType: json */
   embeddings: T.ComfySchema_embeddings
   /** @default: null, sqlType: TEXT */
   hostID?: Maybe<HostID>
}

export type NewComfySchema = {
   id?: ComfySchemaID
   spec?: T.ComfySchema_spec
   embeddings?: T.ComfySchema_embeddings
   hostID?: Maybe<HostID>
}

export type ComfySchemaUpdate = {
   id?: never // ComfySchemaID
   createdAt?: number
   updatedAt?: number
   spec?: T.ComfySchema_spec
   embeddings?: T.ComfySchema_embeddings
   hostID?: HostID | null
}

export type ComfySchemaBackRefsToHandleOnDelete = EmptyObject

export type ComfySchemaT = {
   id: ComfySchemaID
   createdAt: number
   updatedAt: number
   spec: T.ComfySchema_spec
   embeddings: T.ComfySchema_embeddings
   hostID?: HostID | null
}

export type ComfySchemaTypes = {
   TableName: 'comfy_schema'
   JSName: 'ComfySchema'
   Read: ComfySchemaT
   Instance: ComfySchemaL
   Create: NewComfySchema
   Update: ComfySchemaUpdate
   ID: ComfySchemaID
   Delete: ComfySchemaBackRefsToHandleOnDelete
}

export const ComfySchemaSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      spec: T.ComfySchema_spec_Schema,
      embeddings: T.ComfySchema_embeddings_Schema,
      hostID: Type.Optional(T.Nullable(Type.String())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const ComfySchemaRefs = [
    { fromTable:'comfy_schema', fromField:'hostID', toTable:'host', tofield:'id' }
]

export const ComfySchemaBackRefs = []

export const ComfySchemaFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   spec: { cid: 3, name: 'spec', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   embeddings: { cid: 4, name: 'embeddings', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   hostID: { cid: 5, name: 'hostID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region MediaText

export const asMediaTextID = (s: string): MediaTextID => s as any

export type MediaTextTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<MediaTextID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   kind: string
   /** @default: null, sqlType: TEXT */
   content: string
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: "''", sqlType: TEXT */
   title: Generated<string>
}

export type NewMediaText = {
   id?: MediaTextID
   kind?: string
   content?: string
   stepID?: Maybe<StepID>
   title?: string
}

export type MediaTextUpdate = {
   id?: never // MediaTextID
   createdAt?: number
   updatedAt?: number
   kind?: string
   content?: string
   stepID?: StepID | null
   title?: string
}

export type MediaTextBackRefsToHandleOnDelete = EmptyObject

export type MediaTextT = {
   id: MediaTextID
   createdAt: number
   updatedAt: number
   kind: string
   content: string
   stepID?: StepID | null
   title: string
}

export type MediaTextTypes = {
   TableName: 'media_text'
   JSName: 'MediaText'
   Read: MediaTextT
   Instance: MediaTextL
   Create: NewMediaText
   Update: MediaTextUpdate
   ID: MediaTextID
   Delete: MediaTextBackRefsToHandleOnDelete
}

export const MediaTextSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      kind: Type.String(),
      content: Type.String(),
      stepID: Type.Optional(T.Nullable(Type.String())),
      title: Type.String(),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const MediaTextRefs = [
    { fromTable:'media_text', fromField:'stepID', toTable:'step', tofield:'id' }
]

export const MediaTextBackRefs = []

export const MediaTextFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   kind: { cid: 3, name: 'kind', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   content: { cid: 4, name: 'content', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   stepID: { cid: 5, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   title: { cid: 6, name: 'title', type: 'TEXT', notnull: 1, dflt_value: "''", pk: 0 },
}

// #region MediaVideo

export const asMediaVideoID = (s: string): MediaVideoID => s as any

export type MediaVideoTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<MediaVideoID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   absPath?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: null, sqlType: TEXT */
   promptID?: Maybe<ComfyPromptID>
   /** @default: null, sqlType: TEXT */
   filePath?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   url: string
}

export type NewMediaVideo = {
   id?: MediaVideoID
   absPath?: Maybe<string>
   stepID?: Maybe<StepID>
   promptID?: Maybe<ComfyPromptID>
   filePath?: Maybe<string>
   url?: string
}

export type MediaVideoUpdate = {
   id?: never // MediaVideoID
   createdAt?: number
   updatedAt?: number
   absPath?: string | null
   stepID?: StepID | null
   promptID?: ComfyPromptID | null
   filePath?: string | null
   url?: string
}

export type MediaVideoBackRefsToHandleOnDelete = EmptyObject

export type MediaVideoT = {
   id: MediaVideoID
   createdAt: number
   updatedAt: number
   absPath?: string | null
   stepID?: StepID | null
   promptID?: ComfyPromptID | null
   filePath?: string | null
   url: string
}

export type MediaVideoTypes = {
   TableName: 'media_video'
   JSName: 'MediaVideo'
   Read: MediaVideoT
   Instance: MediaVideoL
   Create: NewMediaVideo
   Update: MediaVideoUpdate
   ID: MediaVideoID
   Delete: MediaVideoBackRefsToHandleOnDelete
}

export const MediaVideoSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      absPath: Type.Optional(T.Nullable(Type.String())),
      stepID: Type.Optional(T.Nullable(Type.String())),
      promptID: Type.Optional(T.Nullable(Type.String())),
      filePath: Type.Optional(T.Nullable(Type.String())),
      url: Type.String(),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const MediaVideoRefs = [
    { fromTable:'media_video', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' },
    { fromTable:'media_video', fromField:'stepID', toTable:'step', tofield:'id' }
]

export const MediaVideoBackRefs = []

export const MediaVideoFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   absPath: { cid: 3, name: 'absPath', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   stepID: { cid: 4, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   promptID: { cid: 5, name: 'promptID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   filePath: { cid: 6, name: 'filePath', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   url: { cid: 7, name: 'url', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
}

// #region MediaImage

export const asMediaImageID = (s: string): MediaImageID => s as any

export type MediaImageTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<MediaImageID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: INT */
   star?: Maybe<number>
   /** @default: null, sqlType: TEXT */
   promptID?: Maybe<ComfyPromptID>
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: null, sqlType: TEXT */
   promptNodeID?: Maybe<string>
   /** @default: null, sqlType: INT */
   width: number
   /** @default: null, sqlType: INT */
   height: number
   /** @default: null, sqlType: INT */
   fileSize: number
   /** @default: null, sqlType: TEXT */
   hash: string
   /** @default: null, sqlType: TEXT */
   path: string
   /** @default: null, sqlType: json */
   comfyUIInfos?: Maybe<T.MediaImage_comfyUIInfos>
   /** @default: null, sqlType: TEXT */
   type?: Maybe<string>
   /** @default: null, sqlType: INT */
   orientation?: Maybe<number>
   /** @default: null, sqlType: string */
   tags?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   thumbnail?: Maybe<string>
   /** @default: null, sqlType: json */
   safetyRating?: Maybe<T.MediaImage_safetyRating>
}

export type NewMediaImage = {
   id?: MediaImageID
   star?: Maybe<number>
   promptID?: Maybe<ComfyPromptID>
   stepID?: Maybe<StepID>
   promptNodeID?: Maybe<string>
   width?: number
   height?: number
   fileSize?: number
   hash?: string
   path?: string
   comfyUIInfos?: Maybe<T.MediaImage_comfyUIInfos>
   type?: Maybe<string>
   orientation?: Maybe<number>
   tags?: Maybe<string>
   thumbnail?: Maybe<string>
   safetyRating?: Maybe<T.MediaImage_safetyRating>
}

export type MediaImageUpdate = {
   id?: never // MediaImageID
   createdAt?: number
   updatedAt?: number
   star?: number | null
   promptID?: ComfyPromptID | null
   stepID?: StepID | null
   promptNodeID?: string | null
   width?: number
   height?: number
   fileSize?: number
   hash?: string
   path?: string
   comfyUIInfos?: T.MediaImage_comfyUIInfos | null
   type?: string | null
   orientation?: number | null
   tags?: string | null
   thumbnail?: string | null
   safetyRating?: T.MediaImage_safetyRating | null
}

export type MediaImageBackRefsToHandleOnDelete = EmptyObject

export type MediaImageT = {
   id: MediaImageID
   createdAt: number
   updatedAt: number
   star?: number | null
   promptID?: ComfyPromptID | null
   stepID?: StepID | null
   promptNodeID?: string | null
   width: number
   height: number
   fileSize: number
   hash: string
   path: string
   comfyUIInfos?: T.MediaImage_comfyUIInfos | null
   type?: string | null
   orientation?: number | null
   tags?: string | null
   thumbnail?: string | null
   safetyRating?: T.MediaImage_safetyRating | null
}

export type MediaImageTypes = {
   TableName: 'media_image'
   JSName: 'MediaImage'
   Read: MediaImageT
   Instance: MediaImageL
   Create: NewMediaImage
   Update: MediaImageUpdate
   ID: MediaImageID
   Delete: MediaImageBackRefsToHandleOnDelete
}

export const MediaImageSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      star: Type.Optional(T.Nullable(Type.Number())),
      promptID: Type.Optional(T.Nullable(Type.String())),
      stepID: Type.Optional(T.Nullable(Type.String())),
      promptNodeID: Type.Optional(T.Nullable(Type.String())),
      width: Type.Number(),
      height: Type.Number(),
      fileSize: Type.Number(),
      hash: Type.String(),
      path: Type.String(),
      comfyUIInfos: Type.Optional(T.Nullable(T.MediaImage_comfyUIInfos_Schema)),
      type: Type.Optional(T.Nullable(Type.String())),
      orientation: Type.Optional(T.Nullable(Type.Number())),
      tags: Type.Optional(T.Nullable(Type.String())),
      thumbnail: Type.Optional(T.Nullable(Type.String())),
      safetyRating: Type.Optional(T.Nullable(T.MediaImage_safetyRating_Schema)),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const MediaImageRefs = [
    { fromTable:'media_image', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'media_image', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' }
]

export const MediaImageBackRefs = []

export const MediaImageFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   star: { cid: 3, name: 'star', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   promptID: { cid: 4, name: 'promptID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   stepID: { cid: 5, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   promptNodeID: { cid: 6, name: 'promptNodeID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   width: { cid: 7, name: 'width', type: 'INT', notnull: 1, dflt_value: null, pk: 0 },
   height: { cid: 8, name: 'height', type: 'INT', notnull: 1, dflt_value: null, pk: 0 },
   fileSize: { cid: 9, name: 'fileSize', type: 'INT', notnull: 1, dflt_value: null, pk: 0 },
   hash: { cid: 10, name: 'hash', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   path: { cid: 11, name: 'path', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   comfyUIInfos: { cid: 12, name: 'comfyUIInfos', type: 'json', notnull: 0, dflt_value: null, pk: 0 },
   type: { cid: 13, name: 'type', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   orientation: { cid: 14, name: 'orientation', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   tags: { cid: 15, name: 'tags', type: 'string', notnull: 0, dflt_value: null, pk: 0 },
   thumbnail: { cid: 16, name: 'thumbnail', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   safetyRating: { cid: 17, name: 'safetyRating', type: 'json', notnull: 0, dflt_value: null, pk: 0 },
}

// #region Media3dDisplacement

export const asMedia3dDisplacementID = (s: string): Media3dDisplacementID => s as any

export type Media3dDisplacementTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<Media3dDisplacementID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: INT */
   width?: Maybe<number>
   /** @default: null, sqlType: INT */
   height?: Maybe<number>
   /** @default: null, sqlType: TEXT */
   image?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   depthMap?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   normalMap?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: null, sqlType: TEXT */
   promptID?: Maybe<ComfyPromptID>
}

export type NewMedia3dDisplacement = {
   id?: Media3dDisplacementID
   width?: Maybe<number>
   height?: Maybe<number>
   image?: Maybe<string>
   depthMap?: Maybe<string>
   normalMap?: Maybe<string>
   stepID?: Maybe<StepID>
   promptID?: Maybe<ComfyPromptID>
}

export type Media3dDisplacementUpdate = {
   id?: never // Media3dDisplacementID
   createdAt?: number
   updatedAt?: number
   width?: number | null
   height?: number | null
   image?: string | null
   depthMap?: string | null
   normalMap?: string | null
   stepID?: StepID | null
   promptID?: ComfyPromptID | null
}

export type Media3dDisplacementBackRefsToHandleOnDelete = EmptyObject

export type Media3dDisplacementT = {
   id: Media3dDisplacementID
   createdAt: number
   updatedAt: number
   width?: number | null
   height?: number | null
   image?: string | null
   depthMap?: string | null
   normalMap?: string | null
   stepID?: StepID | null
   promptID?: ComfyPromptID | null
}

export type Media3dDisplacementTypes = {
   TableName: 'media_3d_displacement'
   JSName: 'Media3dDisplacement'
   Read: Media3dDisplacementT
   Instance: Media3dDisplacementL
   Create: NewMedia3dDisplacement
   Update: Media3dDisplacementUpdate
   ID: Media3dDisplacementID
   Delete: Media3dDisplacementBackRefsToHandleOnDelete
}

export const Media3dDisplacementSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      width: Type.Optional(T.Nullable(Type.Number())),
      height: Type.Optional(T.Nullable(Type.Number())),
      image: Type.Optional(T.Nullable(Type.String())),
      depthMap: Type.Optional(T.Nullable(Type.String())),
      normalMap: Type.Optional(T.Nullable(Type.String())),
      stepID: Type.Optional(T.Nullable(Type.String())),
      promptID: Type.Optional(T.Nullable(Type.String())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const Media3dDisplacementRefs = [
    { fromTable:'media_3d_displacement', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' },
    { fromTable:'media_3d_displacement', fromField:'stepID', toTable:'step', tofield:'id' }
]

export const Media3dDisplacementBackRefs = []

export const Media3dDisplacementFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   width: { cid: 3, name: 'width', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   height: { cid: 4, name: 'height', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   image: { cid: 5, name: 'image', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   depthMap: { cid: 6, name: 'depthMap', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   normalMap: { cid: 7, name: 'normalMap', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   stepID: { cid: 8, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   promptID: { cid: 9, name: 'promptID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region RuntimeError

export const asRuntimeErrorID = (s: string): RuntimeErrorID => s as any

export type RuntimeErrorTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<RuntimeErrorID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   message: string
   /** @default: null, sqlType: json */
   infos: T.RuntimeError_infos
   /** @default: null, sqlType: TEXT */
   promptID?: Maybe<ComfyPromptID>
   /** @default: null, sqlType: TEXT */
   graphID?: Maybe<ComfyWorkflowID>
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
}

export type NewRuntimeError = {
   id?: RuntimeErrorID
   message?: string
   infos?: T.RuntimeError_infos
   promptID?: Maybe<ComfyPromptID>
   graphID?: Maybe<ComfyWorkflowID>
   stepID?: Maybe<StepID>
}

export type RuntimeErrorUpdate = {
   id?: never // RuntimeErrorID
   createdAt?: number
   updatedAt?: number
   message?: string
   infos?: T.RuntimeError_infos
   promptID?: ComfyPromptID | null
   graphID?: ComfyWorkflowID | null
   stepID?: StepID | null
}

export type RuntimeErrorBackRefsToHandleOnDelete = EmptyObject

export type RuntimeErrorT = {
   id: RuntimeErrorID
   createdAt: number
   updatedAt: number
   message: string
   infos: T.RuntimeError_infos
   promptID?: ComfyPromptID | null
   graphID?: ComfyWorkflowID | null
   stepID?: StepID | null
}

export type RuntimeErrorTypes = {
   TableName: 'runtime_error'
   JSName: 'RuntimeError'
   Read: RuntimeErrorT
   Instance: RuntimeErrorL
   Create: NewRuntimeError
   Update: RuntimeErrorUpdate
   ID: RuntimeErrorID
   Delete: RuntimeErrorBackRefsToHandleOnDelete
}

export const RuntimeErrorSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      message: Type.String(),
      infos: T.RuntimeError_infos_Schema,
      promptID: Type.Optional(T.Nullable(Type.String())),
      graphID: Type.Optional(T.Nullable(Type.String())),
      stepID: Type.Optional(T.Nullable(Type.String())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const RuntimeErrorRefs = [
    { fromTable:'runtime_error', fromField:'stepID', toTable:'step', tofield:'id' },
    { fromTable:'runtime_error', fromField:'graphID', toTable:'comfy_workflow', tofield:'id' },
    { fromTable:'runtime_error', fromField:'promptID', toTable:'comfy_prompt', tofield:'id' }
]

export const RuntimeErrorBackRefs = []

export const RuntimeErrorFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   message: { cid: 3, name: 'message', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   infos: { cid: 4, name: 'infos', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   promptID: { cid: 5, name: 'promptID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   graphID: { cid: 6, name: 'graphID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   stepID: { cid: 7, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region MediaSplat

export const asMediaSplatID = (s: string): MediaSplatID => s as any

export type MediaSplatTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<MediaSplatID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: null, sqlType: TEXT */
   url: string
}

export type NewMediaSplat = {
   id?: MediaSplatID
   stepID?: Maybe<StepID>
   url?: string
}

export type MediaSplatUpdate = {
   id?: never // MediaSplatID
   createdAt?: number
   updatedAt?: number
   stepID?: StepID | null
   url?: string
}

export type MediaSplatBackRefsToHandleOnDelete = EmptyObject

export type MediaSplatT = {
   id: MediaSplatID
   createdAt: number
   updatedAt: number
   stepID?: StepID | null
   url: string
}

export type MediaSplatTypes = {
   TableName: 'media_splat'
   JSName: 'MediaSplat'
   Read: MediaSplatT
   Instance: MediaSplatL
   Create: NewMediaSplat
   Update: MediaSplatUpdate
   ID: MediaSplatID
   Delete: MediaSplatBackRefsToHandleOnDelete
}

export const MediaSplatSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      stepID: Type.Optional(T.Nullable(Type.String())),
      url: Type.String(),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const MediaSplatRefs = [
    { fromTable:'media_splat', fromField:'stepID', toTable:'step', tofield:'id' }
]

export const MediaSplatBackRefs = []

export const MediaSplatFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   stepID: { cid: 3, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   url: { cid: 4, name: 'url', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
}

// #region CustomData

export const asCustomDataID = (s: string): CustomDataID => s as any

export type CustomDataTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<CustomDataID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: "'{}'", sqlType: json */
   json: Generated<T.CustomData_json>
}

export type NewCustomData = {
   id?: CustomDataID
   json?: T.CustomData_json
}

export type CustomDataUpdate = {
   id?: never // CustomDataID
   createdAt?: number
   updatedAt?: number
   json?: T.CustomData_json
}

export type CustomDataBackRefsToHandleOnDelete = EmptyObject

export type CustomDataT = {
   id: CustomDataID
   createdAt: number
   updatedAt: number
   json: T.CustomData_json
}

export type CustomDataTypes = {
   TableName: 'custom_data'
   JSName: 'CustomData'
   Read: CustomDataT
   Instance: CustomDataL
   Create: NewCustomData
   Update: CustomDataUpdate
   ID: CustomDataID
   Delete: CustomDataBackRefsToHandleOnDelete
}

export const CustomDataSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      json: T.CustomData_json_Schema,
   },
   { additionalProperties: false },
)

export const CustomDataRefs = []

export const CustomDataBackRefs = []

export const CustomDataFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   json: { cid: 3, name: 'json', type: 'json', notnull: 1, dflt_value: "'{}'", pk: 0 },
}

// #region CushyScript

export const asCushyScriptID = (s: string): CushyScriptID => s as any

export type CushyScriptTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<CushyScriptID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   path: string
   /** @default: null, sqlType: TEXT */
   code: string
   /** @default: null, sqlType: INT */
   lastEvaluatedAt?: Maybe<number>
   /** @default: null, sqlType: INT */
   lastSuccessfulEvaluationAt?: Maybe<number>
   /** @default: null, sqlType: json */
   metafile?: Maybe<T.CushyScript_metafile>
   /** @default: null, sqlType: INT */
   lastExtractedAt?: Maybe<number>
}

export type NewCushyScript = {
   id?: CushyScriptID
   path?: string
   code?: string
   lastEvaluatedAt?: Maybe<number>
   lastSuccessfulEvaluationAt?: Maybe<number>
   metafile?: Maybe<T.CushyScript_metafile>
   lastExtractedAt?: Maybe<number>
}

export type CushyScriptUpdate = {
   id?: never // CushyScriptID
   createdAt?: number
   updatedAt?: number
   path?: string
   code?: string
   lastEvaluatedAt?: number | null
   lastSuccessfulEvaluationAt?: number | null
   metafile?: T.CushyScript_metafile | null
   lastExtractedAt?: number | null
}

export type CushyScriptBackRefsToHandleOnDelete = {
   cushy_app_scriptID: CushyAppBackRefsToHandleOnDelete
}

export type CushyScriptT = {
   id: CushyScriptID
   createdAt: number
   updatedAt: number
   path: string
   code: string
   lastEvaluatedAt?: number | null
   lastSuccessfulEvaluationAt?: number | null
   metafile?: T.CushyScript_metafile | null
   lastExtractedAt?: number | null
}

export type CushyScriptTypes = {
   TableName: 'cushy_script'
   JSName: 'CushyScript'
   Read: CushyScriptT
   Instance: CushyScriptL
   Create: NewCushyScript
   Update: CushyScriptUpdate
   ID: CushyScriptID
   Delete: CushyScriptBackRefsToHandleOnDelete
}

export const CushyScriptSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      path: Type.String(),
      code: Type.String(),
      lastEvaluatedAt: Type.Optional(T.Nullable(Type.Number())),
      lastSuccessfulEvaluationAt: Type.Optional(T.Nullable(Type.Number())),
      metafile: Type.Optional(T.Nullable(T.CushyScript_metafile_Schema)),
      lastExtractedAt: Type.Optional(T.Nullable(Type.Number())),
   },
   { additionalProperties: false },
)

export const CushyScriptRefs = []

// prettier-ignore
export const CushyScriptBackRefs = [
    { fromTable:'cushy_app', fromField:'scriptID', toTable:'cushy_script', tofield:'id' }
]

export const CushyScriptFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   path: { cid: 3, name: 'path', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   code: { cid: 4, name: 'code', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   lastEvaluatedAt: { cid: 5, name: 'lastEvaluatedAt', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   lastSuccessfulEvaluationAt: {
      cid: 6,
      name: 'lastSuccessfulEvaluationAt',
      type: 'INT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
   metafile: { cid: 7, name: 'metafile', type: 'json', notnull: 0, dflt_value: null, pk: 0 },
   lastExtractedAt: { cid: 8, name: 'lastExtractedAt', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region CushyApp

export const asCushyAppID = (s: string): CushyAppID => s as any

export type CushyAppTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<CushyAppID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   guid?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   scriptID: CushyScriptID
   /** @default: null, sqlType: TEXT */
   name?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   illustration?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   description?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   tags?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   publishedAsUserID?: Maybe<string>
   /** @default: null, sqlType: INT */
   publishedAt?: Maybe<number>
   /** @default: "0", sqlType: INT */
   isFavorite: Generated<number>
   /** @default: null, sqlType: INT */
   canStartFromImage?: Maybe<number>
   /** @default: null, sqlType: INT */
   lastRunAt?: Maybe<number>
}

export type NewCushyApp = {
   id?: CushyAppID
   guid?: Maybe<string>
   scriptID?: CushyScriptID
   name?: Maybe<string>
   illustration?: Maybe<string>
   description?: Maybe<string>
   tags?: Maybe<string>
   publishedAsUserID?: Maybe<string>
   publishedAt?: Maybe<number>
   isFavorite?: number
   canStartFromImage?: Maybe<number>
   lastRunAt?: Maybe<number>
}

export type CushyAppUpdate = {
   id?: never // CushyAppID
   createdAt?: number
   updatedAt?: number
   guid?: string | null
   scriptID?: CushyScriptID
   name?: string | null
   illustration?: string | null
   description?: string | null
   tags?: string | null
   publishedAsUserID?: string | null
   publishedAt?: number | null
   isFavorite?: number
   canStartFromImage?: number | null
   lastRunAt?: number | null
}

export type CushyAppBackRefsToHandleOnDelete = {
   draft_appID: DraftBackRefsToHandleOnDelete
   step_appID: StepBackRefsToHandleOnDelete
}

export type CushyAppT = {
   id: CushyAppID
   createdAt: number
   updatedAt: number
   guid?: string | null
   scriptID: CushyScriptID
   name?: string | null
   illustration?: string | null
   description?: string | null
   tags?: string | null
   publishedAsUserID?: string | null
   publishedAt?: number | null
   isFavorite: number
   canStartFromImage?: number | null
   lastRunAt?: number | null
}

export type CushyAppTypes = {
   TableName: 'cushy_app'
   JSName: 'CushyApp'
   Read: CushyAppT
   Instance: CushyAppL
   Create: NewCushyApp
   Update: CushyAppUpdate
   ID: CushyAppID
   Delete: CushyAppBackRefsToHandleOnDelete
}

export const CushyAppSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      guid: Type.Optional(T.Nullable(Type.String())),
      scriptID: Type.String(),
      name: Type.Optional(T.Nullable(Type.String())),
      illustration: Type.Optional(T.Nullable(Type.String())),
      description: Type.Optional(T.Nullable(Type.String())),
      tags: Type.Optional(T.Nullable(Type.String())),
      publishedAsUserID: Type.Optional(T.Nullable(Type.String())),
      publishedAt: Type.Optional(T.Nullable(Type.Number())),
      isFavorite: Type.Number(),
      canStartFromImage: Type.Optional(T.Nullable(Type.Number())),
      lastRunAt: Type.Optional(T.Nullable(Type.Number())),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const CushyAppRefs = [
    { fromTable:'cushy_app', fromField:'scriptID', toTable:'cushy_script', tofield:'id' }
]

// prettier-ignore
export const CushyAppBackRefs = [
    { fromTable:'draft', fromField:'appID', toTable:'cushy_app', tofield:'id' },
    { fromTable:'step', fromField:'appID', toTable:'cushy_app', tofield:'id' }
]

export const CushyAppFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   guid: { cid: 3, name: 'guid', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   scriptID: { cid: 4, name: 'scriptID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
   name: { cid: 5, name: 'name', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   illustration: { cid: 6, name: 'illustration', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   description: { cid: 7, name: 'description', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   tags: { cid: 8, name: 'tags', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   publishedAsUserID: {
      cid: 9,
      name: 'publishedAsUserID',
      type: 'TEXT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
   publishedAt: { cid: 10, name: 'publishedAt', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   isFavorite: { cid: 11, name: 'isFavorite', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   canStartFromImage: {
      cid: 12,
      name: 'canStartFromImage',
      type: 'INT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
   lastRunAt: { cid: 13, name: 'lastRunAt', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region Auth

export const asAuthID = (s: string): AuthID => s as any

export type AuthTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<AuthID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   provider_token?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   refresh_token?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   token_type?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   access_token?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   provider_refresh_token?: Maybe<string>
   /** @default: null, sqlType: INT */
   expires_at?: Maybe<number>
   /** @default: null, sqlType: INT */
   expires_in?: Maybe<number>
}

export type NewAuth = {
   id?: AuthID
   provider_token?: Maybe<string>
   refresh_token?: Maybe<string>
   token_type?: Maybe<string>
   access_token?: Maybe<string>
   provider_refresh_token?: Maybe<string>
   expires_at?: Maybe<number>
   expires_in?: Maybe<number>
}

export type AuthUpdate = {
   id?: never // AuthID
   createdAt?: number
   updatedAt?: number
   provider_token?: string | null
   refresh_token?: string | null
   token_type?: string | null
   access_token?: string | null
   provider_refresh_token?: string | null
   expires_at?: number | null
   expires_in?: number | null
}

export type AuthBackRefsToHandleOnDelete = EmptyObject

export type AuthT = {
   id: AuthID
   createdAt: number
   updatedAt: number
   provider_token?: string | null
   refresh_token?: string | null
   token_type?: string | null
   access_token?: string | null
   provider_refresh_token?: string | null
   expires_at?: number | null
   expires_in?: number | null
}

export type AuthTypes = {
   TableName: 'auth'
   JSName: 'Auth'
   Read: AuthT
   Instance: AuthL
   Create: NewAuth
   Update: AuthUpdate
   ID: AuthID
   Delete: AuthBackRefsToHandleOnDelete
}

export const AuthSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      provider_token: Type.Optional(T.Nullable(Type.String())),
      refresh_token: Type.Optional(T.Nullable(Type.String())),
      token_type: Type.Optional(T.Nullable(Type.String())),
      access_token: Type.Optional(T.Nullable(Type.String())),
      provider_refresh_token: Type.Optional(T.Nullable(Type.String())),
      expires_at: Type.Optional(T.Nullable(Type.Number())),
      expires_in: Type.Optional(T.Nullable(Type.Number())),
   },
   { additionalProperties: false },
)

export const AuthRefs = []

export const AuthBackRefs = []

export const AuthFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   provider_token: { cid: 3, name: 'provider_token', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   refresh_token: { cid: 4, name: 'refresh_token', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   token_type: { cid: 5, name: 'token_type', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   access_token: { cid: 6, name: 'access_token', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   provider_refresh_token: {
      cid: 7,
      name: 'provider_refresh_token',
      type: 'TEXT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
   expires_at: { cid: 8, name: 'expires_at', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   expires_in: { cid: 9, name: 'expires_in', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
}

// #region TreeEntry

export const asTreeEntryID = (s: string): TreeEntryID => s as any

export type TreeEntryTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<TreeEntryID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: INT */
   isExpanded?: Maybe<number>
   /** @default: "0", sqlType: INT */
   isSelected?: Generated<Maybe<number>>
}

export type NewTreeEntry = {
   id?: TreeEntryID
   isExpanded?: Maybe<number>
   isSelected?: Maybe<number>
}

export type TreeEntryUpdate = {
   id?: never // TreeEntryID
   createdAt?: number
   updatedAt?: number
   isExpanded?: number | null
   isSelected?: number | null
}

export type TreeEntryBackRefsToHandleOnDelete = EmptyObject

export type TreeEntryT = {
   id: TreeEntryID
   createdAt: number
   updatedAt: number
   isExpanded?: number | null
   isSelected?: number | null
}

export type TreeEntryTypes = {
   TableName: 'tree_entry'
   JSName: 'TreeEntry'
   Read: TreeEntryT
   Instance: TreeEntryL
   Create: NewTreeEntry
   Update: TreeEntryUpdate
   ID: TreeEntryID
   Delete: TreeEntryBackRefsToHandleOnDelete
}

export const TreeEntrySchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      isExpanded: Type.Optional(T.Nullable(Type.Number())),
      isSelected: Type.Optional(T.Nullable(Type.Number())),
   },
   { additionalProperties: false },
)

export const TreeEntryRefs = []

export const TreeEntryBackRefs = []

export const TreeEntryFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   isExpanded: { cid: 3, name: 'isExpanded', type: 'INT', notnull: 0, dflt_value: null, pk: 0 },
   isSelected: { cid: 4, name: 'isSelected', type: 'INT', notnull: 0, dflt_value: '0', pk: 0 },
}

// #region Host

export const asHostID = (s: string): HostID => s as any

export type HostTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<HostID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: "hex(randomblob(16))", sqlType: TEXT */
   name: Generated<string>
   /** @default: "\"localhost\"", sqlType: TEXT */
   hostname: Generated<string>
   /** @default: "8188", sqlType: INT */
   port: Generated<number>
   /** @default: "0", sqlType: INT */
   useHttps: Generated<number>
   /** @default: "0", sqlType: INT */
   isLocal: Generated<number>
   /** @default: null, sqlType: TEXT */
   absolutePathToComfyUI?: Maybe<string>
   /** @default: null, sqlType: TEXT */
   absolutPathToDownloadModelsTo?: Maybe<string>
   /** @default: "0", sqlType: INT */
   isVirtual: Generated<number>
   /** @default: "0", sqlType: INT */
   isReadonly: Generated<number>
}

export type NewHost = {
   id?: HostID
   name?: string
   hostname?: string
   port?: number
   useHttps?: number
   isLocal?: number
   absolutePathToComfyUI?: Maybe<string>
   absolutPathToDownloadModelsTo?: Maybe<string>
   isVirtual?: number
   isReadonly?: number
}

export type HostUpdate = {
   id?: never // HostID
   createdAt?: number
   updatedAt?: number
   name?: string
   hostname?: string
   port?: number
   useHttps?: number
   isLocal?: number
   absolutePathToComfyUI?: string | null
   absolutPathToDownloadModelsTo?: string | null
   isVirtual?: number
   isReadonly?: number
}

export type HostBackRefsToHandleOnDelete = {
   comfy_schema_hostID?: ComfySchemaBackRefsToHandleOnDelete | 'set null'
}

export type HostT = {
   id: HostID
   createdAt: number
   updatedAt: number
   name: string
   hostname: string
   port: number
   useHttps: number
   isLocal: number
   absolutePathToComfyUI?: string | null
   absolutPathToDownloadModelsTo?: string | null
   isVirtual: number
   isReadonly: number
}

export type HostTypes = {
   TableName: 'host'
   JSName: 'Host'
   Read: HostT
   Instance: HostL
   Create: NewHost
   Update: HostUpdate
   ID: HostID
   Delete: HostBackRefsToHandleOnDelete
}

export const HostSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      name: Type.String(),
      hostname: Type.String(),
      port: Type.Number(),
      useHttps: Type.Number(),
      isLocal: Type.Number(),
      absolutePathToComfyUI: Type.Optional(T.Nullable(Type.String())),
      absolutPathToDownloadModelsTo: Type.Optional(T.Nullable(Type.String())),
      isVirtual: Type.Number(),
      isReadonly: Type.Number(),
   },
   { additionalProperties: false },
)

export const HostRefs = []

// prettier-ignore
export const HostBackRefs = [
    { fromTable:'comfy_schema', fromField:'hostID', toTable:'host', tofield:'id' }
]

export const HostFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   name: { cid: 3, name: 'name', type: 'TEXT', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 0 },
   hostname: { cid: 4, name: 'hostname', type: 'TEXT', notnull: 1, dflt_value: '"localhost"', pk: 0 },
   port: { cid: 5, name: 'port', type: 'INT', notnull: 1, dflt_value: '8188', pk: 0 },
   useHttps: { cid: 6, name: 'useHttps', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   isLocal: { cid: 7, name: 'isLocal', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   absolutePathToComfyUI: {
      cid: 8,
      name: 'absolutePathToComfyUI',
      type: 'TEXT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
   absolutPathToDownloadModelsTo: {
      cid: 9,
      name: 'absolutPathToDownloadModelsTo',
      type: 'TEXT',
      notnull: 0,
      dflt_value: null,
      pk: 0,
   },
   isVirtual: { cid: 10, name: 'isVirtual', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
   isReadonly: { cid: 11, name: 'isReadonly', type: 'INT', notnull: 1, dflt_value: '0', pk: 0 },
}

// #region MediaCustom

export const asMediaCustomID = (s: string): MediaCustomID => s as any

export type MediaCustomTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<MediaCustomID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: json */
   params?: Maybe<T.MediaCustom_params>
   /** @default: null, sqlType: TEXT */
   stepID?: Maybe<StepID>
   /** @default: null, sqlType: TEXT */
   viewID: string
}

export type NewMediaCustom = {
   id?: MediaCustomID
   params?: Maybe<T.MediaCustom_params>
   stepID?: Maybe<StepID>
   viewID?: string
}

export type MediaCustomUpdate = {
   id?: never // MediaCustomID
   createdAt?: number
   updatedAt?: number
   params?: T.MediaCustom_params | null
   stepID?: StepID | null
   viewID?: string
}

export type MediaCustomBackRefsToHandleOnDelete = EmptyObject

export type MediaCustomT = {
   id: MediaCustomID
   createdAt: number
   updatedAt: number
   params?: T.MediaCustom_params | null
   stepID?: StepID | null
   viewID: string
}

export type MediaCustomTypes = {
   TableName: 'media_custom'
   JSName: 'MediaCustom'
   Read: MediaCustomT
   Instance: MediaCustomL
   Create: NewMediaCustom
   Update: MediaCustomUpdate
   ID: MediaCustomID
   Delete: MediaCustomBackRefsToHandleOnDelete
}

export const MediaCustomSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      params: Type.Optional(T.Nullable(T.MediaCustom_params_Schema)),
      stepID: Type.Optional(T.Nullable(Type.String())),
      viewID: Type.String(),
   },
   { additionalProperties: false },
)

// prettier-ignore
export const MediaCustomRefs = [
    { fromTable:'media_custom', fromField:'stepID', toTable:'step', tofield:'id' }
]

export const MediaCustomBackRefs = []

export const MediaCustomFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   params: { cid: 3, name: 'params', type: 'json', notnull: 0, dflt_value: null, pk: 0 },
   stepID: { cid: 4, name: 'stepID', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   viewID: { cid: 5, name: 'viewID', type: 'TEXT', notnull: 1, dflt_value: null, pk: 0 },
}

// #region Perspective

export const asPerspectiveID = (s: string): PerspectiveID => s as any

export type PerspectiveTable = {
   /** @default: "hex(randomblob(16))", sqlType: string */
   id: Generated<PerspectiveID>
   /** @default: "now", sqlType: INTEGER */
   createdAt: Generated<number>
   /** @default: "now", sqlType: INTEGER */
   updatedAt: Generated<number>
   /** @default: null, sqlType: TEXT */
   name?: Maybe<string>
   /** @default: null, sqlType: json */
   layout: T.Perspective_layout
   /** @default: null, sqlType: json */
   layoutDefault?: Maybe<T.Perspective_layoutDefault>
   /** @default: null, sqlType: INT */
   priority: number
}

export type NewPerspective = {
   id?: PerspectiveID
   name?: Maybe<string>
   layout?: T.Perspective_layout
   layoutDefault?: Maybe<T.Perspective_layoutDefault>
   priority?: number
}

export type PerspectiveUpdate = {
   id?: never // PerspectiveID
   createdAt?: number
   updatedAt?: number
   name?: string | null
   layout?: T.Perspective_layout
   layoutDefault?: T.Perspective_layoutDefault | null
   priority?: number
}

export type PerspectiveBackRefsToHandleOnDelete = EmptyObject

export type PerspectiveT = {
   id: PerspectiveID
   createdAt: number
   updatedAt: number
   name?: string | null
   layout: T.Perspective_layout
   layoutDefault?: T.Perspective_layoutDefault | null
   priority: number
}

export type PerspectiveTypes = {
   TableName: 'perspective'
   JSName: 'Perspective'
   Read: PerspectiveT
   Instance: PerspectiveL
   Create: NewPerspective
   Update: PerspectiveUpdate
   ID: PerspectiveID
   Delete: PerspectiveBackRefsToHandleOnDelete
}

export const PerspectiveSchema = Type.Object(
   {
      id: Type.String(),
      createdAt: Type.Number(),
      updatedAt: Type.Number(),
      name: Type.Optional(T.Nullable(Type.String())),
      layout: T.Perspective_layout_Schema,
      layoutDefault: Type.Optional(T.Nullable(T.Perspective_layoutDefault_Schema)),
      priority: Type.Number(),
   },
   { additionalProperties: false },
)

export const PerspectiveRefs = []

export const PerspectiveBackRefs = []

export const PerspectiveFields = {
   id: { cid: 0, name: 'id', type: 'string', notnull: 1, dflt_value: 'hex(randomblob(16))', pk: 1 },
   createdAt: { cid: 1, name: 'createdAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   updatedAt: { cid: 2, name: 'updatedAt', type: 'INTEGER', notnull: 1, dflt_value: 'now', pk: 0 },
   name: { cid: 3, name: 'name', type: 'TEXT', notnull: 0, dflt_value: null, pk: 0 },
   layout: { cid: 4, name: 'layout', type: 'json', notnull: 1, dflt_value: null, pk: 0 },
   layoutDefault: { cid: 5, name: 'layoutDefault', type: 'json', notnull: 0, dflt_value: null, pk: 0 },
   priority: { cid: 6, name: 'priority', type: 'INT', notnull: 1, dflt_value: null, pk: 0 },
}

// prettier-ignore
export const TABLE_comfy_workflow = new T.TableInfo<
    'comfy_workflow',
    ComfyWorkflowT,
    ComfyWorkflowL,
    NewComfyWorkflow,
    ComfyWorkflowUpdate,
    ComfyWorkflowID,
    ComfyWorkflowBackRefsToHandleOnDelete
>(
    'comfy_workflow',
    'ComfyWorkflow',
    ComfyWorkflowFields,
    ComfyWorkflowSchema,
    ComfyWorkflowRefs,
    ComfyWorkflowBackRefs,
)
// prettier-ignore
export const TABLE_draft = new T.TableInfo<
    'draft',
    DraftT,
    DraftL,
    NewDraft,
    DraftUpdate,
    DraftID,
    DraftBackRefsToHandleOnDelete
>(
    'draft',
    'Draft',
    DraftFields,
    DraftSchema,
    DraftRefs,
    DraftBackRefs,
)
// prettier-ignore
export const TABLE_project = new T.TableInfo<
    'project',
    ProjectT,
    ProjectL,
    NewProject,
    ProjectUpdate,
    ProjectID,
    ProjectBackRefsToHandleOnDelete
>(
    'project',
    'Project',
    ProjectFields,
    ProjectSchema,
    ProjectRefs,
    ProjectBackRefs,
)
// prettier-ignore
export const TABLE_step = new T.TableInfo<
    'step',
    StepT,
    StepL,
    NewStep,
    StepUpdate,
    StepID,
    StepBackRefsToHandleOnDelete
>(
    'step',
    'Step',
    StepFields,
    StepSchema,
    StepRefs,
    StepBackRefs,
)
// prettier-ignore
export const TABLE_comfy_prompt = new T.TableInfo<
    'comfy_prompt',
    ComfyPromptT,
    ComfyPromptL,
    NewComfyPrompt,
    ComfyPromptUpdate,
    ComfyPromptID,
    ComfyPromptBackRefsToHandleOnDelete
>(
    'comfy_prompt',
    'ComfyPrompt',
    ComfyPromptFields,
    ComfyPromptSchema,
    ComfyPromptRefs,
    ComfyPromptBackRefs,
)
// prettier-ignore
export const TABLE_comfy_schema = new T.TableInfo<
    'comfy_schema',
    ComfySchemaT,
    ComfySchemaL,
    NewComfySchema,
    ComfySchemaUpdate,
    ComfySchemaID,
    ComfySchemaBackRefsToHandleOnDelete
>(
    'comfy_schema',
    'ComfySchema',
    ComfySchemaFields,
    ComfySchemaSchema,
    ComfySchemaRefs,
    ComfySchemaBackRefs,
)
// prettier-ignore
export const TABLE_media_text = new T.TableInfo<
    'media_text',
    MediaTextT,
    MediaTextL,
    NewMediaText,
    MediaTextUpdate,
    MediaTextID,
    MediaTextBackRefsToHandleOnDelete
>(
    'media_text',
    'MediaText',
    MediaTextFields,
    MediaTextSchema,
    MediaTextRefs,
    MediaTextBackRefs,
)
// prettier-ignore
export const TABLE_media_video = new T.TableInfo<
    'media_video',
    MediaVideoT,
    MediaVideoL,
    NewMediaVideo,
    MediaVideoUpdate,
    MediaVideoID,
    MediaVideoBackRefsToHandleOnDelete
>(
    'media_video',
    'MediaVideo',
    MediaVideoFields,
    MediaVideoSchema,
    MediaVideoRefs,
    MediaVideoBackRefs,
)
// prettier-ignore
export const TABLE_media_image = new T.TableInfo<
    'media_image',
    MediaImageT,
    MediaImageL,
    NewMediaImage,
    MediaImageUpdate,
    MediaImageID,
    MediaImageBackRefsToHandleOnDelete
>(
    'media_image',
    'MediaImage',
    MediaImageFields,
    MediaImageSchema,
    MediaImageRefs,
    MediaImageBackRefs,
)
// prettier-ignore
export const TABLE_media_3d_displacement = new T.TableInfo<
    'media_3d_displacement',
    Media3dDisplacementT,
    Media3dDisplacementL,
    NewMedia3dDisplacement,
    Media3dDisplacementUpdate,
    Media3dDisplacementID,
    Media3dDisplacementBackRefsToHandleOnDelete
>(
    'media_3d_displacement',
    'Media3dDisplacement',
    Media3dDisplacementFields,
    Media3dDisplacementSchema,
    Media3dDisplacementRefs,
    Media3dDisplacementBackRefs,
)
// prettier-ignore
export const TABLE_runtime_error = new T.TableInfo<
    'runtime_error',
    RuntimeErrorT,
    RuntimeErrorL,
    NewRuntimeError,
    RuntimeErrorUpdate,
    RuntimeErrorID,
    RuntimeErrorBackRefsToHandleOnDelete
>(
    'runtime_error',
    'RuntimeError',
    RuntimeErrorFields,
    RuntimeErrorSchema,
    RuntimeErrorRefs,
    RuntimeErrorBackRefs,
)
// prettier-ignore
export const TABLE_media_splat = new T.TableInfo<
    'media_splat',
    MediaSplatT,
    MediaSplatL,
    NewMediaSplat,
    MediaSplatUpdate,
    MediaSplatID,
    MediaSplatBackRefsToHandleOnDelete
>(
    'media_splat',
    'MediaSplat',
    MediaSplatFields,
    MediaSplatSchema,
    MediaSplatRefs,
    MediaSplatBackRefs,
)
// prettier-ignore
export const TABLE_custom_data = new T.TableInfo<
    'custom_data',
    CustomDataT,
    CustomDataL,
    NewCustomData,
    CustomDataUpdate,
    CustomDataID,
    CustomDataBackRefsToHandleOnDelete
>(
    'custom_data',
    'CustomData',
    CustomDataFields,
    CustomDataSchema,
    CustomDataRefs,
    CustomDataBackRefs,
)
// prettier-ignore
export const TABLE_cushy_script = new T.TableInfo<
    'cushy_script',
    CushyScriptT,
    CushyScriptL,
    NewCushyScript,
    CushyScriptUpdate,
    CushyScriptID,
    CushyScriptBackRefsToHandleOnDelete
>(
    'cushy_script',
    'CushyScript',
    CushyScriptFields,
    CushyScriptSchema,
    CushyScriptRefs,
    CushyScriptBackRefs,
)
// prettier-ignore
export const TABLE_cushy_app = new T.TableInfo<
    'cushy_app',
    CushyAppT,
    CushyAppL,
    NewCushyApp,
    CushyAppUpdate,
    CushyAppID,
    CushyAppBackRefsToHandleOnDelete
>(
    'cushy_app',
    'CushyApp',
    CushyAppFields,
    CushyAppSchema,
    CushyAppRefs,
    CushyAppBackRefs,
)
// prettier-ignore
export const TABLE_auth = new T.TableInfo<
    'auth',
    AuthT,
    AuthL,
    NewAuth,
    AuthUpdate,
    AuthID,
    AuthBackRefsToHandleOnDelete
>(
    'auth',
    'Auth',
    AuthFields,
    AuthSchema,
    AuthRefs,
    AuthBackRefs,
)
// prettier-ignore
export const TABLE_tree_entry = new T.TableInfo<
    'tree_entry',
    TreeEntryT,
    TreeEntryL,
    NewTreeEntry,
    TreeEntryUpdate,
    TreeEntryID,
    TreeEntryBackRefsToHandleOnDelete
>(
    'tree_entry',
    'TreeEntry',
    TreeEntryFields,
    TreeEntrySchema,
    TreeEntryRefs,
    TreeEntryBackRefs,
)
// prettier-ignore
export const TABLE_host = new T.TableInfo<
    'host',
    HostT,
    HostL,
    NewHost,
    HostUpdate,
    HostID,
    HostBackRefsToHandleOnDelete
>(
    'host',
    'Host',
    HostFields,
    HostSchema,
    HostRefs,
    HostBackRefs,
)
// prettier-ignore
export const TABLE_media_custom = new T.TableInfo<
    'media_custom',
    MediaCustomT,
    MediaCustomL,
    NewMediaCustom,
    MediaCustomUpdate,
    MediaCustomID,
    MediaCustomBackRefsToHandleOnDelete
>(
    'media_custom',
    'MediaCustom',
    MediaCustomFields,
    MediaCustomSchema,
    MediaCustomRefs,
    MediaCustomBackRefs,
)
// prettier-ignore
export const TABLE_perspective = new T.TableInfo<
    'perspective',
    PerspectiveT,
    PerspectiveL,
    NewPerspective,
    PerspectiveUpdate,
    PerspectiveID,
    PerspectiveBackRefsToHandleOnDelete
>(
    'perspective',
    'Perspective',
    PerspectiveFields,
    PerspectiveSchema,
    PerspectiveRefs,
    PerspectiveBackRefs,
)

export type TABLES = typeof schemas

// prettier-ignore
export const schemas = {
    comfy_workflow       : TABLE_comfy_workflow,
    draft                : TABLE_draft,
    project              : TABLE_project,
    step                 : TABLE_step,
    comfy_prompt         : TABLE_comfy_prompt,
    comfy_schema         : TABLE_comfy_schema,
    media_text           : TABLE_media_text,
    media_video          : TABLE_media_video,
    media_image          : TABLE_media_image,
    media_3d_displacement: TABLE_media_3d_displacement,
    runtime_error        : TABLE_runtime_error,
    media_splat          : TABLE_media_splat,
    custom_data          : TABLE_custom_data,
    cushy_script         : TABLE_cushy_script,
    cushy_app            : TABLE_cushy_app,
    auth                 : TABLE_auth,
    tree_entry           : TABLE_tree_entry,
    host                 : TABLE_host,
    media_custom         : TABLE_media_custom,
    perspective          : TABLE_perspective,
}
export type TableName = keyof typeof schemas

export type KyselyTables = {
   comfy_workflow: ComfyWorkflowTable
   draft: DraftTable
   project: ProjectTable
   step: StepTable
   comfy_prompt: ComfyPromptTable
   comfy_schema: ComfySchemaTable
   media_text: MediaTextTable
   media_video: MediaVideoTable
   media_image: MediaImageTable
   media_3d_displacement: Media3dDisplacementTable
   runtime_error: RuntimeErrorTable
   media_splat: MediaSplatTable
   custom_data: CustomDataTable
   cushy_script: CushyScriptTable
   cushy_app: CushyAppTable
   auth: AuthTable
   tree_entry: TreeEntryTable
   host: HostTable
   media_custom: MediaCustomTable
   perspective: PerspectiveTable
}
export type LiveDBSubKeys =
   | 'comfy_workflow'
   | 'comfy_workflow.id'
   | 'comfy_workflow.createdAt'
   | 'comfy_workflow.updatedAt'
   | 'comfy_workflow.comfyPromptJSON'
   | 'comfy_workflow.stepID'
   | 'comfy_workflow.metadata'
   | 'draft'
   | 'draft.id'
   | 'draft.createdAt'
   | 'draft.updatedAt'
   | 'draft.title'
   | 'draft.formSerial'
   | 'draft.appID'
   | 'draft.illustration'
   | 'draft.isFavorite'
   | 'draft.lastRunAt'
   | 'draft.canvasToolCategory'
   | 'project'
   | 'project.id'
   | 'project.createdAt'
   | 'project.updatedAt'
   | 'project.name'
   | 'project.rootGraphID'
   | 'project.currentApp'
   | 'project.currentDraftID'
   | 'project.filterNSFW'
   | 'project.autostartDelay'
   | 'project.autostartMaxDelay'
   | 'step'
   | 'step.id'
   | 'step.createdAt'
   | 'step.updatedAt'
   | 'step.name'
   | 'step.formSerial'
   | 'step.outputGraphID'
   | 'step.status'
   | 'step.isExpanded'
   | 'step.appID'
   | 'step.draftID'
   | 'comfy_prompt'
   | 'comfy_prompt.id'
   | 'comfy_prompt.createdAt'
   | 'comfy_prompt.updatedAt'
   | 'comfy_prompt.stepID'
   | 'comfy_prompt.graphID'
   | 'comfy_prompt.executed'
   | 'comfy_prompt.error'
   | 'comfy_prompt.status'
   | 'comfy_schema'
   | 'comfy_schema.id'
   | 'comfy_schema.createdAt'
   | 'comfy_schema.updatedAt'
   | 'comfy_schema.spec'
   | 'comfy_schema.embeddings'
   | 'comfy_schema.hostID'
   | 'media_text'
   | 'media_text.id'
   | 'media_text.createdAt'
   | 'media_text.updatedAt'
   | 'media_text.kind'
   | 'media_text.content'
   | 'media_text.stepID'
   | 'media_text.title'
   | 'media_video'
   | 'media_video.id'
   | 'media_video.createdAt'
   | 'media_video.updatedAt'
   | 'media_video.absPath'
   | 'media_video.stepID'
   | 'media_video.promptID'
   | 'media_video.filePath'
   | 'media_video.url'
   | 'media_image'
   | 'media_image.id'
   | 'media_image.createdAt'
   | 'media_image.updatedAt'
   | 'media_image.star'
   | 'media_image.promptID'
   | 'media_image.stepID'
   | 'media_image.promptNodeID'
   | 'media_image.width'
   | 'media_image.height'
   | 'media_image.fileSize'
   | 'media_image.hash'
   | 'media_image.path'
   | 'media_image.comfyUIInfos'
   | 'media_image.type'
   | 'media_image.orientation'
   | 'media_image.tags'
   | 'media_image.thumbnail'
   | 'media_image.safetyRating'
   | 'media_3d_displacement'
   | 'media_3d_displacement.id'
   | 'media_3d_displacement.createdAt'
   | 'media_3d_displacement.updatedAt'
   | 'media_3d_displacement.width'
   | 'media_3d_displacement.height'
   | 'media_3d_displacement.image'
   | 'media_3d_displacement.depthMap'
   | 'media_3d_displacement.normalMap'
   | 'media_3d_displacement.stepID'
   | 'media_3d_displacement.promptID'
   | 'runtime_error'
   | 'runtime_error.id'
   | 'runtime_error.createdAt'
   | 'runtime_error.updatedAt'
   | 'runtime_error.message'
   | 'runtime_error.infos'
   | 'runtime_error.promptID'
   | 'runtime_error.graphID'
   | 'runtime_error.stepID'
   | 'media_splat'
   | 'media_splat.id'
   | 'media_splat.createdAt'
   | 'media_splat.updatedAt'
   | 'media_splat.stepID'
   | 'media_splat.url'
   | 'custom_data'
   | 'custom_data.id'
   | 'custom_data.createdAt'
   | 'custom_data.updatedAt'
   | 'custom_data.json'
   | 'cushy_script'
   | 'cushy_script.id'
   | 'cushy_script.createdAt'
   | 'cushy_script.updatedAt'
   | 'cushy_script.path'
   | 'cushy_script.code'
   | 'cushy_script.lastEvaluatedAt'
   | 'cushy_script.lastSuccessfulEvaluationAt'
   | 'cushy_script.metafile'
   | 'cushy_script.lastExtractedAt'
   | 'cushy_app'
   | 'cushy_app.id'
   | 'cushy_app.createdAt'
   | 'cushy_app.updatedAt'
   | 'cushy_app.guid'
   | 'cushy_app.scriptID'
   | 'cushy_app.name'
   | 'cushy_app.illustration'
   | 'cushy_app.description'
   | 'cushy_app.tags'
   | 'cushy_app.publishedAsUserID'
   | 'cushy_app.publishedAt'
   | 'cushy_app.isFavorite'
   | 'cushy_app.canStartFromImage'
   | 'cushy_app.lastRunAt'
   | 'auth'
   | 'auth.id'
   | 'auth.createdAt'
   | 'auth.updatedAt'
   | 'auth.provider_token'
   | 'auth.refresh_token'
   | 'auth.token_type'
   | 'auth.access_token'
   | 'auth.provider_refresh_token'
   | 'auth.expires_at'
   | 'auth.expires_in'
   | 'tree_entry'
   | 'tree_entry.id'
   | 'tree_entry.createdAt'
   | 'tree_entry.updatedAt'
   | 'tree_entry.isExpanded'
   | 'tree_entry.isSelected'
   | 'host'
   | 'host.id'
   | 'host.createdAt'
   | 'host.updatedAt'
   | 'host.name'
   | 'host.hostname'
   | 'host.port'
   | 'host.useHttps'
   | 'host.isLocal'
   | 'host.absolutePathToComfyUI'
   | 'host.absolutPathToDownloadModelsTo'
   | 'host.isVirtual'
   | 'host.isReadonly'
   | 'media_custom'
   | 'media_custom.id'
   | 'media_custom.createdAt'
   | 'media_custom.updatedAt'
   | 'media_custom.params'
   | 'media_custom.stepID'
   | 'media_custom.viewID'
   | 'perspective'
   | 'perspective.id'
   | 'perspective.createdAt'
   | 'perspective.updatedAt'
   | 'perspective.name'
   | 'perspective.layout'
   | 'perspective.layoutDefault'
   | 'perspective.priority'
export const liveDBSubKeys = new Set([
   'comfy_workflow',
   'comfy_workflow.id',
   'comfy_workflow.createdAt',
   'comfy_workflow.updatedAt',
   'comfy_workflow.comfyPromptJSON',
   'comfy_workflow.stepID',
   'comfy_workflow.metadata',
   'draft',
   'draft.id',
   'draft.createdAt',
   'draft.updatedAt',
   'draft.title',
   'draft.formSerial',
   'draft.appID',
   'draft.illustration',
   'draft.isFavorite',
   'draft.lastRunAt',
   'draft.canvasToolCategory',
   'project',
   'project.id',
   'project.createdAt',
   'project.updatedAt',
   'project.name',
   'project.rootGraphID',
   'project.currentApp',
   'project.currentDraftID',
   'project.filterNSFW',
   'project.autostartDelay',
   'project.autostartMaxDelay',
   'step',
   'step.id',
   'step.createdAt',
   'step.updatedAt',
   'step.name',
   'step.formSerial',
   'step.outputGraphID',
   'step.status',
   'step.isExpanded',
   'step.appID',
   'step.draftID',
   'comfy_prompt',
   'comfy_prompt.id',
   'comfy_prompt.createdAt',
   'comfy_prompt.updatedAt',
   'comfy_prompt.stepID',
   'comfy_prompt.graphID',
   'comfy_prompt.executed',
   'comfy_prompt.error',
   'comfy_prompt.status',
   'comfy_schema',
   'comfy_schema.id',
   'comfy_schema.createdAt',
   'comfy_schema.updatedAt',
   'comfy_schema.spec',
   'comfy_schema.embeddings',
   'comfy_schema.hostID',
   'media_text',
   'media_text.id',
   'media_text.createdAt',
   'media_text.updatedAt',
   'media_text.kind',
   'media_text.content',
   'media_text.stepID',
   'media_text.title',
   'media_video',
   'media_video.id',
   'media_video.createdAt',
   'media_video.updatedAt',
   'media_video.absPath',
   'media_video.stepID',
   'media_video.promptID',
   'media_video.filePath',
   'media_video.url',
   'media_image',
   'media_image.id',
   'media_image.createdAt',
   'media_image.updatedAt',
   'media_image.star',
   'media_image.promptID',
   'media_image.stepID',
   'media_image.promptNodeID',
   'media_image.width',
   'media_image.height',
   'media_image.fileSize',
   'media_image.hash',
   'media_image.path',
   'media_image.comfyUIInfos',
   'media_image.type',
   'media_image.orientation',
   'media_image.tags',
   'media_image.thumbnail',
   'media_image.safetyRating',
   'media_3d_displacement',
   'media_3d_displacement.id',
   'media_3d_displacement.createdAt',
   'media_3d_displacement.updatedAt',
   'media_3d_displacement.width',
   'media_3d_displacement.height',
   'media_3d_displacement.image',
   'media_3d_displacement.depthMap',
   'media_3d_displacement.normalMap',
   'media_3d_displacement.stepID',
   'media_3d_displacement.promptID',
   'runtime_error',
   'runtime_error.id',
   'runtime_error.createdAt',
   'runtime_error.updatedAt',
   'runtime_error.message',
   'runtime_error.infos',
   'runtime_error.promptID',
   'runtime_error.graphID',
   'runtime_error.stepID',
   'media_splat',
   'media_splat.id',
   'media_splat.createdAt',
   'media_splat.updatedAt',
   'media_splat.stepID',
   'media_splat.url',
   'custom_data',
   'custom_data.id',
   'custom_data.createdAt',
   'custom_data.updatedAt',
   'custom_data.json',
   'cushy_script',
   'cushy_script.id',
   'cushy_script.createdAt',
   'cushy_script.updatedAt',
   'cushy_script.path',
   'cushy_script.code',
   'cushy_script.lastEvaluatedAt',
   'cushy_script.lastSuccessfulEvaluationAt',
   'cushy_script.metafile',
   'cushy_script.lastExtractedAt',
   'cushy_app',
   'cushy_app.id',
   'cushy_app.createdAt',
   'cushy_app.updatedAt',
   'cushy_app.guid',
   'cushy_app.scriptID',
   'cushy_app.name',
   'cushy_app.illustration',
   'cushy_app.description',
   'cushy_app.tags',
   'cushy_app.publishedAsUserID',
   'cushy_app.publishedAt',
   'cushy_app.isFavorite',
   'cushy_app.canStartFromImage',
   'cushy_app.lastRunAt',
   'auth',
   'auth.id',
   'auth.createdAt',
   'auth.updatedAt',
   'auth.provider_token',
   'auth.refresh_token',
   'auth.token_type',
   'auth.access_token',
   'auth.provider_refresh_token',
   'auth.expires_at',
   'auth.expires_in',
   'tree_entry',
   'tree_entry.id',
   'tree_entry.createdAt',
   'tree_entry.updatedAt',
   'tree_entry.isExpanded',
   'tree_entry.isSelected',
   'host',
   'host.id',
   'host.createdAt',
   'host.updatedAt',
   'host.name',
   'host.hostname',
   'host.port',
   'host.useHttps',
   'host.isLocal',
   'host.absolutePathToComfyUI',
   'host.absolutPathToDownloadModelsTo',
   'host.isVirtual',
   'host.isReadonly',
   'media_custom',
   'media_custom.id',
   'media_custom.createdAt',
   'media_custom.updatedAt',
   'media_custom.params',
   'media_custom.stepID',
   'media_custom.viewID',
   'perspective',
   'perspective.id',
   'perspective.createdAt',
   'perspective.updatedAt',
   'perspective.name',
   'perspective.layout',
   'perspective.layoutDefault',
   'perspective.priority',
])
