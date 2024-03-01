import * as T from './TYPES_json'
import { Type } from '@sinclair/typebox'


export const asMigrationsID = (s: string): MigrationsID => s as any
export type MigrationsT = {
    /** @default: null, sqlType: TEXT */
    id?: Maybe<MigrationsID>;

    /** @default: null, sqlType: TEXT */
    name: string;

    /** @default: null, sqlType: INTEGER */
    createdAt: number;

    /** @default: null, sqlType: TEXT */
    sql: string;

}

export type Migrations_C = {
    /** @default: null, sqlType: TEXT */
    id?: Maybe<MigrationsID>;

    /** @default: null, sqlType: TEXT */
    name: string;

    /** @default: null, sqlType: INTEGER */
    createdAt: number;

    /** @default: null, sqlType: TEXT */
    sql: string;

}
export const MigrationsSchema = Type.Object({
    id: Type.Optional(T.Nullable(Type.String())),
    name: Type.String(),
    createdAt: Type.Number(),
    sql: Type.String(),
},{ additionalProperties: false })

export const MigrationsRefs =[

]
export const MigrationsBackRefs =[

]

export const MigrationsFields = {
    id: {cid:0,name:'id',type:'TEXT',notnull:0,dflt_value:null,pk:1},
    name: {cid:1,name:'name',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    createdAt: {cid:2,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:null,pk:0},
    sql: {cid:3,name:'sql',type:'TEXT',notnull:1,dflt_value:null,pk:0},
}


export const asUsersID = (s: string): UsersID => s as any
export type UsersT = {
    /** @default: null, sqlType: INTEGER */
    id?: Maybe<UsersID>;

    /** @default: null, sqlType: TEXT */
    firstName: string;

    /** @default: null, sqlType: TEXT */
    lastName: string;

    /** @default: null, sqlType: TEXT */
    email: string;

    /** @default: null, sqlType: TEXT */
    passwordHash: string;

}

export type Users_C = {
    /** @default: null, sqlType: INTEGER */
    id?: Maybe<UsersID>;

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
    id: Type.Optional(T.Nullable(Type.Number())),
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String(),
    passwordHash: Type.String(),
},{ additionalProperties: false })

export const UsersRefs =[

]
export const UsersBackRefs =[

]

export const UsersFields = {
    id: {cid:0,name:'id',type:'INTEGER',notnull:0,dflt_value:null,pk:1},
    firstName: {cid:1,name:'firstName',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    lastName: {cid:2,name:'lastName',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    email: {cid:3,name:'email',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    passwordHash: {cid:4,name:'passwordHash',type:'TEXT',notnull:1,dflt_value:null,pk:0},
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

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: "'{}'", sqlType: json */
    metadata: T.Graph_metadata;

}

export type Graph_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: GraphID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: json */
    comfyPromptJSON: T.Graph_comfyPromptJSON;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: "'{}'", sqlType: json */
    metadata?: T.Graph_metadata;

}
export const GraphSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    comfyPromptJSON: T.Graph_comfyPromptJSON_Schema,
    stepID: Type.Optional(T.Nullable(Type.String())),
    metadata: T.Graph_metadata_Schema,
},{ additionalProperties: false })

export const GraphRefs =[
    {"fromTable":"graph","fromField":"stepID","toTable":"step","tofield":"id"}
]
export const GraphBackRefs =[
    {"fromTable":"project","fromField":"rootGraphID","toTable":"graph","tofield":"id"},
    {"fromTable":"step","fromField":"outputGraphID","toTable":"graph","tofield":"id"},
    {"fromTable":"comfy_prompt","fromField":"graphID","toTable":"graph","tofield":"id"},
    {"fromTable":"runtime_error","fromField":"graphID","toTable":"graph","tofield":"id"}
]

export const GraphFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    comfyPromptJSON: {cid:3,name:'comfyPromptJSON',type:'json',notnull:1,dflt_value:null,pk:0},
    stepID: {cid:4,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    metadata: {cid:5,name:'metadata',type:'json',notnull:1,dflt_value:"'{}'",pk:0},
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
    title?: Maybe<string>;

    /** @default: null, sqlType: json */
    formSerial: T.Draft_formSerial;

    /** @default: null, sqlType: TEXT */
    appID: CushyAppID;

    /** @default: null, sqlType: TEXT */
    illustration?: Maybe<string>;

    /** @default: "0", sqlType: INT */
    isFavorite: number;

}

export type Draft_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: DraftID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    title?: Maybe<string>;

    /** @default: null, sqlType: json */
    formSerial: T.Draft_formSerial;

    /** @default: null, sqlType: TEXT */
    appID: CushyAppID;

    /** @default: null, sqlType: TEXT */
    illustration?: Maybe<string>;

    /** @default: "0", sqlType: INT */
    isFavorite?: number;

}
export const DraftSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    title: Type.Optional(T.Nullable(Type.String())),
    formSerial: T.Draft_formSerial_Schema,
    appID: Type.String(),
    illustration: Type.Optional(T.Nullable(Type.String())),
    isFavorite: Type.Number(),
},{ additionalProperties: false })

export const DraftRefs =[
    {"fromTable":"draft","fromField":"appID","toTable":"cushy_app","tofield":"id"}
]
export const DraftBackRefs =[
    {"fromTable":"project","fromField":"currentDraftID","toTable":"draft","tofield":"id"},
    {"fromTable":"step","fromField":"draftID","toTable":"draft","tofield":"id"}
]

export const DraftFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    title: {cid:3,name:'title',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    formSerial: {cid:4,name:'formSerial',type:'json',notnull:1,dflt_value:null,pk:0},
    appID: {cid:5,name:'appID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    illustration: {cid:6,name:'illustration',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    isFavorite: {cid:7,name:'isFavorite',type:'INT',notnull:1,dflt_value:'0',pk:0},
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
    name?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    rootGraphID: GraphID;

    /** @default: null, sqlType: TEXT */
    currentApp?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    currentDraftID?: Maybe<DraftID>;

    /** @default: "0", sqlType: INT */
    filterNSFW: number;

    /** @default: "0", sqlType: INT */
    autostartDelay: number;

    /** @default: "100", sqlType: INT */
    autostartMaxDelay: number;

}

export type Project_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: ProjectID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    name?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    rootGraphID: GraphID;

    /** @default: null, sqlType: TEXT */
    currentApp?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    currentDraftID?: Maybe<DraftID>;

    /** @default: "0", sqlType: INT */
    filterNSFW?: number;

    /** @default: "0", sqlType: INT */
    autostartDelay?: number;

    /** @default: "100", sqlType: INT */
    autostartMaxDelay?: number;

}
export const ProjectSchema = Type.Object({
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
},{ additionalProperties: false })

export const ProjectRefs =[
    {"fromTable":"project","fromField":"currentDraftID","toTable":"draft","tofield":"id"},
    {"fromTable":"project","fromField":"rootGraphID","toTable":"graph","tofield":"id"}
]
export const ProjectBackRefs =[

]

export const ProjectFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    name: {cid:3,name:'name',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    rootGraphID: {cid:4,name:'rootGraphID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    currentApp: {cid:5,name:'currentApp',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    currentDraftID: {cid:6,name:'currentDraftID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    filterNSFW: {cid:7,name:'filterNSFW',type:'INT',notnull:1,dflt_value:'0',pk:0},
    autostartDelay: {cid:8,name:'autostartDelay',type:'INT',notnull:1,dflt_value:'0',pk:0},
    autostartMaxDelay: {cid:9,name:'autostartMaxDelay',type:'INT',notnull:1,dflt_value:'100',pk:0},
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
    name?: Maybe<string>;

    /** @default: null, sqlType: json */
    formSerial: T.Step_formSerial;

    /** @default: null, sqlType: TEXT */
    outputGraphID: GraphID;

    /** @default: null, sqlType: TEXT */
    status: T.StatusT;

    /** @default: "1", sqlType: INT */
    isExpanded: number;

    /** @default: null, sqlType: TEXT */
    appID: CushyAppID;

    /** @default: null, sqlType: TEXT */
    draftID?: Maybe<DraftID>;

}

export type Step_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: StepID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    name?: Maybe<string>;

    /** @default: null, sqlType: json */
    formSerial: T.Step_formSerial;

    /** @default: null, sqlType: TEXT */
    outputGraphID: GraphID;

    /** @default: null, sqlType: TEXT */
    status: T.StatusT;

    /** @default: "1", sqlType: INT */
    isExpanded?: number;

    /** @default: null, sqlType: TEXT */
    appID: CushyAppID;

    /** @default: null, sqlType: TEXT */
    draftID?: Maybe<DraftID>;

}
export const StepSchema = Type.Object({
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
},{ additionalProperties: false })

export const StepRefs =[
    {"fromTable":"step","fromField":"draftID","toTable":"draft","tofield":"id"},
    {"fromTable":"step","fromField":"appID","toTable":"cushy_app","tofield":"id"},
    {"fromTable":"step","fromField":"outputGraphID","toTable":"graph","tofield":"id"}
]
export const StepBackRefs =[
    {"fromTable":"graph","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"comfy_prompt","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"media_text","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"media_video","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"media_image","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"media_3d_displacement","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"runtime_error","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"media_splat","fromField":"stepID","toTable":"step","tofield":"id"}
]

export const StepFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    name: {cid:3,name:'name',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    formSerial: {cid:4,name:'formSerial',type:'json',notnull:1,dflt_value:null,pk:0},
    outputGraphID: {cid:5,name:'outputGraphID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    status: {cid:6,name:'status',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    isExpanded: {cid:7,name:'isExpanded',type:'INT',notnull:1,dflt_value:'1',pk:0},
    appID: {cid:8,name:'appID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    draftID: {cid:9,name:'draftID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
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
    error?: Maybe<T.ComfyPrompt_error>;

    /** @default: null, sqlType: TEXT */
    status?: Maybe<T.StatusT>;

}

export type ComfyPrompt_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: ComfyPromptID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    stepID: StepID;

    /** @default: null, sqlType: TEXT */
    graphID: GraphID;

    /** @default: "0", sqlType: INT */
    executed?: number;

    /** @default: null, sqlType: json */
    error?: Maybe<T.ComfyPrompt_error>;

    /** @default: null, sqlType: TEXT */
    status?: Maybe<T.StatusT>;

}
export const ComfyPromptSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    stepID: Type.String(),
    graphID: Type.String(),
    executed: Type.Number(),
    error: Type.Optional(T.Nullable(T.ComfyPrompt_error_Schema)),
    status: Type.Optional(T.Nullable(Type.String())),
},{ additionalProperties: false })

export const ComfyPromptRefs =[
    {"fromTable":"comfy_prompt","fromField":"graphID","toTable":"graph","tofield":"id"},
    {"fromTable":"comfy_prompt","fromField":"stepID","toTable":"step","tofield":"id"}
]
export const ComfyPromptBackRefs =[
    {"fromTable":"media_video","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"},
    {"fromTable":"media_image","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"},
    {"fromTable":"media_3d_displacement","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"},
    {"fromTable":"runtime_error","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"}
]

export const ComfyPromptFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    stepID: {cid:3,name:'stepID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    graphID: {cid:4,name:'graphID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    executed: {cid:5,name:'executed',type:'INT',notnull:1,dflt_value:'0',pk:0},
    error: {cid:6,name:'error',type:'json',notnull:0,dflt_value:null,pk:0},
    status: {cid:7,name:'status',type:'TEXT',notnull:0,dflt_value:null,pk:0},
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

    /** @default: null, sqlType: TEXT */
    hostID?: Maybe<HostID>;

}

export type ComfySchema_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: ComfySchemaID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: json */
    spec: T.ComfySchema_spec;

    /** @default: null, sqlType: json */
    embeddings: T.ComfySchema_embeddings;

    /** @default: null, sqlType: TEXT */
    hostID?: Maybe<HostID>;

}
export const ComfySchemaSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    spec: T.ComfySchema_spec_Schema,
    embeddings: T.ComfySchema_embeddings_Schema,
    hostID: Type.Optional(T.Nullable(Type.String())),
},{ additionalProperties: false })

export const ComfySchemaRefs =[
    {"fromTable":"comfy_schema","fromField":"hostID","toTable":"host","tofield":"id"}
]
export const ComfySchemaBackRefs =[

]

export const ComfySchemaFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    spec: {cid:3,name:'spec',type:'json',notnull:1,dflt_value:null,pk:0},
    embeddings: {cid:4,name:'embeddings',type:'json',notnull:1,dflt_value:null,pk:0},
    hostID: {cid:5,name:'hostID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
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
    stepID?: Maybe<StepID>;

    /** @default: "''", sqlType: TEXT */
    title: string;

}

export type MediaText_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: MediaTextID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    kind: string;

    /** @default: null, sqlType: TEXT */
    content: string;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: "''", sqlType: TEXT */
    title?: string;

}
export const MediaTextSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    kind: Type.String(),
    content: Type.String(),
    stepID: Type.Optional(T.Nullable(Type.String())),
    title: Type.String(),
},{ additionalProperties: false })

export const MediaTextRefs =[
    {"fromTable":"media_text","fromField":"stepID","toTable":"step","tofield":"id"}
]
export const MediaTextBackRefs =[

]

export const MediaTextFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    kind: {cid:3,name:'kind',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    content: {cid:4,name:'content',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    stepID: {cid:5,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    title: {cid:6,name:'title',type:'TEXT',notnull:1,dflt_value:"''",pk:0},
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
    absPath?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

    /** @default: null, sqlType: TEXT */
    filePath?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    url: string;

}

export type MediaVideo_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: MediaVideoID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    absPath?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

    /** @default: null, sqlType: TEXT */
    filePath?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    url: string;

}
export const MediaVideoSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    absPath: Type.Optional(T.Nullable(Type.String())),
    stepID: Type.Optional(T.Nullable(Type.String())),
    promptID: Type.Optional(T.Nullable(Type.String())),
    filePath: Type.Optional(T.Nullable(Type.String())),
    url: Type.String(),
},{ additionalProperties: false })

export const MediaVideoRefs =[
    {"fromTable":"media_video","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"},
    {"fromTable":"media_video","fromField":"stepID","toTable":"step","tofield":"id"}
]
export const MediaVideoBackRefs =[

]

export const MediaVideoFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    absPath: {cid:3,name:'absPath',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    stepID: {cid:4,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    promptID: {cid:5,name:'promptID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    filePath: {cid:6,name:'filePath',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    url: {cid:7,name:'url',type:'TEXT',notnull:1,dflt_value:null,pk:0},
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
    star?: Maybe<number>;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    promptNodeID?: Maybe<string>;

    /** @default: null, sqlType: INT */
    width: number;

    /** @default: null, sqlType: INT */
    height: number;

    /** @default: null, sqlType: INT */
    fileSize: number;

    /** @default: null, sqlType: TEXT */
    hash: string;

    /** @default: null, sqlType: TEXT */
    path: string;

    /** @default: null, sqlType: json */
    comfyUIInfos?: Maybe<T.MediaImage_comfyUIInfos>;

    /** @default: null, sqlType: TEXT */
    type?: Maybe<string>;

    /** @default: null, sqlType: INT */
    orientation?: Maybe<number>;

}

export type MediaImage_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: MediaImageID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: INT */
    star?: Maybe<number>;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    promptNodeID?: Maybe<string>;

    /** @default: null, sqlType: INT */
    width: number;

    /** @default: null, sqlType: INT */
    height: number;

    /** @default: null, sqlType: INT */
    fileSize: number;

    /** @default: null, sqlType: TEXT */
    hash: string;

    /** @default: null, sqlType: TEXT */
    path: string;

    /** @default: null, sqlType: json */
    comfyUIInfos?: Maybe<T.MediaImage_comfyUIInfos>;

    /** @default: null, sqlType: TEXT */
    type?: Maybe<string>;

    /** @default: null, sqlType: INT */
    orientation?: Maybe<number>;

}
export const MediaImageSchema = Type.Object({
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
},{ additionalProperties: false })

export const MediaImageRefs =[
    {"fromTable":"media_image","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"media_image","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"}
]
export const MediaImageBackRefs =[

]

export const MediaImageFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    star: {cid:3,name:'star',type:'INT',notnull:0,dflt_value:null,pk:0},
    promptID: {cid:4,name:'promptID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    stepID: {cid:5,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    promptNodeID: {cid:6,name:'promptNodeID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    width: {cid:7,name:'width',type:'INT',notnull:1,dflt_value:null,pk:0},
    height: {cid:8,name:'height',type:'INT',notnull:1,dflt_value:null,pk:0},
    fileSize: {cid:9,name:'fileSize',type:'INT',notnull:1,dflt_value:null,pk:0},
    hash: {cid:10,name:'hash',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    path: {cid:11,name:'path',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    comfyUIInfos: {cid:12,name:'comfyUIInfos',type:'json',notnull:0,dflt_value:null,pk:0},
    type: {cid:13,name:'type',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    orientation: {cid:14,name:'orientation',type:'INT',notnull:0,dflt_value:null,pk:0},
}


export const asMedia3dDisplacementID = (s: string): Media3dDisplacementID => s as any
export type Media3dDisplacementT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: Media3dDisplacementID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: INT */
    width?: Maybe<number>;

    /** @default: null, sqlType: INT */
    height?: Maybe<number>;

    /** @default: null, sqlType: TEXT */
    image?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    depthMap?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    normalMap?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

}

export type Media3dDisplacement_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: Media3dDisplacementID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: INT */
    width?: Maybe<number>;

    /** @default: null, sqlType: INT */
    height?: Maybe<number>;

    /** @default: null, sqlType: TEXT */
    image?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    depthMap?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    normalMap?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

}
export const Media3dDisplacementSchema = Type.Object({
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
},{ additionalProperties: false })

export const Media3dDisplacementRefs =[
    {"fromTable":"media_3d_displacement","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"},
    {"fromTable":"media_3d_displacement","fromField":"stepID","toTable":"step","tofield":"id"}
]
export const Media3dDisplacementBackRefs =[

]

export const Media3dDisplacementFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    width: {cid:3,name:'width',type:'INT',notnull:0,dflt_value:null,pk:0},
    height: {cid:4,name:'height',type:'INT',notnull:0,dflt_value:null,pk:0},
    image: {cid:5,name:'image',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    depthMap: {cid:6,name:'depthMap',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    normalMap: {cid:7,name:'normalMap',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    stepID: {cid:8,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    promptID: {cid:9,name:'promptID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
}


export const asRuntimeErrorID = (s: string): RuntimeErrorID => s as any
export type RuntimeErrorT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: RuntimeErrorID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    message: string;

    /** @default: null, sqlType: json */
    infos: T.RuntimeError_infos;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

    /** @default: null, sqlType: TEXT */
    graphID?: Maybe<GraphID>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

}

export type RuntimeError_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: RuntimeErrorID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    message: string;

    /** @default: null, sqlType: json */
    infos: T.RuntimeError_infos;

    /** @default: null, sqlType: TEXT */
    promptID?: Maybe<ComfyPromptID>;

    /** @default: null, sqlType: TEXT */
    graphID?: Maybe<GraphID>;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

}
export const RuntimeErrorSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    message: Type.String(),
    infos: T.RuntimeError_infos_Schema,
    promptID: Type.Optional(T.Nullable(Type.String())),
    graphID: Type.Optional(T.Nullable(Type.String())),
    stepID: Type.Optional(T.Nullable(Type.String())),
},{ additionalProperties: false })

export const RuntimeErrorRefs =[
    {"fromTable":"runtime_error","fromField":"stepID","toTable":"step","tofield":"id"},
    {"fromTable":"runtime_error","fromField":"graphID","toTable":"graph","tofield":"id"},
    {"fromTable":"runtime_error","fromField":"promptID","toTable":"comfy_prompt","tofield":"id"}
]
export const RuntimeErrorBackRefs =[

]

export const RuntimeErrorFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    message: {cid:3,name:'message',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    infos: {cid:4,name:'infos',type:'json',notnull:1,dflt_value:null,pk:0},
    promptID: {cid:5,name:'promptID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    graphID: {cid:6,name:'graphID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    stepID: {cid:7,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
}


export const asMediaSplatID = (s: string): MediaSplatID => s as any
export type MediaSplatT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: MediaSplatID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    url: string;

}

export type MediaSplat_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: MediaSplatID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    stepID?: Maybe<StepID>;

    /** @default: null, sqlType: TEXT */
    url: string;

}
export const MediaSplatSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    stepID: Type.Optional(T.Nullable(Type.String())),
    url: Type.String(),
},{ additionalProperties: false })

export const MediaSplatRefs =[
    {"fromTable":"media_splat","fromField":"stepID","toTable":"step","tofield":"id"}
]
export const MediaSplatBackRefs =[

]

export const MediaSplatFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    stepID: {cid:3,name:'stepID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    url: {cid:4,name:'url',type:'TEXT',notnull:1,dflt_value:null,pk:0},
}


export const asCustomDataID = (s: string): CustomDataID => s as any
export type CustomDataT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: CustomDataID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: "'{}'", sqlType: json */
    json: T.CustomData_json;

}

export type CustomData_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: CustomDataID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: "'{}'", sqlType: json */
    json?: T.CustomData_json;

}
export const CustomDataSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    json: T.CustomData_json_Schema,
},{ additionalProperties: false })

export const CustomDataRefs =[

]
export const CustomDataBackRefs =[

]

export const CustomDataFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    json: {cid:3,name:'json',type:'json',notnull:1,dflt_value:"'{}'",pk:0},
}


export const asCushyScriptID = (s: string): CushyScriptID => s as any
export type CushyScriptT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: CushyScriptID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    path: string;

    /** @default: null, sqlType: TEXT */
    code: string;

    /** @default: null, sqlType: INT */
    lastEvaluatedAt?: Maybe<number>;

    /** @default: null, sqlType: INT */
    lastSuccessfulEvaluationAt?: Maybe<number>;

    /** @default: null, sqlType: json */
    metafile?: Maybe<T.CushyScript_metafile>;

    /** @default: null, sqlType: INT */
    lastExtractedAt?: Maybe<number>;

}

export type CushyScript_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: CushyScriptID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    path: string;

    /** @default: null, sqlType: TEXT */
    code: string;

    /** @default: null, sqlType: INT */
    lastEvaluatedAt?: Maybe<number>;

    /** @default: null, sqlType: INT */
    lastSuccessfulEvaluationAt?: Maybe<number>;

    /** @default: null, sqlType: json */
    metafile?: Maybe<T.CushyScript_metafile>;

    /** @default: null, sqlType: INT */
    lastExtractedAt?: Maybe<number>;

}
export const CushyScriptSchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    path: Type.String(),
    code: Type.String(),
    lastEvaluatedAt: Type.Optional(T.Nullable(Type.Number())),
    lastSuccessfulEvaluationAt: Type.Optional(T.Nullable(Type.Number())),
    metafile: Type.Optional(T.Nullable(T.CushyScript_metafile_Schema)),
    lastExtractedAt: Type.Optional(T.Nullable(Type.Number())),
},{ additionalProperties: false })

export const CushyScriptRefs =[

]
export const CushyScriptBackRefs =[
    {"fromTable":"cushy_app","fromField":"scriptID","toTable":"cushy_script","tofield":"id"}
]

export const CushyScriptFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    path: {cid:3,name:'path',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    code: {cid:4,name:'code',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    lastEvaluatedAt: {cid:5,name:'lastEvaluatedAt',type:'INT',notnull:0,dflt_value:null,pk:0},
    lastSuccessfulEvaluationAt: {cid:6,name:'lastSuccessfulEvaluationAt',type:'INT',notnull:0,dflt_value:null,pk:0},
    metafile: {cid:7,name:'metafile',type:'json',notnull:0,dflt_value:null,pk:0},
    lastExtractedAt: {cid:8,name:'lastExtractedAt',type:'INT',notnull:0,dflt_value:null,pk:0},
}


export const asCushyAppID = (s: string): CushyAppID => s as any
export type CushyAppT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: CushyAppID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    guid?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    scriptID: CushyScriptID;

    /** @default: null, sqlType: TEXT */
    name?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    illustration?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    description?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    tags?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    publishedAsUserID?: Maybe<string>;

    /** @default: null, sqlType: INT */
    publishedAt?: Maybe<number>;

    /** @default: "0", sqlType: INT */
    isFavorite: number;

    /** @default: null, sqlType: INT */
    canStartFromImage?: Maybe<number>;

}

export type CushyApp_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: CushyAppID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    guid?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    scriptID: CushyScriptID;

    /** @default: null, sqlType: TEXT */
    name?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    illustration?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    description?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    tags?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    publishedAsUserID?: Maybe<string>;

    /** @default: null, sqlType: INT */
    publishedAt?: Maybe<number>;

    /** @default: "0", sqlType: INT */
    isFavorite?: number;

    /** @default: null, sqlType: INT */
    canStartFromImage?: Maybe<number>;

}
export const CushyAppSchema = Type.Object({
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
},{ additionalProperties: false })

export const CushyAppRefs =[
    {"fromTable":"cushy_app","fromField":"scriptID","toTable":"cushy_script","tofield":"id"}
]
export const CushyAppBackRefs =[
    {"fromTable":"draft","fromField":"appID","toTable":"cushy_app","tofield":"id"},
    {"fromTable":"step","fromField":"appID","toTable":"cushy_app","tofield":"id"}
]

export const CushyAppFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    guid: {cid:3,name:'guid',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    scriptID: {cid:4,name:'scriptID',type:'TEXT',notnull:1,dflt_value:null,pk:0},
    name: {cid:5,name:'name',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    illustration: {cid:6,name:'illustration',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    description: {cid:7,name:'description',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    tags: {cid:8,name:'tags',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    publishedAsUserID: {cid:9,name:'publishedAsUserID',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    publishedAt: {cid:10,name:'publishedAt',type:'INT',notnull:0,dflt_value:null,pk:0},
    isFavorite: {cid:11,name:'isFavorite',type:'INT',notnull:1,dflt_value:'0',pk:0},
    canStartFromImage: {cid:12,name:'canStartFromImage',type:'INT',notnull:0,dflt_value:null,pk:0},
}


export const asAuthID = (s: string): AuthID => s as any
export type AuthT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: AuthID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: TEXT */
    provider_token?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    refresh_token?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    token_type?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    access_token?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    provider_refresh_token?: Maybe<string>;

    /** @default: null, sqlType: INT */
    expires_at?: Maybe<number>;

    /** @default: null, sqlType: INT */
    expires_in?: Maybe<number>;

}

export type Auth_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: AuthID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: TEXT */
    provider_token?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    refresh_token?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    token_type?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    access_token?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    provider_refresh_token?: Maybe<string>;

    /** @default: null, sqlType: INT */
    expires_at?: Maybe<number>;

    /** @default: null, sqlType: INT */
    expires_in?: Maybe<number>;

}
export const AuthSchema = Type.Object({
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
},{ additionalProperties: false })

export const AuthRefs =[

]
export const AuthBackRefs =[

]

export const AuthFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    provider_token: {cid:3,name:'provider_token',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    refresh_token: {cid:4,name:'refresh_token',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    token_type: {cid:5,name:'token_type',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    access_token: {cid:6,name:'access_token',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    provider_refresh_token: {cid:7,name:'provider_refresh_token',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    expires_at: {cid:8,name:'expires_at',type:'INT',notnull:0,dflt_value:null,pk:0},
    expires_in: {cid:9,name:'expires_in',type:'INT',notnull:0,dflt_value:null,pk:0},
}


export const asTreeEntryID = (s: string): TreeEntryID => s as any
export type TreeEntryT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: TreeEntryID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: null, sqlType: INT */
    isExpanded?: Maybe<number>;

}

export type TreeEntry_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: TreeEntryID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: null, sqlType: INT */
    isExpanded?: Maybe<number>;

}
export const TreeEntrySchema = Type.Object({
    id: Type.String(),
    createdAt: Type.Number(),
    updatedAt: Type.Number(),
    isExpanded: Type.Optional(T.Nullable(Type.Number())),
},{ additionalProperties: false })

export const TreeEntryRefs =[

]
export const TreeEntryBackRefs =[

]

export const TreeEntryFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    isExpanded: {cid:3,name:'isExpanded',type:'INT',notnull:0,dflt_value:null,pk:0},
}


export const asHostID = (s: string): HostID => s as any
export type HostT = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id: HostID;

    /** @default: "now", sqlType: INTEGER */
    createdAt: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt: number;

    /** @default: "hex(randomblob(16))", sqlType: TEXT */
    name: string;

    /** @default: "\"localhost\"", sqlType: TEXT */
    hostname: string;

    /** @default: "8188", sqlType: INT */
    port: number;

    /** @default: "0", sqlType: INT */
    useHttps: number;

    /** @default: "0", sqlType: INT */
    isLocal: number;

    /** @default: null, sqlType: TEXT */
    absolutePathToComfyUI?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    absolutPathToDownloadModelsTo?: Maybe<string>;

    /** @default: "0", sqlType: INT */
    isVirtual: number;

    /** @default: "0", sqlType: INT */
    isReadonly: number;

}

export type Host_C = {
    /** @default: "hex(randomblob(16))", sqlType: string */
    id?: HostID;

    /** @default: "now", sqlType: INTEGER */
    createdAt?: number;

    /** @default: "now", sqlType: INTEGER */
    updatedAt?: number;

    /** @default: "hex(randomblob(16))", sqlType: TEXT */
    name?: string;

    /** @default: "\"localhost\"", sqlType: TEXT */
    hostname?: string;

    /** @default: "8188", sqlType: INT */
    port?: number;

    /** @default: "0", sqlType: INT */
    useHttps?: number;

    /** @default: "0", sqlType: INT */
    isLocal?: number;

    /** @default: null, sqlType: TEXT */
    absolutePathToComfyUI?: Maybe<string>;

    /** @default: null, sqlType: TEXT */
    absolutPathToDownloadModelsTo?: Maybe<string>;

    /** @default: "0", sqlType: INT */
    isVirtual?: number;

    /** @default: "0", sqlType: INT */
    isReadonly?: number;

}
export const HostSchema = Type.Object({
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
},{ additionalProperties: false })

export const HostRefs =[

]
export const HostBackRefs =[
    {"fromTable":"comfy_schema","fromField":"hostID","toTable":"host","tofield":"id"}
]

export const HostFields = {
    id: {cid:0,name:'id',type:'string',notnull:1,dflt_value:'hex(randomblob(16))',pk:1},
    createdAt: {cid:1,name:'createdAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    updatedAt: {cid:2,name:'updatedAt',type:'INTEGER',notnull:1,dflt_value:'now',pk:0},
    name: {cid:3,name:'name',type:'TEXT',notnull:1,dflt_value:'hex(randomblob(16))',pk:0},
    hostname: {cid:4,name:'hostname',type:'TEXT',notnull:1,dflt_value:'"localhost"',pk:0},
    port: {cid:5,name:'port',type:'INT',notnull:1,dflt_value:'8188',pk:0},
    useHttps: {cid:6,name:'useHttps',type:'INT',notnull:1,dflt_value:'0',pk:0},
    isLocal: {cid:7,name:'isLocal',type:'INT',notnull:1,dflt_value:'0',pk:0},
    absolutePathToComfyUI: {cid:8,name:'absolutePathToComfyUI',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    absolutPathToDownloadModelsTo: {cid:9,name:'absolutPathToDownloadModelsTo',type:'TEXT',notnull:0,dflt_value:null,pk:0},
    isVirtual: {cid:10,name:'isVirtual',type:'INT',notnull:1,dflt_value:'0',pk:0},
    isReadonly: {cid:11,name:'isReadonly',type:'INT',notnull:1,dflt_value:'0',pk:0},
}


export const schemas = {
    migrations: new T.TableInfo(
        'migrations',
        'Migrations',
        MigrationsFields,
        MigrationsSchema,
        MigrationsRefs,
        MigrationsBackRefs,
    ),
    users: new T.TableInfo(
        'users',
        'Users',
        UsersFields,
        UsersSchema,
        UsersRefs,
        UsersBackRefs,
    ),
    graph: new T.TableInfo(
        'graph',
        'Graph',
        GraphFields,
        GraphSchema,
        GraphRefs,
        GraphBackRefs,
    ),
    draft: new T.TableInfo(
        'draft',
        'Draft',
        DraftFields,
        DraftSchema,
        DraftRefs,
        DraftBackRefs,
    ),
    project: new T.TableInfo(
        'project',
        'Project',
        ProjectFields,
        ProjectSchema,
        ProjectRefs,
        ProjectBackRefs,
    ),
    step: new T.TableInfo(
        'step',
        'Step',
        StepFields,
        StepSchema,
        StepRefs,
        StepBackRefs,
    ),
    comfy_prompt: new T.TableInfo(
        'comfy_prompt',
        'ComfyPrompt',
        ComfyPromptFields,
        ComfyPromptSchema,
        ComfyPromptRefs,
        ComfyPromptBackRefs,
    ),
    comfy_schema: new T.TableInfo(
        'comfy_schema',
        'ComfySchema',
        ComfySchemaFields,
        ComfySchemaSchema,
        ComfySchemaRefs,
        ComfySchemaBackRefs,
    ),
    media_text: new T.TableInfo(
        'media_text',
        'MediaText',
        MediaTextFields,
        MediaTextSchema,
        MediaTextRefs,
        MediaTextBackRefs,
    ),
    media_video: new T.TableInfo(
        'media_video',
        'MediaVideo',
        MediaVideoFields,
        MediaVideoSchema,
        MediaVideoRefs,
        MediaVideoBackRefs,
    ),
    media_image: new T.TableInfo(
        'media_image',
        'MediaImage',
        MediaImageFields,
        MediaImageSchema,
        MediaImageRefs,
        MediaImageBackRefs,
    ),
    media_3d_displacement: new T.TableInfo(
        'media_3d_displacement',
        'Media3dDisplacement',
        Media3dDisplacementFields,
        Media3dDisplacementSchema,
        Media3dDisplacementRefs,
        Media3dDisplacementBackRefs,
    ),
    runtime_error: new T.TableInfo(
        'runtime_error',
        'RuntimeError',
        RuntimeErrorFields,
        RuntimeErrorSchema,
        RuntimeErrorRefs,
        RuntimeErrorBackRefs,
    ),
    media_splat: new T.TableInfo(
        'media_splat',
        'MediaSplat',
        MediaSplatFields,
        MediaSplatSchema,
        MediaSplatRefs,
        MediaSplatBackRefs,
    ),
    custom_data: new T.TableInfo(
        'custom_data',
        'CustomData',
        CustomDataFields,
        CustomDataSchema,
        CustomDataRefs,
        CustomDataBackRefs,
    ),
    cushy_script: new T.TableInfo(
        'cushy_script',
        'CushyScript',
        CushyScriptFields,
        CushyScriptSchema,
        CushyScriptRefs,
        CushyScriptBackRefs,
    ),
    cushy_app: new T.TableInfo(
        'cushy_app',
        'CushyApp',
        CushyAppFields,
        CushyAppSchema,
        CushyAppRefs,
        CushyAppBackRefs,
    ),
    auth: new T.TableInfo(
        'auth',
        'Auth',
        AuthFields,
        AuthSchema,
        AuthRefs,
        AuthBackRefs,
    ),
    tree_entry: new T.TableInfo(
        'tree_entry',
        'TreeEntry',
        TreeEntryFields,
        TreeEntrySchema,
        TreeEntryRefs,
        TreeEntryBackRefs,
    ),
    host: new T.TableInfo(
        'host',
        'Host',
        HostFields,
        HostSchema,
        HostRefs,
        HostBackRefs,
    ),
}