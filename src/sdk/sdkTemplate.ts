export const sdkTemplate: string = `/// <reference path="nodes.d.ts" />


declare module "core-shared/Workflow" {
    export class Workflow {
    }
}
declare module "core-types/ComfyPrompt" {
    export type ComfyPromptJSON = {
        [key: string]: ComfyNodeJSON;
    };
    export type ComfyNodeJSON = {
        inputs: {
            [key: string]: any;
        };
        class_type: string;
    };
}
declare module "core-types/NodeUID" {
    export type ComfyNodeUID = string;
}
declare module "core-types/ComfyWsPayloads" {
    import type { ComfyNodeUID } from "core-types/NodeUID";
    export type ApiPromptInput = {
        client_id: string;
        extra_data: {
            extra_pnginfo: any;
        };
        prompt: any;
    };
    export type WsMsg = WsMsgStatus | WsMsgProgress | WsMsgExecuting | WsMsgExecuted;
    export type WsMsgStatus = {
        type: 'status';
        data: {
            sid?: string;
            status: ComfyStatus;
        };
    };
    export type WsMsgProgress = {
        type: 'progress';
        data: NodeProgress;
    };
    export type WsMsgExecuting = {
        type: 'executing';
        data: {
            node: ComfyNodeUID;
        };
    };
    export type WsMsgExecuted = {
        type: 'executed';
        data: WsMsgExecutedData;
    };
    export type WsMsgExecutedData = {
        node: ComfyNodeUID;
        output: {
            images: ComfyImageInfo[];
        };
    };
    export type ComfyImageInfo = {
        filename: string;
        subfolder: string;
        type: string;
    };
    export type NodeProgress = {
        value: number;
        max: number;
    };
    export type ComfyStatus = {
        exec_info: {
            queue_remaining: number;
        };
        sid: string;
    };
    export type ComfyUploadImageResult = {
        name: string;
    };
}
declare module "ui/VisUI" {
    type Node = any;
    type Edge = any;
    type Options = any;
    export type VisNodes = any;
    export type VisEdges = any;
    export type VisOptions = any;
}
declare module "utils/types" {
    /** usefull to catch most *units* type errors */
    export type Tagged<O, Tag> = O & {
        __tag?: Tag;
    };
    /** same as Tagged, but even scriter */
    export type Branded<O, Brand> = O & {
        __brand: Brand;
    };
    export type Maybe<T> = T | null | undefined;
}
declare module "utils/ComfyUtils" {
    export const exhaust: (x: never) => never;
    export const sleep: (ms: number) => Promise<unknown>;
    export const deepCopyNaive: <T>(x: T) => T;
}
declare module "core-types/ComfySchemaJSON" {
    /** type of the file sent by the backend at /object_info */
    export type ComfySchemaJSON = {
        [nodeTypeName: string]: ComfyNodeSchemaJSON;
    };
    export type ComfyNodeSchemaJSON = {
        input: {
            required: {
                [inputName: string]: ComfyInputSpec;
            };
            optional: {
                [inputName: string]: ComfyInputSpec;
            };
        };
        output: string[];
        name: string;
        description: string;
        category: string;
    };
    export type ComfyInputSpec = [ComfyInputType] | [ComfyInputType, ComfyInputOpts];
    export type ComfyInputType = 
    /** node name or primitive */
    string
    /** enum */
     | string[];
    export type ComfyInputOpts = {
        multiline?: boolean;
        default?: boolean | number | string;
        min?: number;
        max?: number;
        step?: number;
    };
}
declare module "utils/CodeBuffer" {
    /** this class is used to buffer text and then write it to a file */
    export class CodeBuffer {
        private _indent;
        constructor(_indent?: number, lines?: string[]);
        tab: string;
        content: string;
        append: (str: string) => string;
        writeLine: (txt: string) => this;
        w: (txt: string, opts?: {
            if: boolean;
        }) => void;
        newLine: () => string;
        line: (...txts: string[]) => this;
        indent: () => number;
        deindent: () => number;
        indented: (fn: () => void) => void;
        bar: (text: string) => void;
    }
    export const repeatStr: (x: number, str: string) => string;
    export const renderBar: (text: string, prefix?: string) => string;
}
declare module "core-shared/Primitives" {
    export const ComfyPrimitiveMapping: {
        [key: string]: string;
    };
    export const ComfyPrimitives: string[];
}
declare module "core-shared/normalizeJSIdentifier" {
    export const normalizeJSIdentifier: (name: string) => string;
}
declare module "core-shared/Schema" {
    import type { ComfyInputOpts, ComfySchemaJSON } from "core-types/ComfySchemaJSON";
    import type { Branded, Maybe } from "utils/types";
    export type EnumHash = string;
    export type EnumName = string;
    export type NodeNameInComfy = string;
    export type NodeNameInCushy = string;
    export type EmbeddingName = Branded<string, 'Embedding'>;
    export type NodeInputExt = {
        name: string;
        type: string;
        opts?: ComfyInputOpts;
        isPrimitive: boolean;
        required: boolean;
        index: number;
    };
    export type NodeOutputExt = {
        type: string;
        name: string;
        isPrimitive: boolean;
    };
    export type EnumValue = string | boolean | number;
    export class Schema {
        spec: ComfySchemaJSON;
        embeddings: EmbeddingName[];
        getLoraHierarchy: () => string[];
        getLoras: () => string[];
        knownTypes: Set<string>;
        knownEnumsByName: Map<string, EnumValue[]>;
        knownEnumsByHash: Map<string, {
            enumNameInComfy: string;
            enumNameInCushy: EnumName;
            values: EnumValue[];
            aliases: string[];
        }>;
        nodes: ComfyNodeSchema[];
        nodesByNameInComfy: {
            [key: string]: ComfyNodeSchema;
        };
        nodesByNameInCushy: {
            [key: string]: ComfyNodeSchema;
        };
        nodesByProduction: {
            [key: string]: NodeNameInCushy[];
        };
        constructor(spec: ComfySchemaJSON, embeddings: EmbeddingName[]);
        update(spec: ComfySchemaJSON, embeddings: EmbeddingName[]): void;
        codegenDTS: (useLocalPath?: boolean) => string;
        private toTSType;
    }
    export class ComfyNodeSchema {
        nameInComfy: string;
        nameInCushy: string;
        category: string;
        inputs: NodeInputExt[];
        outputs: NodeOutputExt[];
        /** list of types the node has a single output of */
        singleOuputs: NodeOutputExt[];
        constructor(nameInComfy: string, nameInCushy: string, category: string, inputs: NodeInputExt[], outputs: NodeOutputExt[]);
        codegen(): string;
        renderOpts(opts?: ComfyInputOpts): Maybe<string>;
    }
    export const wrapQuote: (s: string) => string;
}
declare module "core-shared/Slot" {
    import type { ComfyNode } from "core-shared/Node";
    export class Slot<T, Ix extends number = number> {
        node: ComfyNode<any>;
        slotIx: Ix;
        type: T;
        constructor(node: ComfyNode<any>, slotIx: Ix, type: T);
    }
}
declare module "core-shared/Colors" {
    export const comfyColors: {
        [category: string]: string;
    };
}
declare module "core-shared/autoValue" {
    import type { Branded } from "utils/types";
    /**
     * a fake value that is detected at serialization
     * time to try to magically inject stuff
     * */
    export type AUTO = Branded<{
        ___AUTO___: true;
    }, 'AUTO'>;
    /**
     * you can use this as a placeholder anywhere in your graph
     * Cushy will try to find some node slot recently created that can be used to fill the gap
     */
    export const auto: <T>() => T;
    export const auto_: AUTO;
}
declare module "core-shared/Printable" {
    import { ComfyNode } from "core-shared/Node";
    export type Printable = string | number | boolean | ComfyNode<any>;
}
declare module "logger/LogTypes" {
    import { Printable } from "core-shared/Printable";
    export interface ILogger {
        debug(...message: Printable[]): void;
        info(...message: Printable[]): void;
        warn(...message: Printable[]): void;
        error(...message: Printable[]): void;
    }
    export interface LogMessage {
        level: LogLevel;
        message: string;
        timestamp: Date;
    }
    export enum LogLevel {
        DEBUG = 0,
        INFO = 1,
        WARN = 2,
        ERROR = 3
    }
}
declare module "logger/logger" {
    import type { ILogger } from "logger/LogTypes";
    export const ref: {
        value?: ILogger;
    };
    export const logger: () => ILogger;
    export const registerLogger: (logger: ILogger) => void;
}
declare module "core-shared/Node" {
    import type { ComfyNodeJSON } from "core-types/ComfyPrompt";
    import type { NodeProgress, WsMsgExecutedData } from "core-types/ComfyWsPayloads";
    import type { Graph } from "core-shared/Graph";
    import { ComfyNodeUID } from "core-types/NodeUID";
    import { ComfyNodeSchema } from "core-shared/Schema";
    import { Slot } from "core-shared/Slot";
    /** ComfyNode
     * - correspond to a signal in the graph
     * - belongs to a script
     */
    export class ComfyNode<ComfyNode_input extends object> {
        graph: Graph;
        uid: string;
        artifacts: WsMsgExecutedData[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        status: 'executing' | 'done' | 'error' | 'waiting' | null;
        get isExecuting(): boolean;
        get statusEmoji(): "" | "🔥" | "✅" | "❌" | "⏳";
        disabled: boolean;
        disable(): void;
        get inputs(): ComfyNode_input;
        json: ComfyNodeJSON;
        /** update a node */
        set(p: Partial<ComfyNode_input>): void;
        get color(): string;
        uidNumber: number;
        $outputs: Slot<any>[];
        constructor(graph: Graph, uid: string, jsonExt: ComfyNodeJSON);
        _convertPromptExtToPrompt(promptExt: ComfyNodeJSON): {
            class_type: string;
            inputs: {
                [inputName: string]: any;
            };
        };
        /** return the list of nodes piped into this node */
        _incomingNodes(): string[];
        _incomingEdges(): {
            from: ComfyNodeUID;
            inputName: string;
        }[];
        get width(): number;
        get height(): number;
        serializeValue(field: string, value: unknown): unknown;
        private _getExpecteTypeForField;
        private _getOutputForTypeOrCrash;
        private _getOutputForTypeOrNull;
    }
}
declare module "core-shared/AutolayoutV1" {
    
    import { Graph } from "core-shared/Graph";
    import { ComfyNode } from "core-shared/Node";
    export class Cyto {
        graph: Graph;
        cy: any;
        constructor(graph: Graph);
        at: number;
        addEdge: (edge: {
            sourceUID: string;
            targetUID: string;
            input: string;
        }) => void;
        removeEdge: (id: string) => void;
        trackNode: (node: ComfyNode<any>) => void;
        animate: () => object;
    }
}
declare module "core-shared/Graph" {
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { WsMsgExecuting, WsMsgProgress } from "core-types/ComfyWsPayloads";
    import type { ComfyNodeUID } from "core-types/NodeUID";
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import type { Cyto } from "core-shared/AutolayoutV1";
    import { ComfyNode } from "core-shared/Node";
    import { Schema } from "core-shared/Schema";
    export type RunMode = 'fake' | 'real';
    /**
     * graph abstraction
     * - holds the nodes
     * - holds the cyto graph
     * - can be instanciated in both extension and webview
     *   - so no link to workspace or run
     */
    export class Graph {
        schema: Schema;
        /** graph uid */
        uid: string;
        /** cytoscape instance to live update graph */
        cyto?: Cyto;
        /** @internal every node constructor must call this */
        registerNode: (node: ComfyNode<any>) => void;
        reset: () => void;
        /** nodes, in creation order */
        nodes: ComfyNode<any>[];
        /** nodes, indexed by nodeID */
        nodesIndex: Map<string, ComfyNode<any>>;
        /** convert to mermaid DSL expression for nice graph rendering */
        toMermaid: () => string;
        /** return the coresponding comfy prompt  */
        get jsonForPrompt(): ComfyPromptJSON;
        /** temporary proxy */
        /** @internal pointer to the currently executing node */
        currentExecutingNode: ComfyNode<any> | null;
        /** @internal update the progress value of the currently focused onde */
        onProgress: (msg: WsMsgProgress) => void;
        /** @internal update pointer to the currently executing node */
        onExecuting: (msg: WsMsgExecuting) => void;
        constructor(schema: Schema, json?: ComfyPromptJSON);
        private _nextUID;
        getUID: () => string;
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        /** all images generated by nodes in this graph */
        /** wether it should really send the prompt to the backend */
        /** visjs JSON format (network visualisation) */
        get JSON_forVisDataVisualisation(): {
            nodes: VisNodes[];
            edges: VisEdges[];
        };
    }
}
declare module "core-back/LATER.foo" {
    export type LATER<T> = any;
}
declare module "core-shared/b64img" {
    import type { Branded } from "utils/types";
    export type Base64Image = Branded<string, 'Base64Image'>;
}
declare module "core-shared/WorkflowFn" {
    import type * as CUSHY_RUNTIME from 'CUSHY_RUNTIME'
    import type { Presets } from "presets/presets";
    import type { Graph } from "core-shared/Graph";
    import type { Workflow } from "core-shared/Workflow";
    export type WorkflowType = (title: string, builder: WorkflowBuilderFn) => Workflow;
    export type WorkflowBuilder = {
        graph: CUSHY_RUNTIME.ComfySetup & Graph;
        flow: import("sdk/IFlowExecution").IFlowExecution;
        presets: Presets;
        AUTO: <T>() => T;
        stage: 'TODO';
        openpose: 'TODO';
    };
    export type WorkflowBuilderFn = (p: WorkflowBuilder) => Promise<any>;
}
declare module "presets/presets" {
    /**
     * this module must not import anything from src/core-back
     * the LATER type is used to reference types that may or may not be available on users machines, depending
     * on the node suite they have setup
     */
    import type * as CUSHY_RUNTIME from 'CUSHY_RUNTIME'
    import type { WorkflowBuilder } from "core-shared/WorkflowFn";
    export type SimplifiedLoraDef = {
        name: CUSHY_RUNTIME.Enum_LoraLoader_lora_name;
        /** defaults to 1 */
        strength_clip?: number;
        /** defaults to 1 */
        strength_model?: number;
    };
    /** high level library */
    export class Presets {
        ctx: WorkflowBuilder;
        constructor(ctx: WorkflowBuilder);
        prompt: (pos: string, neg: string) => any;
        loadModel: (p: {
            ckptName: CUSHY_RUNTIME.Enum_CheckpointLoader_ckpt_name;
            stop_at_clip_layer?: number;
            vae?: CUSHY_RUNTIME.Enum_VAELoader_vae_name;
            loras?: SimplifiedLoraDef[];
            /**
             * makes the model faster at the cost of quality.
             * I was told it can speed up generation by up to 1.5x
             * default to false
             * suggested values: (thanks @kdc_th)
             * - 0.3 if you have a good gpu. it barely affects the quality while still giving you a speed increase
             * - 0.5-0.6 is still serviceable
             */
            tomeRatio?: number | false;
        }) => {
            ckpt: CUSHY_RUNTIME.CheckpointLoaderSimple;
            clip: CUSHY_RUNTIME.CLIP;
            model: CUSHY_RUNTIME.MODEL;
            vae: CUSHY_RUNTIME.VAE;
        };
        basicImageGeneration: (p: {
            ckptName: CUSHY_RUNTIME.Enum_CheckpointLoader_ckpt_name;
            loras?: SimplifiedLoraDef[];
            positive: string;
            negative: string;
            /** width, defaults to 768 */
            width?: number;
            /** heiht, defaults to 512 */
            height?: number;
            /** defaults to 1 */
            batchSize?: number;
            /** defaults to 30 */
            steps?: number;
            /** defaults to 10 */
            cfg?: number;
            /** defaults to 'euler_ancestral' */
            sampler_name?: CUSHY_RUNTIME.Enum_KSampler_sampler_name;
            /** defaults to 'karras' */
            scheduler?: CUSHY_RUNTIME.Enum_KSampler_scheduler;
            /** defaults to 1 */
            denoise?: number;
        }) => Promise<{
            ckpt: any;
            latent: any;
            positive: any;
            negative: any;
            sampler: any;
            image: any;
        }>;
    }
}
declare module "controls/BUG" {
    export class BUG {
    }
}
declare module "controls/askv2" {
    /**
     * This module implements is the early-days core of
     * the cushy form-framework
     * 🔶 design is a bit unusual because of the very specific needs of the project
     * TODO: write them down to explain choices
     */
    import type { Base64Image } from "core-shared/b64img";
    import type { SimplifiedLoraDef } from "presets/presets";
    import type { Maybe, Tagged } from "utils/types";
    import { BUG } from "controls/BUG";
    export type Requestable = {
        label?: string;
    } & Requestable_;
    export type Requestable_ = 
    /** str */
    {
        type: 'str';
    } | {
        type: 'str?';
    }
    /** nums */
     | {
        type: 'int';
    } | {
        type: 'int?';
    }
    /** bools */
     | {
        type: 'bool';
    } | {
        type: 'bool?';
    }
    /** embedding */
     | {
        type: 'embeddings';
    }
    /** loras */
     | {
        type: 'lora';
    } | {
        type: 'loras';
    }
    /** painting */
     | {
        type: 'samMaskPoints';
        url: string;
    } | {
        type: 'selectImage';
        urls: string[];
    } | {
        type: 'manualMask';
        url: string;
    } | {
        type: 'paint';
        url: string;
    }
    /** group */
     | {
        type: 'items';
        items: {
            [key: string]: Requestable;
        };
    }
    /** select one */
     | {
        type: 'selectOne';
        choices: string[];
    } | {
        type: 'selectOneOrCustom';
        choices: string[];
    }
    /** select many */
     | {
        type: 'selectMany';
        choices: string[];
    } | {
        type: 'selectManyOrCustom';
        choices: string[];
    }
    /** array */
     | Requestable[]
    /** ?? */
     | BUG;
    export type SamPointPosStr = Tagged<string, 'SamPointPosStr'>;
    export type SamPointLabelsStr = Tagged<string, 'SamPointLabelsStr'>;
    export type InfoAnswer<Req> = 
    /** str */
    Req extends {
        type: 'str';
    } ? string : Req extends {
        type: 'str?';
    } ? Maybe<string> : 
    /** nums */
    Req extends {
        type: 'int';
    } ? number : Req extends {
        type: 'int?';
    } ? Maybe<number> : 
    /** bools */
    Req extends {
        type: 'bool';
    } ? boolean : Req extends {
        type: 'bool?';
    } ? Maybe<boolean> : 
    /** embedding */
    Req extends {
        type: 'embeddings';
    } ? Maybe<boolean> : 
    /** loras */
    Req extends {
        type: 'lora';
    } ? SimplifiedLoraDef : Req extends {
        type: 'loras';
    } ? SimplifiedLoraDef[] : 
    /** painting */
    Req extends {
        type: 'samMaskPoints';
    } ? {
        points: SamPointPosStr;
        labels: SamPointLabelsStr;
    } : Req extends {
        type: 'manualMask';
    } ? Base64Image : Req extends {
        type: 'paint';
    } ? Base64Image : 
    /** group */
    Req extends {
        type: 'items';
        items: {
            [key: string]: any;
        };
    } ? {
        [key in keyof Req['items']]: InfoAnswer<Req['items'][key]>;
    } : 
    /** select one */
    Req extends {
        type: 'selectOne';
        choices: infer T;
    } ? (T extends readonly any[] ? T[number] : T) : Req extends {
        type: 'selectOneOrCustom';
        choices: string[];
    } ? string : 
    /** select many */
    Req extends {
        type: 'selectMany';
        choices: infer T;
    } ? (T extends readonly any[] ? T[number][] : T) : Req extends {
        type: 'selectManyOrCustom';
        choices: string[];
    } ? string[] : 
    /** array */
    Req extends readonly [infer X, ...infer Rest] ? [InfoAnswer<X>, ...InfoAnswer<Rest>[]] : never;
    export class InfoRequestBuilder {
        /** str */
        str: (label?: string) => {
            type: "str";
            label: string | undefined;
        };
        strOpt: (label?: string) => {
            type: "str?";
            label: string | undefined;
        };
        /** nums */
        int: (label?: string) => {
            type: "int";
            label: string | undefined;
        };
        intOpt: (label?: string) => {
            type: "int?";
            label: string | undefined;
        };
        /** bools */
        bool: (label?: string) => {
            type: "bool";
            label: string | undefined;
        };
        boolOpt: (label?: string) => {
            type: "bool?";
            label: string | undefined;
        };
        /** embedding */
        embeddings: (label?: string) => {
            type: "embeddings";
            label: string | undefined;
        };
        /** loras */
        lora: (label?: string) => {
            type: "lora";
            label: string | undefined;
        };
        loras: (label?: string) => {
            type: "loras";
            label: string | undefined;
        };
        /** painting */
        samMaskPoints: (label: string, url: string) => {
            type: "samMaskPoints";
            label: string;
            url: string;
        };
        selectImage: (label: string, urls: string[]) => {
            type: "selectImage";
            label: string;
            urls: string[];
        };
        manualMask: (label: string, url: string) => {
            type: "manualMask";
            label: string;
            url: string;
        };
        paint: (label: string, url: string) => {
            type: "paint";
            label: string;
            url: string;
        };
        /** group */
        group: <const T>(label: string, items: T) => {
            type: 'items';
            items: T;
        };
        /** select one */
        selectOne: <const T>(label: string, choices: T) => {
            type: 'selectOne';
            choices: T;
        };
        selectOneOrCustom: (label: string, choices: string[]) => {
            type: 'selectOneOrCustom';
            choices: string[];
        };
        /** select many */
        selectMany: <const T>(label: string, choices: T) => {
            type: 'selectMany';
            choices: T;
        };
        selectManyOrCustom: (label: string, choices: string[]) => {
            type: 'selectManyOrCustom';
            choices: string[];
        };
    }
    export type InfoRequestFn = typeof fakeInfoRequestFn;
    export const fakeInfoRequestFn: <const Req extends {
        [key: string]: Requestable;
    }>(req: (q: InfoRequestBuilder) => Req, layout?: 0) => Promise<{ [key in keyof Req]: InfoAnswer<Req[key]>; }>;
}
declare module "core-shared/ParamDef" {
    export type ParamType = 'string' | 'number';
    export type ParamT<Kind extends string, Type extends any> = {
        kind: Kind;
        name: string;
        default: Type | (() => Type);
        /** used as header */
        group?: string;
    };
    export type FlowParam = ParamT<'string', string> | ParamT<'number', number> | ParamT<'boolean', boolean> | ParamT<'strings', string[]> | ParamT<'image', string>;
}
declare module "utils/fs/BrandedPaths" {
    import type { Branded } from "utils/types";
    export type RelativePath = Branded<string, 'WorkspaceRelativePath'>;
    export type AbsolutePath = Branded<string, 'Absolute'>;
}
declare module "utils/markdown" {
    import type { Branded } from "utils/types";
    export type MDContent = Branded<string, 'MDContent'>;
    export type HTMLContent = Branded<string, 'HTML'>;
    export const asMDContent: (s: string) => MDContent;
    export const asHTMLContent: (s: string) => HTMLContent;
}
declare module "wildcards/wildcards" {
    export type Wildcards = {
        '3d_term': string[];
        actors: string[];
        actress: string[];
        adj_architecture: string[];
        adj_beauty: string[];
        adj_general: string[];
        adj_horror: string[];
        alien: string[];
        angel: string[];
        animal: string[];
        artist_anime: string[];
        'artist_black-white': string[];
        artist_botanical: string[];
        artist_c: string[];
        artist_cartoon: string[];
        artist_csv: string[];
        artist_dig1: string[];
        artist_dig2: string[];
        artist_dig3: string[];
        artist_fantasy: string[];
        artist_fareast: string[];
        artist_fineart: string[];
        artist_horror: string[];
        artist_n: string[];
        artist_nudity: string[];
        artist_scifi: string[];
        artist_scribbles: string[];
        artist_special: string[];
        artist_surreal: string[];
        artist_ukioe: string[];
        artist_weird: string[];
        artist: string[];
        artist_concept: string[];
        artist_director: string[];
        artist_photographer: string[];
        aspect_ratio: string[];
        background_color: string[];
        background: string[];
        bangs: string[];
        bdsm_type: string[];
        bdsm: string[];
        belt: string[];
        biome: string[];
        bird: string[];
        blonde: string[];
        body_fit: string[];
        body_heavy: string[];
        body_light: string[];
        body_poor: string[];
        body_short: string[];
        body_tall: string[];
        bodyshape: string[];
        bodyshape2: string[];
        bra: string[];
        braids: string[];
        breastsize: string[];
        building: string[];
        camera_manu: string[];
        camera: string[];
        cat: string[];
        celeb: string[];
        civilization: string[];
        class: string[];
        clothing_female: string[];
        clothing_male: string[];
        clothing: string[];
        color: string[];
        corset: string[];
        cosmic_galaxy: string[];
        cosmic_nebula: string[];
        cosmic_star: string[];
        cosmic_term: string[];
        costume_female: string[];
        costume_male: string[];
        cumplay: string[];
        decade: string[];
        deity: string[];
        detail: string[];
        dinosaur: string[];
        dog: string[];
        dress: string[];
        earrings: string[];
        emoji_combo: string[];
        emoji: string[];
        expression: string[];
        eyecolor: string[];
        eyeliner: string[];
        f_stop: string[];
        fantasy_creature: string[];
        fantasy_setting: string[];
        fantasy: string[];
        female_adult: string[];
        female_young: string[];
        fetish_type: string[];
        fetish: string[];
        film_genre: string[];
        fish: string[];
        flower: string[];
        focal_length: string[];
        food: string[];
        forest_type: string[];
        fruit: string[];
        furniture: string[];
        game: string[];
        gem: string[];
        gen_modifier: string[];
        gender_ext: string[];
        gender: string[];
        genre: string[];
        hair_color: string[];
        'hair_female-short': string[];
        hair_female: string[];
        hair_male: string[];
        hairaccessory: string[];
        hairlength: string[];
        hd: string[];
        headwear_female: string[];
        headwear_male: string[];
        high_heels: string[];
        horror: string[];
        identity: string[];
        interior: string[];
        iso_stop: string[];
        landscape: string[];
        legwear: string[];
        lingerie: string[];
        lipstick_shade: string[];
        lipstick: string[];
        location: string[];
        makeup: string[];
        male_adult: string[];
        male_young: string[];
        monster: string[];
        movement: string[];
        national_park: string[];
        nationality: string[];
        neckwear: string[];
        neg_weight: string[];
        noun_beauty: string[];
        noun_fantasy: string[];
        noun_general: string[];
        noun_horror: string[];
        noun_landscape: string[];
        noun_romance: string[];
        noun_scifi: string[];
        occupation: string[];
        oil_painting: string[];
        outfit_cottagecore: string[];
        outfit_goth: string[];
        outfit_preppy: string[];
        outfit_steampunk: string[];
        panties: string[];
        photo_term: string[];
        photoshoot_type: string[];
        planet: string[];
        pop_culture: string[];
        pop_location: string[];
        portrait_type: string[];
        public: string[];
        punk: string[];
        purse: string[];
        quantity: string[];
        race: string[];
        render_engine: string[];
        render: string[];
        robot: string[];
        rpg_Item: string[];
        scenario_fantasy: string[];
        scenario_romance: string[];
        scenario_scifi: string[];
        scenario: string[];
        scenario2: string[];
        scifi: string[];
        sculpture: string[];
        setting: string[];
        sex_act: string[];
        sex_position: string[];
        sex_toy: string[];
        ship: string[];
        site: string[];
        skin_color: string[];
        still_life: string[];
        style: string[];
        subject_fantasy: string[];
        subject_horror: string[];
        subject_romance: string[];
        subject_scifi: string[];
        subject: string[];
        suit_female: string[];
        suit_male: string[];
        superhero: string[];
        supermodel: string[];
        swimwear: string[];
        technique: string[];
        time: string[];
        train: string[];
        tree: string[];
        tribe: string[];
        trippy: string[];
        underwater: string[];
        water: string[];
        watercolor: string[];
        wave: string[];
        wh_site: string[];
    };
    export const wildcards: Wildcards;
}
declare module "sdk/IFlowExecution" {
    import type * as CUSHY_RUNTIME from 'CUSHY_RUNTIME'
    import type { InfoRequestFn } from "controls/askv2";
    import type { FlowParam } from "core-shared/ParamDef";
    import type { Printable } from "core-shared/Printable";
    import type { ComfyUploadImageResult } from "core-types/ComfyWsPayloads";
    import type { AbsolutePath, RelativePath } from "utils/fs/BrandedPaths";
    import type { HTMLContent, MDContent } from "utils/markdown";
    import type { Maybe } from "utils/types";
    import type { Wildcards } from "wildcards/wildcards";
    export interface IFlowExecution {
        addParam(param: FlowParam): void;
        randomSeed(): number;
        range(start: number, end: number, increment?: number): number[];
        ensureModel(p: {
            name: string;
            url: string;
        }): Promise<void>;
        ensureCustomNodes(p: {
            path: string;
            url: string;
        }): Promise<void>;
        print(msg: Printable): void;
        showHTMLContent(p: {
            htmlContent: string;
            title: string;
        }): void;
        showMarkdownContent(p: {
            markdownContent: string;
            title: string;
        }): void;
        createAnimation(
        /** image to incldue (defaults to all images generated in the run) */
        source?: IGeneratedImage[], 
        /** frame duration, in ms:
         * - default is 200 (= 5fps)
         * - use 16 for ~60 fps
         * */
        frameDuration?: number): Promise<void>;
        resolveRelative(path: string): RelativePath;
        resolveAbsolute(path: string): AbsolutePath;
        uploadWorkspaceFile(path: string): Promise<ComfyUploadImageResult>;
        uploadWorkspaceFileAndLoad(path: string): Promise<CUSHY_RUNTIME.LoadImage>;
        uploadAnyFile(path: string): Promise<ComfyUploadImageResult>;
        uploadURL(url: string): Promise<ComfyUploadImageResult>;
        ask: InfoRequestFn;
        exec(cmd: string): string;
        sleep(ms: number): Promise<void>;
        saveTextFile(relativePath: string, content: string): Promise<void>;
        embedding(t: CUSHY_RUNTIME.Embeddings): string;
        writeFlowSummary(): void;
        get flowSummaryMd(): MDContent;
        get flowSummaryHTML(): HTMLContent;
        PROMPT(): Promise<IPromptExecution>;
        wildcards: Wildcards;
        generatedImages: IGeneratedImage[];
        get firstImage(): IGeneratedImage;
        get lastImage(): IGeneratedImage;
    }
    export interface IPromptExecution {
        images: IGeneratedImage[];
    }
    export interface IGeneratedImage {
        /** run an imagemagick convert action */
        imagemagicConvert(partialCmd: string, suffix: string): string;
        /** local url path */
        get localExtensionURL(): string;
        /** file name within the ComfyUI folder */
        get comfyFilename(): string;
        /** relative path on the comfy URL */
        get comfyRelativePath(): string;
        /** url to acces the image */
        get comfyURL(): string;
        /** path within the input folder */
        comfyInputPath?: Maybe<string>;
        /** folder in which the image should be saved */
        get localFolder(): string;
        /** local workspace file name, without extension */
        get localFileNameNoExt(): string;
        /** local workspace file name, WITH extension */
        get localFileName(): string;
        /** local workspace relative file path */
        get localRelativeFilePath(): string;
        /** uri the webview can access */
        get webviewURI(): string;
    }
}
declare module "sdk/sdkEntrypoint" {
    export type { Workflow } from "core-shared/Workflow";
    export type { Graph } from "core-shared/Graph";
    export type { IFlowExecution } from "sdk/IFlowExecution";
    export type { WorkflowBuilder, WorkflowBuilderFn } from "core-shared/WorkflowFn";
}
`