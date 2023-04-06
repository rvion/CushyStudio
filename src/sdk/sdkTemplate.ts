export const sdkTemplate: string = `/// <reference types="cytoscape" />

/// <reference types="vscode" />

/// <reference types="node" />
/// <reference types="node" />
declare module "core/ComfyNodeUID" {
    export type ComfyNodeUID = string;
}
declare module "core/ComfyAPI" {
    import type { ComfyNodeUID } from "core/ComfyNodeUID";
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
declare module "core/ComfyPrompt" {
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
declare module "graph/cyto" {
    import cytoscape from 'cytoscape';
    import { Graph } from "core/Graph";
    import { ComfyNode } from "core/CSNode";
    export class Cyto {
        graph: Graph;
        cy: cytoscape.Core;
        constructor(graph: Graph);
        at: number;
        addEdge: (edge: {
            sourceUID: string;
            targetUID: string;
            input: string;
        }) => void;
        removeEdge: (id: string) => void;
        trackNode: (node: ComfyNode<any>) => void;
        animate: () => void;
        setStyle: () => void;
        mounted: boolean;
        mount: (element: HTMLElement) => void;
    }
}
declare module "core/ComfyUtils" {
    export const exhaust: (x: never) => never;
    export const sleep: (ms: number) => Promise<unknown>;
    export function jsEscapeStr(x: any): any;
    /** usefull to catch most *units* type errors */
    export type Tagged<O, Tag> = O & {
        __tag?: Tag;
    };
    /** same as Tagged, but even scriter */
    export type Branded<O, Brand> = O & {
        __brand: Brand;
    };
    export type Maybe<T> = T | null | undefined;
    export const deepCopyNaive: <T>(x: T) => T;
}
declare module "fs/pathUtils" {
    import type { Branded } from "core/ComfyUtils";
    export * as pathe from 'pathe';
    export type RelativePath = Branded<string, 'WorkspaceRelativePath'>;
    export type AbsolutePath = Branded<string, 'Absolute'>;
    export type MonacoPath = Branded<string, 'Monaco'>;
    /** brand a path as an absolute path after basic checks */
    export const asAbsolutePath: (path: string) => AbsolutePath;
    /** brand a path as a workspace relative pathpath after basic checks */
    export const asRelativePath: (path: string) => RelativePath;
    /** brand a path as a monaco URI path after basic checks */
    export const asMonacoPath: (path: string) => MonacoPath;
}
declare module "utils/timestamps" {
    export const getYYYYMMDDHHMMSS: () => string;
    export const getYYYYMMDD_HHMM_SS: () => string;
}
declare module "importers/getPngMetadata" {
    export type TextChunks = {
        [key: string]: string;
    };
    export function getPngMetadata(file: File): Promise<TextChunks>;
}
declare module "importers/ImportCandidate" {
    import type { Maybe } from "core/ComfyUtils";
    import { Workspace } from "core/Workspace";
    import { TextChunks } from "importers/getPngMetadata";
    /** wrapper around files dropped into comfy
     * responsibilities:
     * - possible import strategies detections
     * - centralize import-related logic
     * - track / follow import progress, and accumulate errors in observable props
     */
    export class ImportCandidate {
        workspace: Workspace;
        file: File;
        title: string;
        path: string;
        size: number;
        type: string;
        isPng: boolean;
        isImg: boolean;
        pngMetadata: Maybe<TextChunks>;
        canBeImportedAsWorspaceAsset: boolean;
        canBeImportedAsCushyScript: boolean;
        canBeImportedAsComfyUIJSON: boolean;
        constructor(workspace: Workspace, file: File);
        importAsScript: () => void;
        importAsAsset: () => void;
    }
}
declare module "core/ComfySchemaJSON" {
    /** type of the file sent by the backend at /object_info */
    export type ComfySchemaJSON = {
        [nodeTypeName: string]: ComfyNodeSchemaJSON;
    };
    export type ComfyNodeSchemaJSON = {
        input: {
            required: {
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
        [key: string]: any;
    };
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
    import type { ScriptStep_Iface } from "controls/ScriptStep_Iface";
    import type { Maybe } from "core/ComfyUtils";
    export class ScriptStep_askBoolean implements ScriptStep_Iface<boolean> {
        msg: string;
        def?: Maybe<boolean>;
        uid: string;
        name: string;
        constructor(msg: string, def?: Maybe<boolean>);
        locked: boolean;
        value: Maybe<boolean>;
        private _resolve;
        finished: Promise<boolean>;
        answer: (value: boolean) => void;
    }
    export class ScriptStep_askString implements ScriptStep_Iface<string> {
        msg: string;
        def?: Maybe<string>;
        uid: string;
        name: string;
        constructor(msg: string, def?: Maybe<string>);
        locked: boolean;
        value: Maybe<string>;
        private _resolve;
        finished: Promise<string>;
        answer: (value: string) => void;
    }
}
declare module "core/ScriptStep" {
    import type { ScriptStep_prompt } from "controls/ScriptStep_prompt";
    import type { ScriptStep_Init } from "controls/ScriptStep_Init";
    import type { ScriptStep_askBoolean, ScriptStep_askString } from "controls/ScriptStep_ask";
    export type ScriptStep = ScriptStep_Init | ScriptStep_prompt | ScriptStep_askBoolean | ScriptStep_askString;
}
declare module "help/TutorialUI" {
    export const TutorialUI: import("react").FunctionComponent<object>;
}
declare module "ui/Image" {
    import type { Maybe } from "core/ComfyUtils";
    export const Image: (p: {
        onClick?: () => void;
        height?: number | string;
        width?: number | string;
        fit?: 'cover' | 'contain';
        src?: Maybe<string>;
        alt?: string;
        className?: string;
    }) => JSX.Element;
}
declare module "layout/LayoutState" {
    import type { PromptOutputImage } from "core/PromptOutputImage";
    import { Workspace } from "core/Workspace";
    export class CushyLayoutState {
        client: Workspace;
        galleryFocus: PromptOutputImage | null;
        gallerySize: number;
        constructor(client: Workspace);
    }
}
declare module "logger/Logger" {
    import * as vscode from 'vscode';
    export enum LogLevel {
        DEBUG = 0,
        INFO = 1,
        WARN = 2,
        ERROR = 3
    }
    type Category = 
    /** Comfy websocket */
    '🧦'
    /** */
     | '🐰' | '🌠'
    /** monaco / typescript */
     | '👁️'
    /** Comfy HTTP */
     | '🦊'
    /** config files */
     | '🛋'
    /** execution emoji */
     | '🔥'
    /** fs operation */
     | '💿';
    interface LogMessage {
        level: LogLevel;
        category: Category;
        message: string;
        timestamp: Date;
    }
    export class Logger {
        level: LogLevel;
        history: LogMessage[];
        chanel: vscode.OutputChannel;
        constructor(level?: LogLevel);
        private addToLogHistory;
        debug(category: Category, message: string): void;
        info(category: Category, message: string): void;
        warn(category: Category, message: string): void;
        error(category: Category, message: string): void;
    }
    export const logger: Logger;
}
declare module "templates/Template" {
    import type { Workspace } from "core/Workspace";
    export class Template {
        name: string;
        code: string;
        constructor(name: string, code: string);
        createProjectCopy(workspace: Workspace): void;
    }
}
declare module "sdk/sdkTemplate" {
    export const sdkTemplate: string;
}
declare module "templates/defaultProjectCode" {
    export const defaultScript = "WORKFLOW(async (x) => {\n    // generate an empty table\n    const ckpt = x.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })\n    const latent = x.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })\n    const positive = x.CLIPTextEncode({ text: 'masterpiece, chair', clip: ckpt })\n    const negative = x.CLIPTextEncode({ text: '', clip: ckpt })\n    const sampler = x.KSampler({ seed: 2123, steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })\n    const vae = x.VAEDecode({ samples: sampler, vae: ckpt })\n\n    x.SaveImage({ filename_prefix: 'ComfyUI', images: vae })\n    await x.get()\n})";
}
declare module "ws/ResilientWebsocket" {
    import type { Maybe } from "core/ComfyUtils";
    import { CloseEvent, Event, MessageEvent, EventListenerOptions } from 'ws';
    type Message = string | Buffer;
    export class ResilientWebSocketClient {
        options: {
            url: () => string;
            onMessage: (event: MessageEvent) => void;
        };
        private url;
        private currentWS?;
        private messageBuffer;
        isOpen: boolean;
        constructor(options: {
            url: () => string;
            onMessage: (event: MessageEvent) => void;
        });
        reconnectTimeout?: Maybe<NodeJS.Timeout>;
        updateURL(url: string): void;
        get emoji(): "🟢" | "🔴";
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
declare module "core/ComfyPrimitives" {
    export const ComfyPrimitiveMapping: {
        [key: string]: string;
    };
    export const ComfyPrimitives: string[];
}
declare module "core/ComfySchema" {
    import type { ComfySchemaJSON } from "core/ComfySchemaJSON";
    import type { ItemDataType } from 'rsuite/esm/@types/common';
    export type EnumHash = string;
    export type EnumName = string;
    export type NodeInputExt = {
        name: string;
        type: string;
        opts?: any;
        isPrimitive: boolean;
    };
    export type NodeOutputExt = {
        type: string;
        name: string;
        isPrimitive: boolean;
    };
    export class ComfySchema {
        spec: ComfySchemaJSON;
        knownTypes: Set<string>;
        knownEnums: Map<string, {
            enumNameInComfy: string;
            enumNameInCushy: EnumName;
            values: string[];
        }>;
        nodes: ComfyNodeSchema[];
        nodesByNameInComfy: {
            [key: string]: ComfyNodeSchema;
        };
        nodesByNameInCushy: {
            [key: string]: ComfyNodeSchema;
        };
        components: ItemDataType[];
        constructor(spec: ComfySchemaJSON);
        normalizeJSIdentifier: (name: string) => string;
        update(spec: ComfySchemaJSON): void;
        updateComponents(): void;
        codegenDTS: (useLocalPath?: boolean) => string;
        private toTSType;
    }
    export class ComfyNodeSchema {
        nameInComfy: string;
        nameInCushy: string;
        category: string;
        inputs: NodeInputExt[];
        outputs: NodeOutputExt[];
        constructor(nameInComfy: string, nameInCushy: string, category: string, inputs: NodeInputExt[], outputs: NodeOutputExt[]);
        codegen(): string;
    }
}
declare module "templates/Library" {
    import { Template } from "templates/Template";
    export const demoLibrary: Template[];
}
declare module "core/toposort" {
    export type TNode = string;
    export type TEdge = [TNode, TNode];
    export function toposort(nodes: TNode[], edges: TEdge[]): TNode[];
}
declare module "importers/ImportComfyImage" {
    import { Workspace } from "core/Workspace";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
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
        convertFlowToCode: (flow: ComfyPromptJSON) => string;
    }
}
declare module "utils/stringifyReadable" {
    export function readableStringify(obj: any, maxLevel?: number, level?: number): string;
}
declare module "core/transpiler" {
    export function transpileCode(code: string): Promise<string>;
}
declare module "core/Workspace" {
    import * as vscode from 'vscode';
    
    import type { ImportCandidate } from "importers/ImportCandidate";
    import type { ComfySchemaJSON } from "core/ComfySchemaJSON";
    import type { Maybe } from "core/ComfyUtils";
    import { Run } from "core/Run";
    import { CushyLayoutState } from "layout/LayoutState";
    import { Template } from "templates/Template";
    import { RelativePath } from "fs/pathUtils";
    import { ResilientWebSocketClient } from "ws/ResilientWebsocket";
    import { ComfyStatus, ComfyUploadImageResult } from "core/ComfyAPI";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    import { ComfySchema } from "core/ComfySchema";
    import { RunMode } from "core/Graph";
    export type WorkspaceConfigJSON = {
        version: 2;
        comfyWSURL: string;
        comfyHTTPURL: string;
        lastProjectFolder?: string;
    };
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
        wspUri: vscode.Uri;
        schema: ComfySchema;
        demos: Template[];
        assets: Map<string, boolean>;
        layout: CushyLayoutState;
        importQueue: ImportCandidate[];
        removeCandidate: (candidate: ImportCandidate) => void;
        /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
        get relativeCacheFolderPath(): RelativePath;
        runs: Run[];
        RUN: (mode?: RunMode) => Promise<boolean>;
        comfyJSONUri: vscode.Uri;
        comfyTSUri: vscode.Uri;
        cushyTSUri: vscode.Uri;
        writeBinaryFile(relPath: RelativePath, content: Buffer, open?: boolean): void;
        writeTextFile(uri: vscode.Uri, content: string, open?: boolean): void;
        constructor(wspUri: vscode.Uri);
        /** will be created only after we've loaded cnfig file
         * so we don't attempt to connect to some default server */
        ws: ResilientWebSocketClient;
        init(): Promise<void>;
        sid: string;
        activeRun: Maybe<Run>;
        onMessage: (e: WS.MessageEvent) => void;
        private RANDOM_IMAGE_URL;
        /** attempt to convert an url to a Blob */
        private getUrlAsBlob;
        uploadURL: (url?: string) => Promise<ComfyUploadImageResult>;
        createProjectAndFocustIt: (workspaceRelativeFilePath: vscode.Uri, scriptContent?: string) => void;
        resolve: (relativePath: RelativePath) => vscode.Uri;
        /** save an image at given url to disk */
        saveImgToDisk: (url?: string) => Promise<'ok'>;
        /** upload an image present on disk to ComfyServer */
        uploadImgFromDisk: (path: string) => Promise<ComfyUploadImageResult>;
        /** upload an Uint8Array buffer as png to ComfyServer */
        uploadUIntArrToComfy: (ui8arr: Blob) => Promise<ComfyUploadImageResult>;
        get serverHostHTTP(): string;
        CRITICAL_ERROR: Maybe<CSCriticalError>;
        /** retri e the comfy spec from the schema*/
        updateComfy_object_info: () => Promise<ComfySchemaJSON>;
        get schemaStatusEmoji(): "🟢" | "🔴";
        status: ComfyStatus | null;
        notify: (msg: string) => Thenable<string | undefined>;
        addProjectFromComfyWorkflowJSON: (title: string, comfyPromptJSON: ComfyPromptJSON) => Promise<void>;
    }
}
declare module "core/PromptOutputImage" {
    import type { ComfyImageInfo } from "core/ComfyAPI";
    import type { Maybe } from "core/ComfyUtils";
    import type { ScriptStep_prompt } from "controls/ScriptStep_prompt";
    import type { Workspace } from "core/Workspace";
    import { RelativePath } from "fs/pathUtils";
    /** Cushy wrapper around ComfyImageInfo */
    export class PromptOutputImage {
        /** the prompt this file has been generated from */
        prompt: ScriptStep_prompt;
        /** image info as returned by Comfy */
        data: ComfyImageInfo;
        workspace: Workspace;
        constructor(
        /** the prompt this file has been generated from */
        prompt: ScriptStep_prompt, 
        /** image info as returned by Comfy */
        data: ComfyImageInfo);
        /** url to acces the image */
        get comfyURL(): string;
        /** unique image id */
        uid: string;
        /** path within the input folder */
        inputPath?: Maybe<string>;
        /** true if file exists on disk; false otherwise */
        saved: boolean;
        get folder(): RelativePath;
        get fileName(): string;
        get filePath(): RelativePath;
        saveOnDisk: () => Promise<void>;
        /** this is such a bad workaround but 🤷‍♂️ */
        makeAvailableAsInput: () => Promise<string>;
    }
}
declare module "core/Run" {
    import * as vscode from 'vscode';
    import { Cyto } from "graph/cyto";
    import { RelativePath } from "fs/pathUtils";
    import { WsMsgExecuted } from "core/ComfyAPI";
    import { Graph } from "core/Graph";
    import { Maybe } from "core/ComfyUtils";
    import { PromptOutputImage } from "core/PromptOutputImage";
    import { ScriptStep } from "core/ScriptStep";
    import { ScriptStep_prompt } from "controls/ScriptStep_prompt";
    import { Workspace } from "core/Workspace";
    /** script exeuction instance */
    export class Run {
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
        cyto: Cyto;
        /** list of all images produed over the whole script execution */
        gallery: PromptOutputImage[];
        /** folder where CushyStudio will save run informations */
        get workspaceRelativeCacheFolderPath(): RelativePath;
        /** save current script */
        save: () => Promise<void>;
        folder: vscode.Uri;
        constructor(workspace: Workspace, uri: vscode.Uri, opts?: {
            mock?: boolean | undefined;
        } | undefined);
        steps: ScriptStep[];
        /** current step */
        get step(): ScriptStep;
        askBoolean: (msg: string, def?: Maybe<boolean>) => Promise<boolean>;
        askString: (msg: string, def?: Maybe<string>) => Promise<string>;
        /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
        outputs: WsMsgExecuted[];
        sendPromp: () => ScriptStep_prompt;
        ctx: {};
    }
}
declare module "controls/ScriptStep_prompt" {
    import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from "core/ComfyAPI";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { ScriptStep_Iface } from "controls/ScriptStep_Iface";
    import type { ComfyNode } from "core/CSNode";
    import type { Run } from "core/Run";
    import { Graph } from "core/Graph";
    import { PromptOutputImage } from "core/PromptOutputImage";
    export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
        run: Run;
        prompt: ComfyPromptJSON;
        private static promptID;
        /** unique step id */
        uid: string;
        /** human-readable step name */
        name: string;
        /** deepcopy of run graph at creation time; ready to be forked */
        _graph: Graph;
        /** short-hand getter to access parent client */
        get workspace(): import("core/Workspace").Workspace;
        constructor(run: Run, prompt: ComfyPromptJSON);
        _resolve: (value: this) => void;
        _rejects: (reason: any) => void;
        finished: Promise<this>;
        /** pointer to the currently executing node */
        currentExecutingNode: ComfyNode<any> | null;
        /** update the progress value of the currently focused onde */
        onProgress: (msg: WsMsgProgress) => void;
        notifyEmptyPrompt: () => Thenable<string | undefined>;
        /** update pointer to the currently executing node */
        onExecuting: (msg: WsMsgExecuting) => void;
        /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
        private outputs;
        images: PromptOutputImage[];
        /** udpate execution list */
        onExecuted: (msg: WsMsgExecuted) => void;
        /** finish this step */
        private _finish;
    }
}
declare module "ui/VisUI" {
    type Node = any;
    type Edge = any;
    type Options = any;
    export type VisNodes = any;
    export type VisEdges = any;
    export type VisOptions = any;
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
declare module "core/ComfyColors" {
    export const comfyColors: {
        [category: string]: string;
    };
}
declare module "core/Graph" {
    import type { ScriptStep_prompt } from "controls/ScriptStep_prompt";
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import type { ComfyNodeUID } from "core/ComfyNodeUID";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { Maybe } from "core/ComfyUtils";
    import type { Run } from "core/Run";
    import { Cyto } from "graph/cyto";
    import { ComfyNode } from "core/CSNode";
    import { ComfySchema } from "core/ComfySchema";
    import { PromptOutputImage } from "core/PromptOutputImage";
    import { Workspace } from "core/Workspace";
    export type RunMode = 'fake' | 'real';
    export class Graph {
        workspace: Workspace;
        run: Run;
        uid: string;
        get schema(): ComfySchema;
        cyto?: Cyto;
        uploadImgFromDisk: (path: string) => Promise<import("core/ComfyAPI").ComfyUploadImageResult>;
        registerNode: (node: ComfyNode<any>) => void;
        get nodes(): ComfyNode<any>[];
        nodesIndex: Map<string, ComfyNode<any>>;
        isRunning: boolean;
        /** pick a random seed */
        randomSeed(): number;
        wildcards: import("wildcards/wildcards").Wildcards;
        /** return the coresponding comfy prompt  */
        get json(): ComfyPromptJSON;
        convertToImageInput: (x: PromptOutputImage) => string;
        /** temporary proxy */
        convertToImageInputOLD1: (x: PromptOutputImage) => Promise<string>;
        askBoolean: (msg: string, def?: Maybe<boolean>) => Promise<boolean>;
        askString: (msg: string, def?: Maybe<string>) => Promise<string>;
        print: (msg: string) => void;
        constructor(workspace: Workspace, run: Run, json?: ComfyPromptJSON);
        private _nextUID;
        getUID: () => string;
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        /** all images generated by nodes in this graph */
        get allImages(): PromptOutputImage[];
        /** wether it should really send the prompt to the backend */
        get runningMode(): RunMode;
        get(): Promise<ScriptStep_prompt>;
        /** visjs JSON format (network visualisation) */
        get JSON_forVisDataVisualisation(): {
            nodes: VisNodes[];
            edges: VisEdges[];
        };
    }
}
declare module "core/CSNode" {
    import type { NodeProgress, WsMsgExecutedData } from "core/ComfyAPI";
    import type { Graph } from "core/Graph";
    import type { ComfyNodeJSON } from "core/ComfyPrompt";
    import { ComfyNodeOutput } from "core/ComfyNodeOutput";
    import { ComfyNodeUID } from "core/ComfyNodeUID";
    import { ComfyNodeSchema } from "core/ComfySchema";
    import { PromptOutputImage } from "core/PromptOutputImage";
    /** ComfyNode
     * - correspond to a signal in the graph
     * - belongs to a script
     */
    export class ComfyNode<ComfyNode_input extends object> {
        graph: Graph;
        uid: string;
        artifacts: WsMsgExecutedData[];
        images: PromptOutputImage[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        status: 'executing' | 'done' | 'error' | 'waiting' | null;
        get isExecuting(): boolean;
        get statusEmoji(): "" | "🔥" | "❌" | "⏳" | "✅";
        get inputs(): ComfyNode_input;
        json: ComfyNodeJSON;
        /** update a node */
        set(p: Partial<ComfyNode_input>): void;
        get color(): string;
        $outputs: ComfyNodeOutput<any>[];
        constructor(graph: Graph, uid: string, xxx: ComfyNodeJSON);
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
        get manager(): import("core/Workspace").Workspace;
        get(): Promise<void>;
        serializeValue(field: string, value: unknown): unknown;
        private _getExpecteTypeForField;
        private _getOutputForType;
    }
}
declare module "core/ComfyNodeOutput" {
    import { ComfyNode } from "core/CSNode";
    export class ComfyNodeOutput<T, Ix extends number = number> {
        node: ComfyNode<any>;
        slotIx: Ix;
        type: T;
        constructor(node: ComfyNode<any>, slotIx: Ix, type: T);
    }
}
declare module "sdk/sdkEntrypoint" {
    export type { ComfyNodeOutput } from "core/ComfyNodeOutput";
    export type { ComfyNodeUID } from "core/ComfyNodeUID";
    export type { ComfyNode } from "core/CSNode";
    export type { ComfyNodeSchemaJSON } from "core/ComfySchemaJSON";
}
`