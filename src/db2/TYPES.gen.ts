import * as T from './TYPES_json'
import { Type } from '@sinclair/typebox'

export const insertMigrationsSQL = 'insert into migrations (id, name, createdAt, sql) values (@id, @name, @createdAt, @sql)'
export const asMigrationsID = (s: string): MigrationsID => s as any
export type MigrationsT = {
    /** @default: null, sqlType: TEXT */
    id?: MigrationsID;

    /** @default: null, sqlType: TEXT */
    name: string;

    /** @default: null, sqlType: INTEGER */
    createdAt: number;

    /** @default: null, sqlType: TEXT */
    sql: string;

}
export const MigrationsSchema = Type.Object({
    id: Type.String(),
    name: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    sql: Type.Optional(Type.String()),
},{ additionalProperties: false })
export const insertUsersSQL = 'insert into users (id, firstName, lastName, email, passwordHash) values (@id, @firstName, @lastName, @email, @passwordHash)'
export const asUsersID = (s: string): UsersID => s as any
export type UsersT = {
    /** @default: null, sqlType: INTEGER */
    id?: UsersID;

    /** @default: null, sqlType: TEXT */
    firstName: string;

    /** @default: null, sqlType: TEXT */
    lastName: string;

    /** @default: null, sqlType: TEXT */
    email: string;

    /** @default: null, sqlType: TEXT */
    passwordHash: string;

}
export const UsersSchema = Type.Object({
    id: Type.Number(),
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    email: Type.Optional(Type.String()),
    passwordHash: Type.Optional(Type.String()),
},{ additionalProperties: false })
export const insertGraphSQL = 'insert into graph (id, createdAt, updatedAt, comfyPromptJSON) values (@id, @createdAt, @updatedAt, @comfyPromptJSON)'
export const asGraphID = (s: string): GraphID => s as any
export type GraphT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: GraphID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: json */
    comfyPromptJSON: T.Graph_comfyPromptJSON;

}
export const GraphSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    comfyPromptJSON: Type.Optional(T.Graph_comfyPromptJSON_Schema),
},{ additionalProperties: false })
export const insertDraftSQL = 'insert into draft (id, createdAt, updatedAt, title, appPath, appParams) values (@id, @createdAt, @updatedAt, @title, @appPath, @appParams)'
export const asDraftID = (s: string): DraftID => s as any
export type DraftT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: DraftID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    title?: string;

    /** @default: null, sqlType: TEXT */
    appPath: AppPath;

    /** @default: null, sqlType: json */
    appParams: T.Draft_appParams;

}
export const DraftSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    title: Type.String(),
    appPath: Type.Optional(Type.String()),
    appParams: Type.Optional(T.Draft_appParams_Schema),
},{ additionalProperties: false })
export const insertProjectSQL = 'insert into project (id, createdAt, updatedAt, name, rootGraphID, currentApp, currentDraftID) values (@id, @createdAt, @updatedAt, @name, @rootGraphID, @currentApp, @currentDraftID)'
export const asProjectID = (s: string): ProjectID => s as any
export type ProjectT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: ProjectID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    name?: string;

    /** @default: null, sqlType: TEXT */
    rootGraphID: GraphID;

    /** @default: null, sqlType: TEXT */
    currentApp?: string;

    /** @default: null, sqlType: TEXT */
    currentDraftID?: DraftID;

}
export const ProjectSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    name: Type.String(),
    rootGraphID: Type.Optional(Type.String()),
    currentApp: Type.String(),
    currentDraftID: Type.String(),
},{ additionalProperties: false })
export const insertStepSQL = 'insert into step (id, createdAt, updatedAt, name, appPath, formResult, formSerial, outputGraphID, status) values (@id, @createdAt, @updatedAt, @name, @appPath, @formResult, @formSerial, @outputGraphID, @status)'
export const asStepID = (s: string): StepID => s as any
export type StepT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: StepID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    name?: string;

    /** @default: null, sqlType: TEXT */
    appPath: AppPath;

    /** @default: null, sqlType: json */
    formResult: T.Step_formResult;

    /** @default: null, sqlType: json */
    formSerial: T.Step_formSerial;

    /** @default: null, sqlType: TEXT */
    outputGraphID: GraphID;

    /** @default: null, sqlType: TEXT */
    status: string;

}
export const StepSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    name: Type.String(),
    appPath: Type.Optional(Type.String()),
    formResult: Type.Optional(T.Step_formResult_Schema),
    formSerial: Type.Optional(T.Step_formSerial_Schema),
    outputGraphID: Type.Optional(Type.String()),
    status: Type.Optional(Type.String()),
},{ additionalProperties: false })
export const insertComfyPromptSQL = 'insert into comfy_prompt (id, createdAt, updatedAt, stepID, graphID, executed, error) values (@id, @createdAt, @updatedAt, @stepID, @graphID, @executed, @error)'
export const asComfyPromptID = (s: string): ComfyPromptID => s as any
export type ComfyPromptT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: ComfyPromptID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    stepID: StepID;

    /** @default: null, sqlType: TEXT */
    graphID: GraphID;

    /** @default: "0", sqlType: INT */
    executed: number;

    /** @default: null, sqlType: json */
    error?: T.ComfyPrompt_error;

}
export const ComfyPromptSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    stepID: Type.Optional(Type.String()),
    graphID: Type.Optional(Type.String()),
    executed: Type.Optional(Type.Number()),
    error: T.ComfyPrompt_error_Schema,
},{ additionalProperties: false })
export const insertComfySchemaSQL = 'insert into comfy_schema (id, createdAt, updatedAt, spec, embeddings) values (@id, @createdAt, @updatedAt, @spec, @embeddings)'
export const asComfySchemaID = (s: string): ComfySchemaID => s as any
export type ComfySchemaT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: ComfySchemaID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: json */
    spec: T.ComfySchema_spec;

    /** @default: null, sqlType: json */
    embeddings: T.ComfySchema_embeddings;

}
export const ComfySchemaSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    spec: Type.Optional(T.ComfySchema_spec_Schema),
    embeddings: Type.Optional(T.ComfySchema_embeddings_Schema),
},{ additionalProperties: false })
export const insertMediaTextSQL = 'insert into media_text (id, createdAt, updatedAt, kind, content, stepID) values (@id, @createdAt, @updatedAt, @kind, @content, @stepID)'
export const asMediaTextID = (s: string): MediaTextID => s as any
export type MediaTextT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: MediaTextID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    kind: string;

    /** @default: null, sqlType: TEXT */
    content: string;

    /** @default: null, sqlType: TEXT */
    stepID?: StepID;

}
export const MediaTextSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    kind: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    stepID: Type.String(),
},{ additionalProperties: false })
export const insertMediaVideoSQL = 'insert into media_video (id, createdAt, updatedAt, absPath) values (@id, @createdAt, @updatedAt, @absPath)'
export const asMediaVideoID = (s: string): MediaVideoID => s as any
export type MediaVideoT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: MediaVideoID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    absPath?: string;

}
export const MediaVideoSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    absPath: Type.String(),
},{ additionalProperties: false })
export const insertMediaImageSQL = 'insert into media_image (id, createdAt, updatedAt, width, height, star, infos, promptID, stepID) values (@id, @createdAt, @updatedAt, @width, @height, @star, @infos, @promptID, @stepID)'
export const asMediaImageID = (s: string): MediaImageID => s as any
export type MediaImageT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: MediaImageID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: INT */
    width?: number;

    /** @default: null, sqlType: INT */
    height?: number;

    /** @default: null, sqlType: INT */
    star?: number;

    /** @default: null, sqlType: json */
    infos?: T.MediaImage_infos;

    /** @default: null, sqlType: TEXT */
    promptID?: ComfyPromptID;

    /** @default: null, sqlType: TEXT */
    stepID?: StepID;

}
export const MediaImageSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    width: Type.Number(),
    height: Type.Number(),
    star: Type.Number(),
    infos: T.MediaImage_infos_Schema,
    promptID: Type.String(),
    stepID: Type.String(),
},{ additionalProperties: false })
export const insertMedia3ddisplacedSQL = 'insert into media_3ddisplaced (id, createdAt, updatedAt, width, height, image, depthMap, normalMap) values (@id, @createdAt, @updatedAt, @width, @height, @image, @depthMap, @normalMap)'
export const asMedia3ddisplacedID = (s: string): Media3ddisplacedID => s as any
export type Media3ddisplacedT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: Media3ddisplacedID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: INT */
    width?: number;

    /** @default: null, sqlType: INT */
    height?: number;

    /** @default: null, sqlType: TEXT */
    image?: string;

    /** @default: null, sqlType: TEXT */
    depthMap?: string;

    /** @default: null, sqlType: TEXT */
    normalMap?: string;

}
export const Media3ddisplacedSchema = Type.Object({
    id: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.Number()),
    updatedAt: Type.Optional(Type.Number()),
    width: Type.Number(),
    height: Type.Number(),
    image: Type.String(),
    depthMap: Type.String(),
    normalMap: Type.String(),
},{ additionalProperties: false })

export const inserts = {
    migrations: insertMigrationsSQL,
    users: insertUsersSQL,
    graph: insertGraphSQL,
    draft: insertDraftSQL,
    project: insertProjectSQL,
    step: insertStepSQL,
    comfy_prompt: insertComfyPromptSQL,
    comfy_schema: insertComfySchemaSQL,
    media_text: insertMediaTextSQL,
    media_video: insertMediaVideoSQL,
    media_image: insertMediaImageSQL,
    media_3ddisplaced: insertMedia3ddisplacedSQL,
}