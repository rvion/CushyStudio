export const c__:string = `

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
        data: {
            node: ComfyNodeUID;
            output: {
                images: string[];
            };
        };
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
declare module "core/CodeBuffer" {
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
declare module "core/ComfyPrimitives" {
    export const ComfyPrimitiveMapping: {
        [key: string]: string;
    };
    export const ComfyPrimitives: string[];
}
declare module "core/ComfySchema" {
    import { ComfySchemaJSON } from "core/ComfySchemaJSON";
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
            name: EnumName;
            values: string[];
        }>;
        nodes: ComfyNodeSchema[];
        nodesByName: {
            [key: string]: ComfyNodeSchema;
        };
        constructor(spec: ComfySchemaJSON);
        update(spec: ComfySchemaJSON): void;
        codegenDTS: (useLocalPath?: boolean) => string;
        private toTSType;
    }
    export class ComfyNodeSchema {
        name: string;
        category: string;
        inputs: NodeInputExt[];
        outputs: NodeOutputExt[];
        constructor(name: string, category: string, inputs: NodeInputExt[], outputs: NodeOutputExt[]);
        codegen(): string;
    }
}
declare module "core/toposort" {
    export type TNode = string;
    export type TEdge = [TNode, TNode];
    export function toposort(nodes: TNode[], edges: TEdge[]): TNode[];
}
declare module "core/ComfyImporter" {
    import { ComfyClient } from "core/ComfyClient";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    /** Converts Comfy JSON prompts to ComfyScript code */
    export class ComfyImporter {
        client: ComfyClient;
        constructor(client: ComfyClient);
        convertFlowToCode: (flow: ComfyPromptJSON) => string;
    }
}
declare module "core/ComfyProject" {
    import type { RunMode } from "core/ComfyGraph";
    import { ComfyClient } from "core/ComfyClient";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    import { ScriptExecution } from "core/ScriptExecution";
    export class ComfyProject {
        client: ComfyClient;
        static __demoProjectIx: number;
        /** unique project id */
        id: string;
        /** project name */
        name: string;
        /** current  */
        focus: number;
        /** list of all project runs */
        runs: ScriptExecution[];
        /** last project run */
        currentRun: ScriptExecution | null;
        private constructor();
        /** convenient getter to retrive current client shcema */
        get schema(): import("core/ComfySchema").ComfySchema;
        code: string;
        udpateCode: (code: string) => Promise<void>;
        static INIT: (client: ComfyClient) => ComfyProject;
        static FROM_JSON: (client: ComfyClient, json: ComfyPromptJSON) => ComfyProject;
        /** converts a ComfyPromptJSON into it's canonical normal-form script */
        static LoadFromComfyPromptJSON: (json: ComfyPromptJSON) => never;
        /** * project running is not the same as graph running; TODO: explain */
        isRunning: boolean;
        run: (mode?: RunMode) => Promise<boolean>;
    }
}
declare module "core/ScriptStep_Iface" {
    /** every ExecutionStep class must implements this interface  */
    export interface ScriptStep_Iface<Result> {
        /** name of the step */
        name: string;
        /** promise to await if you need to wait until the step is finished */
        finished: Promise<Result>;
    }
}
declare module "core/ScriptStep_prompt" {
    import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from "core/ComfyAPI";
    import type { ScriptExecution } from "core/ScriptExecution";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { ComfyNode } from "core/ComfyNode";
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
        execution: ScriptExecution;
        prompt: ComfyPromptJSON;
        name: string;
        constructor(execution: ScriptExecution, prompt: ComfyPromptJSON);
        _resolve: (value: this) => void;
        _rejects: (reason: any) => void;
        finished: Promise<this>;
        /** pointer to the currently executing node */
        currentExecutingNode: ComfyNode<any> | null;
        /** update the progress value of the currently focused onde */
        onProgress: (msg: WsMsgProgress) => void;
        notifyEmptyPrompt: () => undefined;
        /** update pointer to the currently executing node */
        onExecuting: (msg: WsMsgExecuting) => void;
        /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
        outputs: WsMsgExecuted[];
        /** udpate execution list */
        onExecuted: (msg: WsMsgExecuted) => void;
        /** finish this step */
        private _finish;
    }
}
declare module "core/ScriptStep_Init" {
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    export class ScriptStep_Init implements ScriptStep_Iface<true> {
        name: string;
        finished: Promise<true>;
    }
}
declare module "core/ScriptStep_ask" {
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    export class ScriptStep_askBoolean implements ScriptStep_Iface<boolean> {
        msg: string;
        name: string;
        constructor(msg: string);
        _resolve: (value: boolean) => void;
        _rejects: (reason: any) => void;
        finished: Promise<boolean>;
        answer: (value: boolean) => void;
    }
    export class ScriptStep_askString implements ScriptStep_Iface<string> {
        msg: string;
        name: string;
        constructor(msg: string);
        _resolve: (value: string) => void;
        _rejects: (reason: any) => void;
        finished: Promise<string>;
        answer: (value: string) => void;
    }
}
declare module "core/ScriptStep_Output" {
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    export class ScriptStep_Output implements ScriptStep_Iface<string[]> {
        images: string[];
        name: string;
        finished: Promise<string[]>;
        constructor(images: string[]);
    }
}
declare module "core/ScriptStep" {
    import type { ScriptStep_Output } from "core/ScriptStep_Output";
    import type { ScriptStep_prompt } from "core/ScriptStep_prompt";
    import type { ScriptStep_Init } from "core/ScriptStep_Init";
    import type { ScriptStep_askBoolean, ScriptStep_askString } from "core/ScriptStep_ask";
    export type ScriptStep = ScriptStep_Init | ScriptStep_prompt | ScriptStep_Output | ScriptStep_askBoolean | ScriptStep_askString;
}
declare module "core/ScriptExecution" {
    import type { ComfyProject } from "core/ComfyProject";
    import { ScriptStep_prompt } from "core/ScriptStep_prompt";
    import { ComfyGraph } from "core/ComfyGraph";
    import { WsMsgExecuted } from "core/ComfyAPI";
    import { ScriptStep_askBoolean } from "core/ScriptStep_ask";
    import { ScriptStep } from "core/ScriptStep";
    /** script runtime context */
    export class ScriptExecution {
        project: ComfyProject;
        opts?: {
            mock?: boolean | undefined;
        } | undefined;
        /** the main graph that will be updated along the script execution */
        graph: ComfyGraph;
        constructor(project: ComfyProject, opts?: {
            mock?: boolean | undefined;
        } | undefined);
        steps: ScriptStep[];
        /** current step */
        get step(): ScriptStep;
        askBoolean: (msg: string) => ScriptStep_askBoolean;
        /** outputs are both stored in ScriptStep_prompt, and on ScriptExecution */
        outputs: WsMsgExecuted[];
        sendPromp: () => ScriptStep_prompt;
        ctx: {};
    }
}
declare module "ui/samples/a" {
    export const a__: string;
}
declare module "core/AutoSaver" {
    import type { Tagged } from "core/ComfyUtils";
    export type LocalStorageKey = Tagged<string, 'localstorage'>;
    export class AutoSaver<Data = any> {
        /** localstorage key */
        key: LocalStorageKey;
        /** localstorage key */
        getCurrent: () => Data;
        constructor(
        /** localstorage key */
        key: LocalStorageKey, 
        /** localstorage key */
        getCurrent: () => Data);
        discard: () => void;
        private _disposer;
        start: () => void;
        stop: () => void;
        load: () => Data | null;
        private save;
    }
    export const load: (key: LocalStorageKey) => any;
}
declare module "ui/TypescriptOptions" {
    
    export type TypescriptOptions = any
    export type ITextModel = any
    export type IStandaloneCodeEditor = any
    export type Monaco = any;
}
declare module "ui/Monaco" {
    const monaco: any
    export let globalMonaco: typeof monaco | null;
    export const ensureMonacoReady: () => typeof monaco | null;
}
declare module "ui/samples/c" {
    export const c__: string;
}
declare module "core/ComfyScriptEditor" {
    import type { ITextModel } from "ui/TypescriptOptions";
    import { ComfyClient } from "core/ComfyClient";
    export class ComfyScriptEditor {
        client: ComfyClient;
        constructor(client: ComfyClient);
        editorRef: {
            current: any
        };
        private sdk_path;
        private lib_path;
        private CODE_path;
        updateSDKDTS: () => void;
        updateLibDTS: () => void;
        updateCODE: (code: string) => void;
        updateFile: (path: string, content: string) => void;
        openLib: () => void;
        openSDK: () => void;
        openCODE: () => void;
        curr: ITextModel | null;
        openPathInEditor: (path: string) => void;
        hasLib: () => boolean | null;
        hasSDK: () => boolean | null;
        hasCODE: () => boolean | null;
        hasModel: (path: string) => boolean | null;
    }
}
declare module "core/getPngMetadata" {
    /** code copy-pasted from ComfyUI repo */
    import type { ComfyClient } from "core/ComfyClient";
    export type TextChunks = {
        [key: string]: string;
    };
    export function getPngMetadata(client: ComfyClient, file: File): Promise<TextChunks>;
}
declare module "core/ComfyClient" {
    import type { ComfySchemaJSON } from "core/ComfySchemaJSON";
    import type { Maybe } from "core/ComfyUtils";
    
    import { AutoSaver } from "core/AutoSaver";
    import { ComfyStatus } from "core/ComfyAPI";
    import { ComfyProject } from "core/ComfyProject";
    import { ComfySchema } from "core/ComfySchema";
    import { ComfyScriptEditor } from "core/ComfyScriptEditor";
    export type ComfyClientOptions = {
        serverIP: string;
        serverPort: number;
        spec: ComfySchemaJSON;
    };
    /**
     * global State
     *  - manages connection to the backend
     *  - manages list of known / open projects
     *  - dispatches messages to the right projects
     */
    export class ComfyClient {
        serverIP: string;
        serverPort: number;
        schema: ComfySchema;
        dts: string;
        project: ComfyProject;
        projects: ComfyProject[];
        editor: ComfyScriptEditor;
        assets: Map<string, boolean>;
        storageServerKey: string;
        getStoredServerKey: () => void;
        getConfig: () => {
            serverIP: string;
            serverPort: number;
            spec: ComfySchemaJSON;
        };
        autosaver: AutoSaver<{
            serverIP: string;
            serverPort: number;
            spec: ComfySchemaJSON;
        }>;
        constructor(opts: ComfyClientOptions);
        get serverHost(): string;
        fetchPrompHistory: () => Promise<any>;
        /** retri e the comfy spec from the schema*/
        fetchObjectsSchema2: () => Promise<ComfySchemaJSON>;
        /** retri e the comfy spec from the schema*/
        fetchObjectsSchema: () => Promise<ComfySchemaJSON>;
        static Init: () => void;
        get wsStatusTxt(): "not initialized" | "connected" | "disconnected" | "connecting";
        wsStatus: 'on' | 'off';
        get wsStatusEmoji(): "🟢" | "🔴" | "❓";
        get schemaStatusEmoji(): "🟢" | "🔴";
        get dtsStatusEmoji(): "🟢" | "🔴";
        sid: string;
        status: ComfyStatus | null;
        ws: Maybe<WebSocket>;
        startWSClient: () => void;
        notify: (msg: string) => undefined;
        /** Loads workflow data from the specified file */
        handleFile(file: File): Promise<void>;
    }
}
declare module "ui/stContext" {
    import { ComfyClient } from "core/ComfyClient";
    export const stContext: any
    export const useSt: () => ComfyClient;
    export const useProject: () => import("core/ComfyProject").ComfyProject;
}
declare module "ui/VisUI" {
    
    export type VisNodes = any;
    export type VisEdges = any;
    export type VisOptions = any;
    export const VisUI:any
}
declare module "core/ComfyColors" {
    export const comfyColors: {
        [category: string]: string;
    };
}
declare module "core/ComfyGraph" {
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import type { ComfyNodeUID } from "core/ComfyNodeUID";
    import type { ComfyProject } from "core/ComfyProject";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { ScriptExecution } from "core/ScriptExecution";
    import { WsMsgExecuted } from "core/ComfyAPI";
    import { ComfyClient } from "core/ComfyClient";
    import { ComfyNode } from "core/ComfyNode";
    import { ComfySchema } from "core/ComfySchema";
    export type RunMode = 'fake' | 'real';
    export class ComfyGraph {
        project: ComfyProject;
        executionContext: ScriptExecution;
        get client(): ComfyClient;
        get schema(): ComfySchema;
        get nodesArray(): ComfyNode<any>[];
        nodes: Map<string, ComfyNode<any>>;
        isRunning: boolean;
        /** return the coresponding comfy prompt  */
        get json(): ComfyPromptJSON;
        /** temporary proxy */
        askBoolean: (msg: string) => void;
        constructor(project: ComfyProject, executionContext: ScriptExecution, json?: ComfyPromptJSON);
        private _nextUID;
        getUID: () => string;
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        outputs: WsMsgExecuted[];
        /** wether it should really send the prompt to the backend */
        get runningMode(): RunMode;
        get(): Promise<void>;
        /** visjs JSON format (network visualisation) */
        get JSON_forVisDataVisualisation(): {
            nodes: VisNodes[];
            edges: VisEdges[];
        };
    }
}
declare module "core/ComfyNode" {
    import type { NodeProgress } from "core/ComfyAPI";
    import type { ComfyGraph } from "core/ComfyGraph";
    import type { ComfyNodeJSON } from "core/ComfyPrompt";
    import { ComfyNodeOutput } from "core/ComfyNodeOutput";
    import { ComfyNodeSchema } from "core/ComfySchema";
    /** ComfyNode
     * - correspond to a signal in the graph
     * - belongs to a script
     */
    export class ComfyNode<ComfyNode_input extends object> {
        graph: ComfyGraph;
        uid: string;
        artifacts: {
            images: string[];
        }[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        get inputs(): ComfyNode_input;
        json: ComfyNodeJSON;
        /** update a node */
        set(p: Partial<ComfyNode_input>): void;
        $outputs: ComfyNodeOutput<any>[];
        constructor(graph: ComfyGraph, uid: string, xxx: ComfyNodeJSON);
        _convertPromptExtToPrompt(promptExt: ComfyNodeJSON): {
            class_type: string;
            inputs: {
                [inputName: string]: any;
            };
        };
        /** return the list of nodes piped into this node */
        _incomingNodes(): string[];
        get manager(): import("core/ComfyClient").ComfyClient;
        artifactsForStep(step: number): string[];
        get allArtifactsImgs(): string[];
        get(): Promise<void>;
        serializeValue(field: string, value: unknown): unknown;
        private _getExpecteTypeForField;
        private _getOutputForType;
    }
}
declare module "core/ComfyNodeOutput" {
    import { ComfyNode } from "core/ComfyNode";
    export class ComfyNodeOutput<T, Ix extends number = number> {
        node: ComfyNode<any>;
        slotIx: Ix;
        type: T;
        constructor(node: ComfyNode<any>, slotIx: Ix, type: T);
    }
}
declare module "core/_dts" {
    export type { ComfyNodeOutput } from "core/ComfyNodeOutput";
    export type { ComfyNodeUID } from "core/ComfyNodeUID";
    export type { ComfyNode } from "core/ComfyNode";
    export type { ComfyNodeSchemaJSON } from "core/ComfySchemaJSON";
}
`