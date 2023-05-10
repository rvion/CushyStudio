export const sdkTemplate: string = `/// <reference path="nodes.d.ts" />

// ====================================================================================
// ====================================================================================
declare type STUB = never

declare interface Thenable<T> {
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => TResult | Thenable<TResult>): Thenable<TResult>
    then<TResult>(onfulfilled?: (value: T) => TResult | Thenable<TResult>, onrejected?: (reason: any) => void): Thenable<TResult>
}
declare type File = STUB
declare type Blob = STUB
declare namespace NodeJS {
    export type Timeout = STUB
}
declare type Buffer = never
declare module "typescript" {
    export default STUB
}
declare namespace ts {
    export type CallExpression = STUB
}
declare module "path" {}
declare module "pathe" {}
declare namespace express {
    export type Application = STUB
}
declare module "express" {
    export default STUB
}
// http --------------------------
declare module "http" {
    export default STUB
}
declare namespace http {
    export type Server = STUB
}
// ws --------------------------
declare module "ws" {
    export default STUB
    export type WebSocketServer = STUB
    export type CloseEvent = STUB
    export type Event = STUB
    export type MessageEvent = STUB
    export type EventListenerOptions = STUB
}
declare module "vscode" {
    export type TestRunProfile = STUB
    export type ExtensionContext = STUB
    export type OutputChannel = STUB
    export type Range = STUB
    export type TestItem = STUB
    export type TestRun = STUB
    export type TestRunRequest = STUB
    export type Uri = STUB
    export type Webview = STUB
    export type TextEditorDecorationType = STUB
    export type TextEditor = STUB
    export type TextDocumentWillSaveEvent = STUB
    export type TextDocumentChangeEvent = STUB
    export type TextDocument = STUB
    export type DecorationOptions = STUB
    export type StatusBarItem = STUB
    export type TestController = STUB
    export type WorkspaceFolder = STUB
    export type RelativePattern = STUB
    export type EventEmitter<T> = STUB
    export type FileSystemWatcher = STUB
    export type GlobPattern = STUB
}
// ====================================================================================
// ====================================================================================







/// <reference types="express" />
declare module "core-back/LATER.foo" {
    export type LATER<T> = any;
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
declare module "core-shared/b64img" {
    import type { Branded } from "utils/types";
    export type Base64Image = Branded<string, 'Base64Image'>;
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
        /** reset all nodes */
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
declare module "core-shared/Workflow" {
    export class Workflow {
    }
}
declare module "core-shared/WorkflowFn" {
    import type * as CUSHY_RUNTIME from 'CUSHY_RUNTIME'
    import type { Presets } from "presets/presets";
    import type { Graph } from "core-shared/Graph";
    import type { Workflow } from "core-shared/Workflow";
    import type { FlowRun } from "core-back/FlowRun";
    export type WorkflowType = (title: string, builder: WorkflowBuilderFn) => Workflow;
    export type WorkflowBuilder = {
        graph: CUSHY_RUNTIME.ComfySetup & Graph;
        flow: FlowRun;
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
declare module "core-shared/GeneratedImageSummary" {
    export interface ImageInfos {
        uid: string;
        comfyRelativePath: string;
        comfyURL: string;
        localRelativeFilePath: string;
        localAbsoluteFilePath: string;
    }
}
declare module "controls/BUG" {
    export class BUG {
    }
}
declare module "controls/Requestable" {
    import type { ImageInfos } from "core-shared/GeneratedImageSummary";
    import { BUG } from "controls/BUG";
    export type Requestable =
    /** str */
    Requestable_str | Requestable_strOpt
    /** nums */
     | Requestable_int | Requestable_intOpt
    /** bools */
     | Requestable_bool | Requestable_boolOpt
    /** embedding */
     | Requestable_embeddings
    /** loras */
     | Requestable_lora | Requestable_loras
    /** painting */
     | Requestable_samMaskPoints | Requestable_selectImage | Requestable_manualMask | Requestable_paint
    /** group */
     | Requestable_items
    /** select one */
     | Requestable_selectOne | Requestable_selectOneOrCustom
    /** select many */
     | Requestable_selectMany | Requestable_selectManyOrCustom
    /** array */
     | Requestable[]
    /** ?? */
     | BUG;
    export type Requestable_str = {
        type: 'str';
        label?: string;
    };
    export type Requestable_strOpt = {
        type: 'str?';
        label?: string;
    };
    export type Requestable_int = {
        type: 'int';
        label?: string;
    };
    export type Requestable_intOpt = {
        type: 'int?';
        label?: string;
    };
    export type Requestable_bool = {
        type: 'bool';
        label?: string;
    };
    export type Requestable_boolOpt = {
        type: 'bool?';
        label?: string;
    };
    export type Requestable_embeddings = {
        type: 'embeddings';
        label?: string;
    };
    export type Requestable_lora = {
        type: 'lora';
        label?: string;
    };
    export type Requestable_loras = {
        type: 'loras';
        label?: string;
    };
    export type Requestable_samMaskPoints = {
        type: 'samMaskPoints';
        label?: string;
        imageInfo: ImageInfos;
    };
    export type Requestable_selectImage = {
        type: 'selectImage';
        label?: string;
        imageInfos: ImageInfos[];
    };
    export type Requestable_manualMask = {
        type: 'manualMask';
        label?: string;
        imageInfo: ImageInfos;
    };
    export type Requestable_paint = {
        type: 'paint';
        label?: string;
        url: string;
    };
    export type Requestable_items = {
        type: 'items';
        label?: string;
        items: {
            [key: string]: Requestable;
        };
    };
    export type Requestable_selectOne = {
        type: 'selectOne';
        label?: string;
        choices: string[];
    };
    export type Requestable_selectOneOrCustom = {
        type: 'selectOneOrCustom';
        label?: string;
        choices: string[];
    };
    export type Requestable_selectMany = {
        type: 'selectMany';
        label?: string;
        choices: string[];
    };
    export type Requestable_selectManyOrCustom = {
        type: 'selectManyOrCustom';
        label?: string;
        choices: string[];
    };
}
declare module "controls/ScriptStep_Iface" {
    /** every ExecutionStep class must implements this interface  */
    export interface ScriptStep_Iface<Result> {
        /** uid */
        uid: string;
        /** name of the step */
        name: string;
        /** promise to await if you need to wait until the step is finished */
        finished: Promise<Result>;
    }
}
declare module "controls/ScriptStep_prompt" {
    import type { FlowRun } from "core-back/FlowRun";
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { WsMsgExecuted, WsMsgExecuting } from "core-types/ComfyWsPayloads";
    import type { ScriptStep_Iface } from "controls/ScriptStep_Iface";
    import { GeneratedImage } from "core-back/GeneratedImage";
    import { Graph } from "core-shared/Graph";
    export class PromptExecution implements ScriptStep_Iface<PromptExecution> {
        run: FlowRun;
        prompt: ComfyPromptJSON;
        private static promptID;
        /** unique step id */
        uid: string;
        /** human-readable step name */
        name: string;
        /** deepcopy of run graph at creation time; ready to be forked */
        _graph: Graph;
        /** short-hand getter to access parent client */
        get workspace(): import("core-back/Workspace").Workspace;
        constructor(run: FlowRun, prompt: ComfyPromptJSON);
        _resolve: (value: this) => void;
        _rejects: (reason: any) => void;
        finished: Promise<this>;
        /** pointer to the currently executing node */
        /** update the progress value of the currently focused onde */
        notifyEmptyPrompt: () => Thenable<string | undefined>;
        /** update pointer to the currently executing node */
        onExecuting: (msg: WsMsgExecuting) => void;
        /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
        private outputs;
        images: GeneratedImage[];
        /** udpate execution list */
        onExecuted: (msg: WsMsgExecuted) => GeneratedImage[];
        /** finish this step */
        private _finish;
    }
}
declare module "controls/ScriptStep_Init" {
    import type { ScriptStep_Iface } from "controls/ScriptStep_Iface";
    export class ScriptStep_Init implements ScriptStep_Iface<true> {
        uid: string;
        name: string;
        finished: Promise<true>;
    }
}
declare module "controls/ScriptStep_ask" {
    import type { Maybe } from "utils/types";
    import type { ScriptStep_Iface } from "controls/ScriptStep_Iface";
    import type { InfoAnswer } from "controls/askv2";
    import type { Requestable } from "controls/Requestable";
    export class ScriptStep_ask<const Req extends {
        [key: string]: Requestable;
    }> implements ScriptStep_Iface<{
        [key in keyof Req]: InfoAnswer<Req[key]>;
    }> {
        req: Req;
        uid: string;
        name: string;
        constructor(req: Req);
        locked: boolean;
        value: Maybe<{
            [key in keyof Req]: InfoAnswer<Req[key]>;
        }>;
        private _resolve;
        finished: Promise<{
            [key in keyof Req]: InfoAnswer<Req[key]>;
        }>;
        answer: (value: { [key in keyof Req]: InfoAnswer<Req[key]>; }) => void;
    }
}
declare module "core-types/FlowExecutionStep" {
    import type { ScriptStep_Init } from "controls/ScriptStep_Init";
    import type { ScriptStep_ask } from "controls/ScriptStep_ask";
    import type { PromptExecution } from "controls/ScriptStep_prompt";
    export type FlowExecutionStep = ScriptStep_Init | PromptExecution | ScriptStep_ask<any>;
}
declare module "core-shared/PayloadID" {
    export type PayloadID = number;
    export const getPayloadID: () => PayloadID;
}
declare module "utils/fs/BrandedPaths" {
    import type { Branded } from "utils/types";
    export type RelativePath = Branded<string, 'WorkspaceRelativePath'>;
    export type AbsolutePath = Branded<string, 'Absolute'>;
}
declare module "utils/fs/pathUtils" {
    import type { AbsolutePath, RelativePath } from "utils/fs/BrandedPaths";
    export * as pathe from 'pathe';
    /** brand a path as an absolute path after basic checks */
    export const asAbsolutePath: (path: string) => AbsolutePath;
    /** brand a path as a workspace relative pathpath after basic checks */
    export const asRelativePath: (path: string) => RelativePath;
}
declare module "utils/jsEscapeStr" {
    export function jsEscapeStr(x: any): any;
}
declare module "utils/toposort" {
    export type TNode = string;
    export type TEdge = [TNode, TNode];
    export function toposort(nodes: TNode[], edges: TEdge[]): TNode[];
}
declare module "importers/ImportComfyImage" {
    import { Workspace } from "core-back/Workspace";
    import { ComfyPromptJSON } from "core-types/ComfyPrompt";
    /** Converts Comfy JSON prompts to ComfyScript code */
    type RuleInput = {
        nodeName: string;
        inputName: string;
        valueStr: string;
    };
    export class ComfyImporter {
        client: Workspace;
        constructor(client: Workspace);
        UI_ONLY_ATTRIBUTES: string[];
        RULES: ((p: RuleInput) => void)[];
        knownAliaes: {
            [key: string]: string;
        };
        naneDedupeCache: {
            [key: string]: number;
        };
        /** handles hygenic naming  */
        mkVarNameForNodeType: (nodeType: string, nameOfInputsItsPluggedInto: string[]) => string;
        private finalizeName;
        private smartDownCase;
        /** trim useless suffixes, like _name */
        private smartTrim;
        convertFlowToCode: (title: string, flow: ComfyPromptJSON, opts: {
            preserveId: boolean;
        }) => string;
    }
}
declare module "utils/Either" {
    export type Result<L, R> = {
        type: 'failure';
        value: L;
    } | {
        type: 'success';
        value: R;
    };
    export const resultSuccess: <T>(value: T) => Result<never, T>;
    export const resultFailure: <T>(value: T) => Result<T, never>;
}
declare module "importers/getPngMetadata" {
    import { Result } from "utils/Either";
    export type TextChunks = {
        [key: string]: string;
    };
    export function getPngMetadataFromFile(file: File): Promise<TextChunks>;
    export const getPngMetadata: (pngData: Uint8Array) => Result<string, TextChunks>;
}
declare module "sdk/sdkTemplate" {
    export const sdkTemplate: string;
}
declare module "utils/timestamps" {
    export const getYYYYMMDDHHMMSS: () => string;
    export const getYYYYMMDD_HHMM_SS: () => string;
}
declare module "templates/Template" {
    import type { Workspace } from "core-back/Workspace";
    export class Template {
        name: string;
        code: string;
        constructor(name: string, code: string);
        createProjectCopy(workspace: Workspace): void;
    }
}
declare module "templates/Library" {
    import { Template } from "templates/Template";
    export const demoLibrary: Template[];
}
declare module "templates/defaultProjectCode" {
    export const defaultScript: string;
}
declare module "utils/bang" {
    /** assertNotNull */
    export const bang: <T>(x: T | null) => T;
}
declare module "utils/extractErrorMessage" {
    /** Extracts an error message from an exception stuff. */
    export const extractErrorMessage: (error: any) => string;
}
declare module "utils/stringifyReadable" {
    export function readableStringify(obj: any, maxLevel?: number, level?: number): string;
}
declare module "core-back/transpiler" {
    export function transpileCode(code: string): Promise<string>;
}
declare module "core-back/FlowDefinition" {
    import type { RunMode } from "core-shared/Graph";
    import type { CushyFile } from "core-back/CushyFile";
    import * as vscode from 'vscode';
    /**
     * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
     * flow = the 'WORFLOW(...)' part of a file
     * */
    export class FlowDefinition {
        flowID: string;
        file: CushyFile;
        range: vscode.Range;
        flowName: string;
        generation: number;
        constructor(flowID: string, file: CushyFile, range: vscode.Range, flowName: string, generation: number);
        run: (vsTestItem: vscode.TestItem, vsTestRun: vscode.TestRun, mode?: RunMode) => Promise<boolean>;
    }
}
declare module "core-back/extractWorkflows" {
    import * as vscode from 'vscode';
    export const extractWorkflows: (text: string, events: {
        onWorkflowFound(range: vscode.Range, workflowName: string): void;
    }) => void;
}
declare module "core-back/CushyFile" {
    import * as vscode from 'vscode';
    import { FlowDefinition } from "core-back/FlowDefinition";
    import { Workspace } from "core-back/Workspace";
    export type MarkdownTestData = CushyFile | /* TestHeading |*/ FlowDefinition;
    export const vsTestItemOriginDict: WeakMap<vscode.TestItem, MarkdownTestData>;
    export class CushyFile {
        workspace: Workspace;
        uri: vscode.Uri;
        vsTestItem: vscode.TestItem;
        constructor(workspace: Workspace, uri: vscode.Uri);
        /** true once the file content has been read */
        didResolve: boolean;
        updateFromDisk(): Promise<void>;
        private getContentFromFilesystem;
        CONTENT: string;
        /**
         * Parses the tests from the input text, and updates the tests contained
         * by this file to be those from the text,
         */
        updateFromContents(content: string): void;
    }
}
declare module "utils/toArray" {
    export const toArray: <T>(iterable: {
        forEach: (fn: (arg: T) => any) => any;
    }) => T[];
}
declare module "core-back/FlowRunner" {
    import type { Workspace } from "core-back/Workspace";
    import * as vscode from 'vscode';
    import { FlowDefinition } from "core-back/FlowDefinition";
    export class FlowRunner {
        workspace: Workspace;
        request: vscode.TestRunRequest;
        queue: {
            vsTestItem: vscode.TestItem;
            cushyFlow: FlowDefinition;
        }[];
        run: vscode.TestRun;
        constructor(workspace: Workspace, request: vscode.TestRunRequest);
        START: () => Promise<void>;
        discoverTests: (tests: Iterable<vscode.TestItem>) => Promise<void>;
        runTestQueue: () => Promise<void>;
    }
}
declare module "utils/fs/getNonce" {
    /**
     * A helper function that returns a unique alphanumeric identifier called a nonce.
     *
     * @remarks This function is primarily used to help enforce content security
     * policies for resources/scripts being executed in a webview context.
     *
     * @returns A nonce
     */
    export function getNonce(): string;
}
declare module "utils/fs/getUri" {
    import { Uri, Webview } from 'vscode';
    /**
     * A helper function which will get the webview URI of a given file or resource.
     *
     * @remarks This URI can be used within a webview's HTML as a link to the
     * given file/resource.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @param pathList An array of strings representing the path to a file/resource
     * @returns A URI pointing to the file/resource
     */
    export function getUri(webview: Webview, extensionUri: Uri, pathList: string[]): Uri;
}
declare module "core-back/FrontWebview" {
    import type { Workspace } from "core-back/Workspace";
    import * as vscode from 'vscode';
    /**
     * This class manages the state and behavior of HelloWorld webview panels.
     *
     * It contains all the data and methods for:
     *
     * - Creating and rendering HelloWorld webview panels
     * - Properly cleaning up and disposing of webview resources when the panel is closed
     * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
     * - Setting message listeners so data can be passed between the webview and extension
     */
    export class FrontWebview {
        private workspace;
        /** A reference to the webview panel */
        private panel;
        /** The URI of the directory containing the extension */
        private extensionUri;
        static current: FrontWebview | undefined;
        static createOrReveal(workspace: Workspace): void;
        private _disposables;
        webview: vscode.Webview;
        private constructor();
        /** Cleans up and disposes of webview resources when the webview panel is closed. */
        dispose(): void;
        /**
         * Defines and returns the HTML that should be rendered within the webview panel.
         *
         * @remarks This is also the place where references to the React webview build files
         * are created and inserted into the webview HTML.
         *
         * @param webview A reference to the extension webview
         * @param extensionUri The URI of the directory containing the extension
         * @returns A template string literal containing the HTML that should be
         * rendered within the webview panel
         */
        private _getWebviewContent;
        static with: <A>(fn: (current: FrontWebview) => A) => A;
        getExtensionLocalUri: (pathList: string[]) => vscode.Uri;
    }
}
declare module "core-back/RANDOM_IMAGE_URL" {
    export const RANDOM_IMAGE_URL = "http://192.168.1.20:8188/view?filename=ComfyUI_01619_.png&subfolder=&type=output";
}
declare module "core-back/ResilientWebsocket" {
    import type { Maybe } from "utils/types";
    import { CloseEvent, Event, MessageEvent, EventListenerOptions } from 'ws';
    type Message = string | Buffer;
    export class ResilientWebSocketClient {
        options: {
            url: () => string;
            onMessage: (event: MessageEvent) => void;
            onConnectOrReconnect: () => void;
            onClose: () => void;
        };
        private url;
        private currentWS?;
        private messageBuffer;
        isOpen: boolean;
        constructor(options: {
            url: () => string;
            onMessage: (event: MessageEvent) => void;
            onConnectOrReconnect: () => void;
            onClose: () => void;
        });
        reconnectTimeout?: Maybe<NodeJS.Timeout>;
        updateURL(url: string): void;
        connect(): void;
        send(message: Message): void;
        private flushMessageBuffer;
        addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => any, options?: EventListenerOptions): void;
        removeEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    }
    type WebSocketEventMap = {
        open: Event;
        close: CloseEvent;
        error: Event;
        message: MessageEvent;
    };
}
declare module "core-back/decoratorInput" {
    import ts from 'typescript';
    export type PossibleNodeInputAssignation = {
        col: number;
        row: number;
        nodeName: string;
        paramName: string;
    };
    export function extractInfoFromFunctionCall(node: ts.CallExpression): PossibleNodeInputAssignation[];
    export const extractAllPossibleNodeInputAssignment: (sourceCode: string) => PossibleNodeInputAssignation[];
}
declare module "core-back/decorator" {
    import type { Workspace } from "core-back/Workspace";
    import * as vscode from 'vscode';
    export class VSCodeEmojiDecorator {
        workspace: Workspace;
        knownEmojis: {
            [key: string]: string;
        };
        decorationType: vscode.TextEditorDecorationType;
        constructor(workspace: Workspace);
        decorateAffectedDocument: (event: vscode.TextDocumentWillSaveEvent | vscode.TextDocumentChangeEvent) => void;
        decorateDocument: (event: vscode.TextDocument) => void;
        safely: <T>(f: () => T, def: T) => T;
        decorate: (editor: vscode.TextEditor) => void;
        private get_emoji_B;
        decorateB: (editor: vscode.TextEditor) => vscode.DecorationOptions[];
        decorateA: (editor: vscode.TextEditor) => vscode.DecorationOptions[];
    }
}
declare module "core-types/MessageFromExtensionToWebview" {
    import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from "core-types/ComfyWsPayloads";
    import type { PayloadID } from "core-shared/PayloadID";
    import type { ComfySchemaJSON } from "core-types/ComfySchemaJSON";
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { EmbeddingName } from "core-shared/Schema";
    import type { ImageInfos } from "core-shared/GeneratedImageSummary";
    import { Requestable } from "controls/Requestable";
    export type FromWebview_SayReady = {
        type: 'say-ready';
        frontID: string;
    };
    export type FromWebview_runFlow = {
        type: 'run-flow';
        flowID: string;
    };
    export type FromWebview_openExternal = {
        type: 'open-external';
        uriString: string;
    };
    export type FromWebview_sayHello = {
        type: 'say-hello';
        message: string;
    };
    export type FromWebview_Answer = {
        type: 'answer';
        value: any;
    };
    export type MessageFromWebviewToExtension = FromWebview_SayReady | FromWebview_runFlow | FromWebview_openExternal | FromWebview_sayHello | FromWebview_Answer;
    export type MessageFromExtensionToWebview = {
        uid: PayloadID;
    } & MessageFromExtensionToWebview_;
    export type FromExtension_CushyStatus = {
        type: 'cushy_status';
        connected: boolean;
    };
    export type FromExtension_FlowStart = {
        type: 'flow-start';
        flowRunID: string;
    };
    export type FromExtension_FlowCode = {
        type: 'flow-code';
        flowRunID: string;
        code: string;
    };
    export type FromExtension_FlowEnd = {
        type: 'flow-end';
        flowRunID: string;
        status: 'success' | 'failure';
        flowID: string;
    };
    export type FromExtension_Print = {
        type: 'print';
        message: string;
    };
    export type FromExtension_Schema = {
        type: 'schema';
        schema: ComfySchemaJSON;
        embeddings: EmbeddingName[];
    };
    export type FromExtension_Prompt = {
        type: 'prompt';
        graph: ComfyPromptJSON;
    };
    export type FromExtension_Ls = {
        type: 'ls';
        workflowNames: {
            name: string;
            id: string;
        }[];
    };
    export type FromExtension_Images = {
        type: 'images';
        images: ImageInfos[];
    };
    export type FromExtension_ShowHtml = {
        type: 'show-html';
        content: string;
        title: string;
    };
    export type FromExtension_ask = {
        type: 'ask';
        request: {
            [key: string]: Requestable;
        };
    };
    export type MessageFromExtensionToWebview_ =
    /** wether or not cushy server is connected to at least on ComfyUI server */
    FromExtension_CushyStatus | FromExtension_FlowStart | FromExtension_FlowCode | FromExtension_FlowEnd | FromExtension_ask | FromExtension_Print | FromExtension_Schema | FromExtension_Prompt | FromExtension_Ls | WsMsgStatus | WsMsgProgress | WsMsgExecuting | WsMsgExecuted | FromExtension_Images | FromExtension_ShowHtml;
    export const renderMessageFromExtensionAsEmoji: (msg: MessageFromExtensionToWebview) => "✅" | "📝" | "🖼️" | "❓" | "ℹ️" | "🎬" | "🏁" | "📄" | "📡" | "📊" | "📈" | "💬" | "🥶" | "👋" | "📂";
}
declare module "core-back/Client" {
    import type WebSocket from 'ws';
    import type { Workspace } from "core-back/Workspace";
    import { MessageFromExtensionToWebview, MessageFromWebviewToExtension } from "core-types/MessageFromExtensionToWebview";
    export class CushyClient {
        workspace: Workspace;
        ws: WebSocket;
        clientID: string;
        constructor(workspace: Workspace, ws: WebSocket);
        /** wether or not the webview is up and running and react is mounted */
        ready: boolean;
        queue: MessageFromExtensionToWebview[];
        flushQueue: () => void;
        sendMessage(message: MessageFromExtensionToWebview): void;
        onMessageFromWebview: (msg: MessageFromWebviewToExtension) => void;
    }
}
declare module "core-back/server" {
    import express from 'express';
    import http from 'http';
    import { WebSocketServer } from 'ws';
    import { Workspace } from "core-back/Workspace";
    export class CushyServer {
        workspace: Workspace;
        http: http.Server;
        app: express.Application;
        wss: WebSocketServer;
        port: number;
        get baseURL(): string;
        absPathToURL(absPath: string): string;
        constructor(workspace: Workspace);
        listen: () => Promise<void>;
    }
}
declare module "core-back/statusBar" {
    import type { Workspace } from "core-back/Workspace";
    import * as vscode from 'vscode';
    export class StatusBar {
        workspace: Workspace;
        myStatusBarItem: vscode.StatusBarItem;
        constructor(workspace: Workspace);
    }
}
declare module "logger/LoggerBack" {
    import type { Maybe } from "utils/types";
    import * as vscode from 'vscode';
    import { ILogger, LogLevel } from "logger/LogTypes";
    import { Printable } from "core-shared/Printable";
    export class LoggerBack implements ILogger {
        level: LogLevel;
        /**
         *  - available in the extension process
         *  - not available in the webview process
         */
        chanel?: Maybe<vscode.OutputChannel>;
        constructor(level?: LogLevel);
        stringify: (message: Printable[]) => string;
        debug(...messages: Printable[]): void;
        info(...messages: Printable[]): void;
        warn(...messages: Printable[]): void;
        error(...messages: Printable[]): void;
    }
}
declare module "core-shared/AutolayoutV2" {
    import type { Graph } from "core-shared/Graph";
    /** partial type of cytoscape json output
     * include the subset needed to get positions post layout
     */
    export type CytoJSON = {
        elements: {
            nodes: {
                data: {
                    id: string;
                };
                position: {
                    x: number;
                    y: number;
                };
            }[];
        };
    };
    export const runAutolayout: (graph: Graph) => Promise<CytoJSON>;
}
declare module "core-shared/LiteGraph" {
    import type { Branded } from "utils/types";
    import { CytoJSON } from "core-shared/AutolayoutV2";
    import type { Graph } from "core-shared/Graph";
    export type LiteGraphJSON = {
        last_node_id: number;
        last_link_id: number;
        nodes: LiteGraphNode[];
        links: LiteGraphLink[];
        groups: [];
        config: {};
        extra: {};
        version: 0.4;
    };
    export type LiteGraphLink = [
        linkId: LiteGraphLinkID,
        fromNodeId: number,
        fromNodeOutputIx: number,
        toNodeId: number,
        toNodeInputIx: number,
        linkType: string
    ];
    export type LiteGraphLinkID = Branded<number, 'LiteGraphLinkID'>;
    export type LiteGraphSlotIndex = Branded<number, 'LiteGraphSlotIndex'>;
    export const asLiteGraphSlotIndex: (id: number) => LiteGraphSlotIndex;
    export type LiteGraphNodeInput = {
        name: string;
        type: string;
        link: LiteGraphLinkID;
    };
    export type LiteGraphNodeOutput = {
        name: string;
        type: string;
        links: LiteGraphLinkID[];
        slot_index: LiteGraphSlotIndex;
    };
    export type LiteGraphNode = {
        id: number;
        type: string;
        pos: [number, number];
        size: {
            '0': number;
            '1': number;
        };
        flags?: {};
        order?: number;
        /**
         * 1 = ?????
         * 2 = muted
         * */
        mode?: number;
        inputs?: LiteGraphNodeInput[];
        outputs: LiteGraphNodeOutput[];
        isVirtualNode?: boolean;
        properties?: {};
        widgets_values: any[];
    };
    export const convertFlowToLiteGraphJSON: (graph: Graph, cytoJSON?: CytoJSON) => LiteGraphJSON;
    export class LiteGraphCtx {
        graph: Graph;
        constructor(graph: Graph);
        nextLinkId: number;
        links: LiteGraphLink[];
        allocateLink: (fromNodeId: number, fromNodeOutputIx: number, toNodeId: number, toNodeInputIx: number, linkType: string) => LiteGraphLinkID;
    }
}
declare module "core-shared/litegraphToPrompt" {
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { LiteGraphJSON } from "core-shared/LiteGraph";
    import type { Schema } from "core-shared/Schema";
    export const convertLiteGraphToPrompt: (schema: Schema, workflow: LiteGraphJSON) => ComfyPromptJSON;
}
declare module "core-back/Workspace" {
    import type { ComfySchemaJSON } from "core-types/ComfySchemaJSON";
    import * as vscode from 'vscode';

    import { Maybe } from "utils/types";
    import { FlowRun } from "core-back/FlowRun";
    import { Schema } from "core-shared/Schema";
    import { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import { ComfyStatus } from "core-types/ComfyWsPayloads";
    import { RelativePath } from "utils/fs/BrandedPaths";
    import { Template } from "templates/Template";
    import { CushyFile } from "core-back/CushyFile";
    import { GeneratedImage } from "core-back/GeneratedImage";
    import { ResilientWebSocketClient } from "core-back/ResilientWebsocket";
    import { VSCodeEmojiDecorator } from "core-back/decorator";
    import { CushyServer } from "core-back/server";
    import { StatusBar } from "core-back/statusBar";
    import { CushyClient } from "core-back/Client";
    import { MessageFromExtensionToWebview, MessageFromExtensionToWebview_ } from "core-types/MessageFromExtensionToWebview";
    import { PayloadID } from "core-shared/PayloadID";
    export type CSCriticalError = {
        title: string;
        help: string;
    };
    /**
     * global State
     *  - manages connection to the backend
     *  - manages list of known / open projects
     *  - dispatches messages to the right projects
     */
    export class Workspace {
        context: vscode.ExtensionContext;
        wspUri: vscode.Uri;
        schema: Schema;
        statusBar: StatusBar;
        /** template /snippet library one can */
        demos: Template[];
        comfySessionId: string;
        activeRun: Maybe<FlowRun>;
        vsTestController: vscode.TestController;
        fileChangedEmitter: vscode.EventEmitter<vscode.Uri>;
        /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
        get cacheFolderRootRelPath(): RelativePath;
        get cacheFolderRootURI(): vscode.Uri;
        runs: FlowRun[];
        comfyJSONUri: vscode.Uri;
        embeddingsUri: vscode.Uri;
        comfyTSUri: vscode.Uri;
        cushyTSUri: vscode.Uri;
        tsConfigUri: vscode.Uri;
        writeBinaryFile(relPath: RelativePath, content: Buffer, open?: boolean): void;
        /** read text file, optionally provide a default */
        readJSON: <T extends unknown>(uri: vscode.Uri, def?: T | undefined) => T;
        /** read text file, optionally provide a default */
        readTextFile: (uri: vscode.Uri, def: string) => Promise<string>;
        writeTextFile(uri: vscode.Uri, content: string, open?: boolean): void;
        updateNodeForDocument: (e: vscode.TextDocument) => void;
        xxx: vscode.TestRunProfile;
        startTestRun: (request: vscode.TestRunRequest) => Promise<undefined>;
        /** wrapper around vscode.tests.createTestController so logic is self-contained  */
        initVSTestController(): vscode.TestController;
        initOutputChannel: () => void;
        clients: Map<string, CushyClient>;
        registerClient: (id: string, client: CushyClient) => Map<string, CushyClient>;
        unregisterClient: (id: string) => boolean;
        lastMessagesPerType: Map<"status" | "progress" | "executing" | "executed" | "cushy_status" | "flow-start" | "flow-code" | "flow-end" | "ask" | "print" | "schema" | "prompt" | "ls" | "images" | "show-html", MessageFromExtensionToWebview>;
        broadCastToAllClients: (message_: MessageFromExtensionToWebview_) => PayloadID;
        server: CushyServer;
        decorator: VSCodeEmojiDecorator;
        constructor(context: vscode.ExtensionContext, wspUri: vscode.Uri);
        createTSConfigIfMissing: () => void;
        restoreSchemaFromCache: () => Schema;
        watchForCOnfigurationChanges: () => void;
        autoDiscoverEveryWorkflow: () => void;
        /** will be created only after we've loaded cnfig file
         * so we don't attempt to connect to some default server */
        ws: ResilientWebSocketClient;
        getServerHostHTTP(): string;
        getWSUrl: () => string;
        initWebsocket: () => ResilientWebSocketClient;
        /** ensure webview is opened */
        ensureWebviewPanelIsOpened: () => Promise<void>;
        openWebview: () => Promise<void>;
        importCurrentFile: (opts: {
            preserveId: boolean;
        }) => Promise<void>;
        importCurrentFileAsComfyJSON: (uri: vscode.Uri, opts: {
            preserveId: boolean;
        }) => Promise<void>;
        importCurrentFileAsComfyUIPNG: (uri: vscode.Uri, opts: {
            preserveId: boolean;
        }) => Promise<void>;
        forwardImagesToFrontV2: (images: GeneratedImage[]) => void;
        onMessage: (e: WS.MessageEvent) => void;
        /** attempt to convert an url to a Blob */
        getUrlAsBlob: (url?: string) => Promise<Blob>;
        createProjectAndFocustIt: (workspaceRelativeFilePath: vscode.Uri, scriptContent?: string) => void;
        resolve: (relativePath: RelativePath) => vscode.Uri;
        CRITICAL_ERROR: Maybe<CSCriticalError>;
        /** retri e the comfy spec from the schema*/
        fetchAndUdpateSchema: () => Promise<ComfySchemaJSON>;
        get schemaStatusEmoji(): "🟢" | "🔴";
        status: ComfyStatus | null;
        notify: (msg: string) => Thenable<string | undefined>;
        addProjectFromComfyWorkflowJSON: (relPath: RelativePath, title: string, comfyPromptJSON: ComfyPromptJSON, opts: {
            preserveId: boolean;
        }) => vscode.Uri;
        getOrCreateFile: (vsTestController: vscode.TestController, uri: vscode.Uri) => CushyFile;
        startWatchingWorkspace: (controller: vscode.TestController, fileChangedEmitter: vscode.EventEmitter<vscode.Uri>) => vscode.FileSystemWatcher[];
        getWorkspaceTestPatterns(): {
            workspaceFolder: vscode.WorkspaceFolder;
            pattern: vscode.RelativePattern;
        }[];
        findInitialFiles(controller: vscode.TestController, pattern: vscode.GlobPattern): Promise<void>;
    }
}
declare module "core-back/GeneratedImage" {
    import * as vscode from 'vscode';
    import type { ComfyImageInfo } from "core-types/ComfyWsPayloads";
    import type { Maybe } from "utils/types";
    import type { PromptExecution } from "controls/ScriptStep_prompt";
    import { RelativePath } from "utils/fs/BrandedPaths";
    import { ImageInfos } from "core-shared/GeneratedImageSummary";
    enum ImageStatus {
        Known = 1,
        Downloading = 2,
        Saved = 3
    }
    /** Cushy wrapper around ComfyImageInfo */
    export class GeneratedImage implements ImageInfos {
        /** the prompt this file has been generated from */
        prompt: PromptExecution;
        /** image info as returned by Comfy */
        data: ComfyImageInfo;
        private static imageID;
        private workspace;
        convertToImageInput: () => string;
        uid: string;
        constructor(
        /** the prompt this file has been generated from */
        prompt: PromptExecution,
        /** image info as returned by Comfy */
        data: ComfyImageInfo);
        /** unique image id */
        /** run an imagemagick convert action */
        imagemagicConvert: (partialCmd: string, suffix: string) => string;
        /** file name within the ComfyUI folder */
        get comfyFilename(): string;
        /** relative path on the comfy URL */
        get comfyRelativePath(): string;
        /** url to acces the image */
        get comfyURL(): string;
        /** path within the input folder */
        comfyInputPath?: Maybe<string>;
        /** folder in which the image should be saved */
        get localFolder(): RelativePath;
        /** local workspace file name, without extension */
        get localFileNameNoExt(): string;
        /** local workspace file name, WITH extension */
        get localFileName(): string;
        /** local workspace relative file path */
        get localRelativeFilePath(): RelativePath;
        get localUri(): vscode.Uri;
        get localExtensionURL(): string;
        /** uri the webview can access */
        get webviewURI(): string;
        /** absolute path on the machine with vscode */
        get localAbsoluteFilePath(): string;
        toJSON: () => ImageInfos;
        /** true if file exists on disk; false otherwise */
        status: ImageStatus;
        ready: Promise<true>;
        /** @internal */
        private downloadImageAndSaveToDisk;
        /** this is such a bad workaround but 🤷‍♂️ */
        uploadAsNamedInput: () => Promise<string>;
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
    import type { ImageInfos } from "core-shared/GeneratedImageSummary";
    import type { Requestable } from "controls/Requestable";
    import type * as R from "controls/Requestable";
    import { GeneratedImage } from "core-back/GeneratedImage";
    export type SamPointPosStr = Tagged<string, 'SamPointPosStr'>;
    export type SamPointLabelsStr = Tagged<string, 'SamPointLabelsStr'>;
    export type InfoAnswer<Req> =
    /** str */
    Req extends R.Requestable_str ? string : Req extends R.Requestable_strOpt ? Maybe<string> :
    /** nums */
    Req extends R.Requestable_int ? number : Req extends R.Requestable_intOpt ? Maybe<number> :
    /** bools */
    Req extends R.Requestable_bool ? boolean : Req extends R.Requestable_boolOpt ? Maybe<boolean> :
    /** embedding */
    Req extends R.Requestable_embeddings ? Maybe<boolean> :
    /** loras */
    Req extends R.Requestable_lora ? SimplifiedLoraDef : Req extends R.Requestable_loras ? SimplifiedLoraDef[] :
    /** painting */
    Req extends R.Requestable_samMaskPoints ? {
        points: SamPointPosStr;
        labels: SamPointLabelsStr;
    } : Req extends R.Requestable_selectImage ? ImageInfos : Req extends R.Requestable_manualMask ? Base64Image : Req extends R.Requestable_paint ? Base64Image :
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
        str: (label?: string) => R.Requestable_str;
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
        private _toImageInfos;
        samMaskPoints: (label: string, img: GeneratedImage | ImageInfos) => {
            type: "samMaskPoints";
            imageInfo: any;
        };
        selectImage: (label: string, imgs: (GeneratedImage | ImageInfos)[]) => {
            type: "selectImage";
            imageInfos: any[];
            label: string;
        };
        manualMask: (label: string, img: GeneratedImage | ImageInfos) => {
            type: "manualMask";
            label: string;
            imageInfo: any;
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
declare module "core-back/ffmpegScripts" {
    export function createMP4FromImages(imageFiles: string[], outputVideo: string,
    /** The duration each image should be displayed, in milliseconds */
    frameDuration: number | undefined, workingDirectory: string): Promise<void>;
}
declare module "core-back/FlowRun" {
    import type * as CUSHY_RUNTIME from 'CUSHY_RUNTIME'
    import * as path from 'path';
    import * as vscode from 'vscode';
    import { InfoRequestFn } from "controls/askv2";
    import { PromptExecution } from "controls/ScriptStep_prompt";
    import { Graph } from "core-shared/Graph";
    import type { FlowParam } from "core-shared/ParamDef";
    import { Printable } from "core-shared/Printable";
    import { ComfyUploadImageResult, WsMsgExecuted } from "core-types/ComfyWsPayloads";
    import { FlowExecutionStep } from "core-types/FlowExecutionStep";
    import { AbsolutePath, RelativePath } from "utils/fs/BrandedPaths";
    import { HTMLContent, MDContent } from "utils/markdown";
    import { GeneratedImage } from "core-back/GeneratedImage";
    import { Workspace } from "core-back/Workspace";
    /** script exeuction instance */
    export class FlowRun {
        workspace: Workspace;
        uri: vscode.Uri;
        opts?: {
            mock?: boolean | undefined;
        } | undefined;
        /** creation "timestamp" in YYYYMMDDHHMMSS format */
        createdAt: string;
        /** unique run id */
        uid: string;
        /** human readable folder name */
        name: string;
        /** the main graph that will be updated along the script execution */
        graph: Graph;
        /** graph engine instance for smooth and clever auto-layout algorithms */
        private params;
        addParam: (p: FlowParam) => void;
        /** list of all images produed over the whole script execution */
        generatedImages: GeneratedImage[];
        get firstImage(): GeneratedImage;
        get lastImage(): GeneratedImage;
        /** folder where CushyStudio will save run informations */
        get workspaceRelativeCacheFolderPath(): RelativePath;
        folder: vscode.Uri;
        sleep: (ms: number) => Promise<void>;
        saveTextFile: (path: RelativePath, content: string) => Promise<void>;
        showHTMLContent: (p: {
            htmlContent: string;
            title: string;
        }) => void;
        showMarkdownContent: (p: {
            title: string;
            markdownContent: string;
        }) => void;
        static VideoCounter: number;
        createAnimation: (source?: GeneratedImage[], frameDuration?: number) => Promise<void>;
        get flowSummaryMd(): MDContent;
        get flowSummaryHTML(): HTMLContent;
        /** ensure a model is present, and download it if needed */
        ensureModel: (p: {
            name: string;
            url: string;
        }) => Promise<void>;
        /** ensure a custom onde is properly setup, and download/clone it if needed */
        ensureCustomNodes: (p: {
            path: string;
            url: string;
        }) => Promise<void>;
        writeFlowSummary: () => void;
        embedding: (t: CUSHY_RUNTIME.Embeddings) => string;
        /** ask the user a few informations */
        ask: InfoRequestFn;
        exec: (comand: string) => string;
        /** built-in wildcards */
        wildcards: import("wildcards/wildcards").Wildcards;
        /** pick a random seed */
        randomSeed(): number;
        private extractString;
        /** display something in the console */
        print: (message: Printable) => void;
        /** upload a file from disk to the ComfyUI backend */
        resolveRelative: (path: string) => RelativePath;
        resolveAbsolute: (path: string) => AbsolutePath;
        range: (start: number, end: number, increment?: number) => number[];
        /** upload an image present on disk to ComfyServer */
        uploadAnyFile: (path: AbsolutePath) => Promise<ComfyUploadImageResult>;
        /** upload an image present on disk to ComfyServer */
        uploadWorkspaceFile: (path: RelativePath) => Promise<ComfyUploadImageResult>;
        uploadWorkspaceFileAndLoad: (path: RelativePath) => Promise<CUSHY_RUNTIME.LoadImage>;
        uploadURL: (url?: string) => Promise<ComfyUploadImageResult>;
        private uploadUIntArrToComfy;
        PROMPT(): Promise<PromptExecution>;
        private _promptCounter;
        private sendPromp;
        constructor(workspace: Workspace, uri: vscode.Uri, opts?: {
            mock?: boolean | undefined;
        } | undefined);
        steps: FlowExecutionStep[];
        /** current step */
        get step(): FlowExecutionStep;
        /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
        outputs: WsMsgExecuted[];
    }
}
declare module "sdk/sdkEntrypoint" {
    export type { FlowRun } from "core-back/FlowRun";
    export type { Workflow } from "core-shared/Workflow";
    export type { Graph } from "core-shared/Graph";
    export type { WorkflowBuilder, WorkflowBuilderFn } from "core-shared/WorkflowFn";
}
`
