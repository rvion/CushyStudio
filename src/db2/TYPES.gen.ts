import * as T from './TYPES_json'


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
