export const sdkTemplate: string = `




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
declare module "core-types/NodeUID" {
    export type ComfyNodeUID = string;
}
declare module "core-shared/Workflow" {
    export type WorkflowBuilder = (graph: any) => void;
    export class Workflow {
        builder: WorkflowBuilder;
        constructor(builder: WorkflowBuilder);
    }
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
declare module "graph/cyto" {
    import cytoscape from 'cytoscape';
    import { Graph } from "core-shared/Graph";
    import { ComfyNode } from "core-shared/Node";
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
declare module "core-shared/Colors" {
    export const comfyColors: {
        [category: string]: string;
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
declare module "core-shared/Schema" {
    import type { ComfySchemaJSON } from "core-types/ComfySchemaJSON";
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
    export class Schema {
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
declare module "utils/ComfyUtils" {
    export const exhaust: (x: never) => never;
    export const sleep: (ms: number) => Promise<unknown>;
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
declare module "fs/pathUtils" {
    import type { Branded } from "utils/ComfyUtils";
    export * as pathe from 'pathe';
    export type RelativePath = Branded<string, 'WorkspaceRelativePath'>;
    export type AbsolutePath = Branded<string, 'Absolute'>;
    /** brand a path as an absolute path after basic checks */
    export const asAbsolutePath: (path: string) => AbsolutePath;
    /** brand a path as a workspace relative pathpath after basic checks */
    export const asRelativePath: (path: string) => RelativePath;
}
declare module "utils/timestamps" {
    export const getYYYYMMDDHHMMSS: () => string;
    export const getYYYYMMDD_HHMM_SS: () => string;
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
    import type { Maybe } from "utils/ComfyUtils";
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
declare module "core-types/FlowExecutionStep" {
    import type { PromptExecution } from "controls/ScriptStep_prompt";
    import type { ScriptStep_Init } from "controls/ScriptStep_Init";
    import type { ScriptStep_askBoolean, ScriptStep_askString } from "controls/ScriptStep_ask";
    export type FlowExecutionStep = ScriptStep_Init | PromptExecution | ScriptStep_askBoolean | ScriptStep_askString;
}
declare module "importers/getPngMetadata" {
    export type TextChunks = {
        [key: string]: string;
    };
    export function getPngMetadata(file: File): Promise<TextChunks>;
}
declare module "importers/ImportCandidate" {
    import type { Maybe } from "utils/ComfyUtils";
    import { Workspace } from "core-back/Workspace";
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
declare module "layout/LayoutState" {
    import type { GeneratedImage } from "core-back/GeneratedImage";
    import { Workspace } from "core-back/Workspace";
    export class CushyLayoutState {
        client: Workspace;
        galleryFocus: GeneratedImage | null;
        gallerySize: number;
        constructor(client: Workspace);
    }
}
declare module "logger/LogTypes" {
    export interface LogMessage {
        level: LogLevel;
        category: LogCategory;
        message: string;
        timestamp: Date;
    }
    export enum LogLevel {
        DEBUG = 0,
        INFO = 1,
        WARN = 2,
        ERROR = 3
    }
    export type LogCategory = 
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
}
declare module "logger/LoggerBack" {
    import type { Maybe } from "utils/ComfyUtils";
    import { LogCategory, LogLevel, LogMessage } from "logger/LogTypes";
    import * as vscode from 'vscode';
    export class Logger {
        level: LogLevel;
        history: LogMessage[];
        /**
         *  - available in the extension process
         *  - not available in the webview process
         */
        chanel: Maybe<vscode.OutputChannel>;
        constructor(level?: LogLevel);
        private addToLogHistory;
        debug(category: LogCategory, message: string): void;
        info(category: LogCategory, message: string): void;
        warn(category: LogCategory, message: string): void;
        error(category: LogCategory, message: string): void;
    }
    export const loggerExt: Logger;
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
declare module "sdk/sdkTemplate" {
    export const sdkTemplate: string;
}
declare module "templates/defaultProjectCode" {
    export const defaultScript: string;
}
declare module "core-back/ResilientWebsocket" {
    import type { Maybe } from "utils/ComfyUtils";
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
declare module "templates/Library" {
    import { Template } from "templates/Template";
    export const demoLibrary: Template[];
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
        convertFlowToCode: (title: string, flow: ComfyPromptJSON) => string;
    }
}
declare module "utils/stringifyReadable" {
    export function readableStringify(obj: any, maxLevel?: number, level?: number): string;
}
declare module "core-back/transpiler" {
    export function transpileCode(code: string): Promise<string>;
}
declare module "core-back/Flow" {
    import type { CushyFile } from "core-back/CushyFile";
    import type { RunMode } from "core-shared/Graph";
    import * as vscode from 'vscode';
    /**
     * a thin wrapper around a single (work)flow somewhere in a .cushy.ts file
     * flow = the 'WORFLOW(...)' part of a file
     * */
    export class Flow {
        file: CushyFile;
        range: vscode.Range;
        flowName: string;
        generation: number;
        constructor(file: CushyFile, range: vscode.Range, flowName: string, generation: number);
        run: (item: vscode.TestItem, options: vscode.TestRun, mode?: RunMode) => Promise<boolean>;
    }
}
declare module "utils/bang" {
    /** assertNotNull */
    export const bang: <T>(x: T | null) => T;
}
declare module "core-back/extractWorkflows" {
    import * as vscode from 'vscode';
    export const extractWorkflows: (text: string, events: {
        onTest(range: vscode.Range, workflowName: string): void;
    }) => void;
}
declare module "core-back/CushyFile" {
    import * as vscode from 'vscode';
    import { Flow } from "core-back/Flow";
    import { Workspace } from "core-back/Workspace";
    export type MarkdownTestData = CushyFile | /* TestHeading |*/ Flow;
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
declare module "core-back/FlowExecutionManager" {
    import type { Workspace } from "core-back/Workspace";
    import * as vscode from 'vscode';
    import { Flow } from "core-back/Flow";
    export class FlowExecutionManager {
        request: vscode.TestRunRequest;
        workspace: Workspace;
        queue: {
            vsTestItem: vscode.TestItem;
            cushyFlow: Flow;
        }[];
        run: vscode.TestRun;
        constructor(request: vscode.TestRunRequest, workspace: Workspace);
        START: () => Promise<void>;
        discoverTests: (tests: Iterable<vscode.TestItem>) => Promise<void>;
        runTestQueue: () => Promise<void>;
    }
}
declare module "fs/getUri" {
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
declare module "fs/getNonce" {
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
declare module "core-types/MessageFromExtensionToWebview" {
    import type { WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from "core-types/ComfyWsPayloads";
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { ComfySchemaJSON } from "core-types/ComfySchemaJSON";
    import type { Maybe } from "utils/ComfyUtils";
    export type MessageFromExtensionToWebview = {
        type: 'ask-string';
        message: string;
        default?: Maybe<string>;
    } | {
        type: 'ask-boolean';
        message: string;
        default?: Maybe<boolean>;
    } | {
        type: 'schema';
        schema: ComfySchemaJSON;
    } | {
        type: 'prompt';
        graph: ComfyPromptJSON;
    } | /* type 'status'   */ WsMsgStatus | /* type 'progress' */ WsMsgProgress | /* type 'executing'*/ WsMsgExecuting | /* type 'executed' */ WsMsgExecuted | {
        type: 'images';
        uris: string[];
    };
}
declare module "core-back/FrontManager" {
    import { Webview, Uri } from 'vscode';
    import { MessageFromExtensionToWebview } from "core-types/MessageFromExtensionToWebview";
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
    export class FrontManager {
        /** A reference to the webview panel */
        private panel;
        /** The URI of the directory containing the extension */
        private extensionUri;
        static currentPanel: FrontManager | undefined;
        private _disposables;
        static send(message: MessageFromExtensionToWebview): void;
        private static send_RAW;
        webview: Webview;
        /**
         * singleton class;
         * do not use constructor directly;
         * instanciate via static 'render' method
         */
        private constructor();
        /**
         * Renders the current webview panel if it exists otherwise a new webview panel
         * will be created and displayed.
         *
         * @param extensionUri The URI of the directory containing the extension.
         */
        static render(extensionUri: Uri): void;
        /**
         * Cleans up and disposes of webview resources when the webview panel is closed.
         */
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
        static with: <A>(fn: (current: FrontManager) => A) => A;
        getExtensionLocalUri: (pathList: string[]) => Uri;
        /**
         * Sets up an event listener to listen for messages passed from the webview context and
         * executes code based on the message that is recieved.
         *
         * @param webview A reference to the extension webview
         * @param context A reference to the extension context
         */
        private _setWebviewMessageListener;
    }
}
declare module "core-back/Workspace" {
    import * as vscode from 'vscode';
    
    import type { ImportCandidate } from "importers/ImportCandidate";
    import type { ComfySchemaJSON } from "core-types/ComfySchemaJSON";
    import type { Maybe } from "utils/ComfyUtils";
    import { FlowExecution } from "core-back/FlowExecution";
    import { CushyLayoutState } from "layout/LayoutState";
    import { Template } from "templates/Template";
    import { RelativePath } from "fs/pathUtils";
    import { ResilientWebSocketClient } from "core-back/ResilientWebsocket";
    import { ComfyStatus, ComfyUploadImageResult } from "core-types/ComfyWsPayloads";
    import { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import { Schema } from "core-shared/Schema";
    import { RunMode } from "core-shared/Graph";
    import { CushyFile } from "core-back/CushyFile";
    import { GeneratedImage } from "core-back/GeneratedImage";
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
        context: vscode.ExtensionContext;
        wspUri: vscode.Uri;
        schema: Schema;
        /** template /snippet library one can */
        demos: Template[];
        comfySessionId: string;
        activeRun: Maybe<FlowExecution>;
        assets: Map<string, boolean>;
        layout: CushyLayoutState;
        vsTestController: vscode.TestController;
        fileChangedEmitter: vscode.EventEmitter<vscode.Uri>;
        importQueue: ImportCandidate[];
        removeCandidate: (candidate: ImportCandidate) => void;
        /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
        get relativeCacheFolderPath(): RelativePath;
        runs: FlowExecution[];
        RUN_CURRENT_FILE: (mode?: RunMode) => Promise<boolean>;
        comfyJSONUri: vscode.Uri;
        comfyTSUri: vscode.Uri;
        cushyTSUri: vscode.Uri;
        writeBinaryFile(relPath: RelativePath, content: Buffer, open?: boolean): void;
        writeTextFile(uri: vscode.Uri, content: string, open?: boolean): void;
        updateNodeForDocument(e: vscode.TextDocument): void;
        /** wrapper around vscode.tests.createTestController so logic is self-contained  */
        initVSTestController(): vscode.TestController;
        initOutputChannel: () => void;
        constructor(context: vscode.ExtensionContext, wspUri: vscode.Uri);
        autoDiscoverEveryWorkflow: () => void;
        /** will be created only after we've loaded cnfig file
         * so we don't attempt to connect to some default server */
        ws: ResilientWebSocketClient;
        initWebsocket: () => ResilientWebSocketClient;
        /** ensure webview is opened */
        ensureWebviewPanelIsOpened: () => void;
        onMessage: (e: WS.MessageEvent) => void | GeneratedImage[];
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
        getOrCreateFile(vsTestController: vscode.TestController, uri: vscode.Uri): CushyFile;
        startWatchingWorkspace(controller: vscode.TestController, fileChangedEmitter: vscode.EventEmitter<vscode.Uri>): vscode.FileSystemWatcher[];
        getWorkspaceTestPatterns(): {
            workspaceFolder: vscode.WorkspaceFolder;
            pattern: vscode.RelativePattern;
        }[];
        findInitialFiles(controller: vscode.TestController, pattern: vscode.GlobPattern): Promise<void>;
    }
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
declare module "core-back/FlowExecution" {
    import * as vscode from 'vscode';
    import { RelativePath } from "fs/pathUtils";
    import { WsMsgExecuted } from "core-types/ComfyWsPayloads";
    import { Graph } from "core-shared/Graph";
    import { Maybe } from "utils/ComfyUtils";
    import { GeneratedImage } from "core-back/GeneratedImage";
    import { FlowExecutionStep } from "core-types/FlowExecutionStep";
    import { PromptExecution } from "controls/ScriptStep_prompt";
    import { Workspace } from "core-back/Workspace";
    /** script exeuction instance */
    export class FlowExecution {
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
        /** list of all images produed over the whole script execution */
        generatedImages: GeneratedImage[];
        /** folder where CushyStudio will save run informations */
        get workspaceRelativeCacheFolderPath(): RelativePath;
        /** save current script */
        folder: vscode.Uri;
        /** ask user to input a boolean (true/false) */
        askBoolean: (msg: string, def?: Maybe<boolean>) => Promise<boolean>;
        /** ask the user to input a string */
        askString: (msg: string, def?: Maybe<string>) => Promise<string>;
        /** built-in wildcards */
        wildcards: import("wildcards/wildcards").Wildcards;
        /** pick a random seed */
        randomSeed(): number;
        /** display something in the console */
        print: (msg: string) => void;
        /** upload a file from disk to the ComfyUI backend */
        uploadImgFromDisk: (path: string) => Promise<import("core-types/ComfyWsPayloads").ComfyUploadImageResult>;
        PROMPT(): Promise<PromptExecution>;
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
declare module "controls/ScriptStep_prompt" {
    import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from "core-types/ComfyWsPayloads";
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { ScriptStep_Iface } from "controls/ScriptStep_Iface";
    import type { ComfyNode } from "core-shared/Node";
    import type { FlowExecution } from "core-back/FlowExecution";
    import { Graph } from "core-shared/Graph";
    import { GeneratedImage } from "core-back/GeneratedImage";
    export class PromptExecution implements ScriptStep_Iface<PromptExecution> {
        run: FlowExecution;
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
        constructor(run: FlowExecution, prompt: ComfyPromptJSON);
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
        images: GeneratedImage[];
        /** udpate execution list */
        onExecuted: (msg: WsMsgExecuted) => GeneratedImage[];
        /** finish this step */
        private _finish;
    }
}
declare module "core-back/GeneratedImage" {
    import * as vscode from 'vscode';
    import type { ComfyImageInfo } from "core-types/ComfyWsPayloads";
    import type { Maybe } from "utils/ComfyUtils";
    import type { PromptExecution } from "controls/ScriptStep_prompt";
    import type { Workspace } from "core-back/Workspace";
    import { RelativePath } from "fs/pathUtils";
    /** Cushy wrapper around ComfyImageInfo */
    export class GeneratedImage {
        /** the prompt this file has been generated from */
        prompt: PromptExecution;
        /** image info as returned by Comfy */
        data: ComfyImageInfo;
        workspace: Workspace;
        constructor(
        /** the prompt this file has been generated from */
        prompt: PromptExecution, 
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
        /** @internal folder in which the image should be saved */
        private get folder();
        /** @internal */
        private get fileName();
        /** @internal */
        get filePath(): RelativePath;
        /** @internal */
        get uri(): vscode.Uri;
        /** @internal */
        downloadImageAndSaveToDisk: () => Promise<void>;
        /** this is such a bad workaround but 🤷‍♂️ */
        uploadAsNamedInput: () => Promise<string>;
    }
}
declare module "core-shared/Graph" {
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import type { ComfyNodeUID } from "core-types/NodeUID";
    import type { ComfyPromptJSON } from "core-types/ComfyPrompt";
    import type { WsMsgExecuting, WsMsgProgress } from "core-types/ComfyWsPayloads";
    import { Cyto } from "graph/cyto";
    import { ComfyNode } from "core-shared/Node";
    import { Schema } from "core-shared/Schema";
    import { GeneratedImage } from "core-back/GeneratedImage";
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
        uid: string;
        cyto?: Cyto;
        registerNode: (node: ComfyNode<any>) => void;
        get nodes(): ComfyNode<any>[];
        nodesIndex: Map<string, ComfyNode<any>>;
        isRunning: boolean;
        /** return the coresponding comfy prompt  */
        get json(): ComfyPromptJSON;
        convertToImageInput: (x: GeneratedImage) => string;
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
        get allImages(): GeneratedImage[];
        /** wether it should really send the prompt to the backend */
        /** visjs JSON format (network visualisation) */
        get JSON_forVisDataVisualisation(): {
            nodes: VisNodes[];
            edges: VisEdges[];
        };
    }
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
declare module "core-shared/Node" {
    import type { NodeProgress, WsMsgExecutedData } from "core-types/ComfyWsPayloads";
    import type { Graph } from "core-shared/Graph";
    import type { ComfyNodeJSON } from "core-types/ComfyPrompt";
    import { Slot } from "core-shared/Slot";
    import { ComfyNodeUID } from "core-types/NodeUID";
    import { ComfyNodeSchema } from "core-shared/Schema";
    import { GeneratedImage } from "core-back/GeneratedImage";
    /** ComfyNode
     * - correspond to a signal in the graph
     * - belongs to a script
     */
    export class ComfyNode<ComfyNode_input extends object> {
        graph: Graph;
        uid: string;
        artifacts: WsMsgExecutedData[];
        images: GeneratedImage[];
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
        $outputs: Slot<any>[];
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
        serializeValue(field: string, value: unknown): unknown;
        private _getExpecteTypeForField;
        private _getOutputForType;
    }
}
declare module "sdk/sdkEntrypoint" {
    export type { ComfyNodeSchemaJSON } from "core-types/ComfySchemaJSON";
    export type { ComfyNodeUID } from "core-types/NodeUID";
    export type { Workflow } from "core-shared/Workflow";
    export type { ComfyNode } from "core-shared/Node";
    export type { Slot } from "core-shared/Slot";
}
`