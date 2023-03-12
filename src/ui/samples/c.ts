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
    };
}
declare module "ui/TypescriptOptions" {
    
    export type TypescriptOptions = any
    export type ITextModel = any
    export type IStandaloneCodeEditor = any
    export type Monaco = any;
}
declare module "ui/samples/c" {
    export const c__: string;
}
declare module "core/ComfyUtils" {
    export const exhaust: (x: never) => never;
    export const sleep: (ms: number) => Promise<unknown>;
    export function jsEscapeStr(x: any): any;
    /** usefull to catch most *units* type errors */
    export type Tagged<O, Tab> = O & {
        __tag?: Tab;
    };
    /** same as Tagged, but even scriter */
    export type Branded<O, Brand> = O & {
        __brand: Brand;
    };
    export type Maybe<T> = T | null | undefined;
    export const deepCopyNaive: <T>(x: T) => T;
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
declare module "core/ComfyProject" {
    import type { Maybe } from "core/ComfyUtils";
    import type { RunMode } from "core/ComfyGraph";
    import { ComfyGraph } from "core/ComfyGraph";
    import { ComfyClient } from "core/ComfyClient";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    export class ComfyProject {
        client: ComfyClient;
        /** unique project id */
        id: string;
        /** project name */
        name: string;
        /** current  */
        focus: number;
        code: string;
        static INIT: (client: ComfyClient) => ComfyProject;
        private constructor();
        /** converts a ComfyPromptJSON into it's canonical normal-form script */
        static LoadFromComfyPromptJSON: (json: ComfyPromptJSON) => never;
        graphs: ComfyGraph[];
        get currentGraph(): ComfyGraph;
        get currentOutputs(): import("core/ComfyAPI").WsMsgExecuted[];
        get schema(): import("core/ComfySchema").ComfySchema;
        /** * project running is not the same as graph running; TODO: explain */
        isRunning: boolean;
        error: Maybe<string>;
        runningMode: RunMode;
        run: (mode?: RunMode) => Promise<boolean>;
        udpateCode: (code: string) => Promise<void>;
    }
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
declare module "core/ComfySchema" {
    import { ComfySchemaJSON } from "core/ComfySchemaJSON";
    export type EnumHash = string;
    export type EnumName = string;
    export type NodeInputExt = {
        name: string;
        type: string;
        opts?: any;
    };
    export type NodeOutputExt = {
        type: string;
        name: string;
    };
    export class ComfySchema {
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
declare module "core/ComfyScriptEditor" {
    
    import { ComfyClient } from "core/ComfyClient";
    export class ComfyScriptEditor {
        client: ComfyClient;
        constructor(client: ComfyClient);
        editorRef: {
            current: any
        };
        monacoRef: {
            current: any
        };
        setupMonaco(monaco: any): void;
        private sdk_path;
        private lib_path;
        updateSDKDTS: () => void;
        updateLibDTS: () => void;
        updateFile: (path: string, content: string) => void;
        openLib: () => void;
        openSDK: () => void;
        openPathInEditor: (path: string) => void;
    }
}
declare module "core/ComfyClient" {
    import { ComfyProject } from "core/ComfyProject";
    import { ComfySchema } from "core/ComfySchema";
    import { ComfySchemaJSON } from "core/ComfySchemaJSON";
    import { ComfyScriptEditor } from "core/ComfyScriptEditor";
    export type ComfyManagerOptions = {
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
        constructor(opts: ComfyManagerOptions);
        get serverHost(): string;
        fetchPrompHistory: () => Promise<any>;
        /** retri e the comfy spec from the schema*/
        fetchObjectsSchema2: () => Promise<ComfySchemaJSON>;
        /** retri e the comfy spec from the schema*/
        fetchObjectsSchema: () => Promise<ComfySchemaJSON>;
        static Init: () => void;
        wsStatus: string;
        get wsStatusEmoji(): "🟢" | "🔴" | "❓";
        get schemaStatusEmoji(): "🟢" | "🔴";
        get dtsStatusEmoji(): "🟢" | "🔴";
        startWSClient: () => void;
    }
}
declare module "ui/stContext" {
    import { ComfyClient } from "core/ComfyClient";
    export const stContext: any
    export const useSt: () => ComfyClient;
    export const useProject: () => import("core/ComfyProject").ComfyProject;
}
declare module "ui/VisUI" {
    
    export const VisUI:any
    export type VisNodes = any;
    export type VisEdges = any;
    export type VisOptions = any;
}
declare module "core/ComfyColors" {
    export const comfyColors: {
        [category: string]: string;
    };
}
declare module "core/ComfyGraph" {
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import { ComfyStatus, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from "core/ComfyAPI";
    import { ComfyClient } from "core/ComfyClient";
    import { ComfyNode } from "core/ComfyNode";
    import { ComfyNodeUID } from "core/ComfyNodeUID";
    import { ComfyProject } from "core/ComfyProject";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    import { ComfySchema } from "core/ComfySchema";
    export type RunMode = 'fake' | 'real';
    export class ComfyGraph {
        project: ComfyProject;
        json: ComfyPromptJSON;
        get client(): ComfyClient;
        get schema(): ComfySchema;
        get nodesArray(): ComfyNode<any>[];
        nodes: Map<string, ComfyNode<any>>;
        isRunning: boolean;
        constructor(project: ComfyProject, json?: ComfyPromptJSON);
        private _nextUID;
        getUID: () => string;
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        currentExecutingNode: ComfyNode<any> | null;
        clientID: string | null;
        status: ComfyStatus | null;
        onStatus: (msg: WsMsgStatus) => void;
        onProgress: (msg: WsMsgProgress) => void;
        onExecuting: (msg: WsMsgExecuting) => void;
        currentStep: number;
        outputs: WsMsgExecuted[];
        onExecuted: (msg: WsMsgExecuted) => void;
        runningMode: RunMode;
        get(): Promise<Response | null>;
        /** visjs JSON format (network visualisation) */
        get visData(): {
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
        json: ComfyNodeJSON;
        artifacts: {
            images: string[];
        }[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        constructor(graph: ComfyGraph, uid: string, json: ComfyNodeJSON);
        get manager(): import("core/ComfyClient").ComfyClient;
        artifactsForStep(step: number): string[];
        get allArtifactsImgs(): string[];
        get(): Promise<void>;
        getExpecteTypeForField(name: string): string;
        getOutputForType(type: string): ComfyNodeOutput<any>;
        serializeValue(field: string, value: unknown): unknown;
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