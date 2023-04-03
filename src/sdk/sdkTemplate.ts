export const sdkTemplate: string = `/// <reference types="cytoscape" />

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
declare module "ui/VisUI" {
    type Node = any;
    type Edge = any;
    type Options = any;
    export type VisNodes = any;
    export type VisEdges = any;
    export type VisOptions = any;
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
declare module "logger/Logger" {
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
        constructor(level?: LogLevel);
        private addToLogHistory;
        debug(category: Category, message: string): void;
        info(category: Category, message: string): void;
        warn(category: Category, message: string): void;
        error(category: Category, message: string): void;
    }
    export const logger: Logger;
}
declare module "utils/bang" {
    export const bang: <T>(x: T | null) => T;
}
declare module "utils/stringifyReadable" {
    export function readableStringify(obj: any, maxLevel?: number, level?: number): string;
}
declare module "fs/FileActionResult" {
    export type FileActionResult = 'created' | 'updated' | 'same';
}
declare module "fs/RootFolder" {
    import type { Maybe } from "core/ComfyUtils";
    import type { AbsolutePath, RelativePath } from "fs/pathUtils";
    import type { FileActionResult } from "fs/FileActionResult";
    import * as fs from '@tauri-apps/api/fs';
    /** filesystem abstraction
     *  - restrict operations to a local folder
     *  - extra type safety via branded types
     *  - handle path normalisation
     * */
    export class RootFolder {
        absPath: AbsolutePath;
        constructor(absPath: AbsolutePath);
        /** 📝 should be the SINGLE function able to save text files */
        readTextFile: (relativePath: RelativePath) => Promise<Maybe<string>>;
        /** 📝 should be the SINGLE function able to save text files */
        writeTextFile: (relativePath: RelativePath, contents: string) => Promise<FileActionResult>;
        /** 📝 should be the SINGLE function able to save binary files */
        writeBinaryFile: (relativePath: RelativePath, contents: fs.BinaryFileContents) => Promise<void>;
        private notify;
    }
}
declare module "monaco/JsonFile" {
    import { RelativePath } from "fs/pathUtils";
    import { RootFolder } from "fs/RootFolder";
    export type PersistedJSONInfo<T> = {
        /** human readable title */
        title: string;
        relativePath: RelativePath;
        /** lazy but synchronous initialization function for default value */
        init: () => T;
        /** prettier will indent json up to this level of nesting */
        maxLevel?: number;
        /** callback called when file API is ready to be used */
        onReady?: (data: T) => void;
    };
    export class JsonFile<T extends object> {
        rootFolder: RootFolder;
        conf: PersistedJSONInfo<T>;
        private ready_yes;
        private ready_no;
        finished: Promise<boolean>;
        constructor(rootFolder: RootFolder, conf: PersistedJSONInfo<T>);
        private init;
        /** true when config loaded */
        ready: boolean;
        setReady(): void;
        private _folder;
        get folder(): string;
        private _value;
        get value(): T;
        /** save the file */
        save: () => Promise<true>;
        /** update config then save it */
        update: (configChanges: Partial<T>) => Promise<true>;
    }
}
declare module "importers/tauriDropEvent" {
    import { AbsolutePath } from "fs/pathUtils";
    export type TauriDropEvent = {
        event: 'tauri://file-drop';
        windowLabel: 'main';
        payload: AbsolutePath[];
        id: number;
    };
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
declare module "cushy/CushyGlobalRef" {
    import type { Cushy } from "cushy/Cushy";
    export const CushyGlobalRef: {
        value: Cushy | null;
    };
}
declare module "cushy/Cushy" {
    import type { Maybe } from "core/ComfyUtils";
    import { AbsolutePath, RelativePath } from "fs/pathUtils";
    import * as os from '@tauri-apps/api/os';
    import { Workspace } from "core/Workspace";
    import { JsonFile } from "monaco/JsonFile";
    import { RootFolder } from "fs/RootFolder";
    export type UserConfigJSON = {
        version: 1;
        theme?: 'dark' | 'light';
        recentProjects?: AbsolutePath[];
        reOpenLastProject?: boolean;
    };
    /** global Singleton state for the application */
    export class Cushy {
        /** sync cached value so we don't have to do RPC with rust to find out */
        os: os.Platform;
        /** sync cached value so we don't have to do RPC with rust to find out */
        configDir: AbsolutePath;
        static CREATE: () => Promise<Cushy>;
        rootFolder: RootFolder;
        userConfig: JsonFile<UserConfigJSON>;
        readonly relativePathToGlobalConfig: RelativePath;
        get globalConfigAbsPath(): AbsolutePath;
        private constructor();
        isDraggigFile: boolean;
        /** start listening for file drop events */
        startListeningForFileDrop: () => void;
        /** currently opened workspace */
        workspace: Maybe<Workspace>;
        closeWorkspace: () => Promise<void>;
        /** prompt user to open a workspace */
        openWorkspaceDialog: () => Promise<void>;
        openWorkspace: (absoluteFolderPath: AbsolutePath) => Promise<Workspace>;
        /** true when user config is ready */
        get ready(): boolean;
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
declare module "graph/cyto" {
    import cytoscape from 'cytoscape';
    import { ComfyGraph } from "core/ComfyGraph";
    import { ComfyNode } from "core/CSNode";
    export class Cyto {
        graph: ComfyGraph;
        cy: cytoscape.Core;
        constructor(graph: ComfyGraph);
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
declare module "utils/timestamps" {
    export const getYYYYMMDDHHMMSS: () => string;
    export const getYYYYMMDD_HHMM_SS: () => string;
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
declare module "core/ScriptStep_Iface" {
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
declare module "core/ScriptStep_prompt" {
    import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from "core/ComfyAPI";
    import type { Run } from "core/Run";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { ComfyNode } from "core/CSNode";
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    import { ComfyGraph } from "core/ComfyGraph";
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
        _graph: ComfyGraph;
        /** short-hand getter to access parent client */
        get client(): import("core/Workspace").Workspace;
        constructor(run: Run, prompt: ComfyPromptJSON);
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
        private outputs;
        images: PromptOutputImage[];
        /** udpate execution list */
        onExecuted: (msg: WsMsgExecuted) => void;
        /** finish this step */
        private _finish;
    }
}
declare module "core/PromptOutputImage" {
    import type { ComfyImageInfo } from "core/ComfyAPI";
    import type { Maybe } from "core/ComfyUtils";
    import type { ScriptStep_prompt } from "core/ScriptStep_prompt";
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
declare module "core/ScriptStep_Init" {
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    export class ScriptStep_Init implements ScriptStep_Iface<true> {
        uid: string;
        name: string;
        finished: Promise<true>;
    }
}
declare module "core/ScriptStep_ask" {
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
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
    import type { ScriptStep_prompt } from "core/ScriptStep_prompt";
    import type { ScriptStep_Init } from "core/ScriptStep_Init";
    import type { ScriptStep_askBoolean, ScriptStep_askString } from "core/ScriptStep_ask";
    export type ScriptStep = ScriptStep_Init | ScriptStep_prompt | ScriptStep_askBoolean | ScriptStep_askString;
}
declare module "core/Run" {
    import type { Project } from "core/Project";
    import { Cyto } from "graph/cyto";
    import { RelativePath } from "fs/pathUtils";
    import { WsMsgExecuted } from "core/ComfyAPI";
    import { ComfyGraph } from "core/ComfyGraph";
    import { Maybe } from "core/ComfyUtils";
    import { PromptOutputImage } from "core/PromptOutputImage";
    import { ScriptStep } from "core/ScriptStep";
    import { ScriptStep_prompt } from "core/ScriptStep_prompt";
    /** script exeuction instance */
    export class Run {
        project: Project;
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
        graph: ComfyGraph;
        /** graph engine instance for smooth and clever auto-layout algorithms */
        cyto: Cyto;
        /** list of all images produed over the whole script execution */
        gallery: PromptOutputImage[];
        /** folder where CushyStudio will save run informations */
        get workspaceRelativeCacheFolderPath(): RelativePath;
        /** save current script */
        save: () => Promise<void>;
        constructor(project: Project, opts?: {
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
declare module "help/Demo" {
    import type { Workspace } from "core/Workspace";
    export class Demo {
        name: string;
        code: string;
        constructor(name: string, code: string);
        createProjectCopy(workspace: Workspace): void;
    }
}
declare module "help/TutorialUI" {
    export const TutorialUI: import("react").FunctionComponent<object>;
}
declare module "ui/TypescriptOptions" {
    import type * as T from 'monaco-editor/esm/vs/editor/editor.api';
    export type TypescriptOptions = any
    export type ITextModel = any
    export type IStandaloneCodeEditor = any
    export type Monaco = typeof T;
}
declare module "monaco/Monaco" {
    import { ITextModel } from "ui/TypescriptOptions";
    const monaco: any
    export class LocoMonaco {
        constructor();
        ready: boolean;
        private _setGlobalMonaco;
        promise: Promise<typeof monaco>;
        convertToJS: (model: ITextModel) => Promise<string>;
    }
    export const globalMonaco: LocoMonaco;
}
declare module "monaco/TypescriptFile" {
    import type { Maybe } from "core/ComfyUtils";
    import type { ITextModel } from "ui/TypescriptOptions";
    import { RootFolder } from "fs/RootFolder";
    import { MonacoPath, RelativePath } from "fs/pathUtils";
    export type TypescriptFileConf = {
        /** human readable title */
        title: string;
        /** the relative path to the typescript file this should be kept in sync with */
        relativeTSFilePath: RelativePath;
        /** the relative path to the javascript file this should be transpiled to */
        relativeJSFilePath?: Maybe<RelativePath>;
        /** the language server internal file path */
        virtualPathTS: MonacoPath;
        /** what we should initialize this file to if there is no file on disk */
        defaultCodeWhenNoFile?: Maybe<string>;
        /** what we should overwrite the file to in any case
         * if set, will trigger a filesystem sync on creation
         */
        codeOverwrite?: Maybe<string>;
        /** if true, file won't be able to be saved */
        isReadonly?: boolean;
    };
    export class TypescriptFile {
        rootFolder: RootFolder;
        conf: TypescriptFileConf;
        constructor(rootFolder: RootFolder, conf: TypescriptFileConf);
        /** the monaco textmodel that should remains alive for typeschecking to work */
        textModel: Maybe<ITextModel>;
        codeTS: string;
        codeJS: string;
        private resolvetextModelPromise;
        textModelPromise: Promise<import("monaco-editor").editor.ITextModel>;
        private init;
        /** initialize a buffer that may or may not exist on disk */
        updateFromCodegen: (value: Maybe<string>) => Promise<boolean>;
        udpateFromEditor: (value: Maybe<string>) => Promise<void>;
        syncWithDiskFile: () => Promise<void>;
    }
}
declare module "cushy/CushyContext" {
    import { Cushy } from "cushy/Cushy";
    export const CSContext: import("react").Context<Cushy | null>;
    export const useCushyStudio: () => Cushy;
}
declare module "ui/WorkspaceContext" {
    import { Workspace } from "core/Workspace";
    export const workspaceContext: import("react").Context<Workspace | null>;
    export const useWorkspace: () => Workspace;
    export const useProject: () => import("core/ComfyUtils").Maybe<import("core/Project").Project>;
}
declare module "menu/NewProjectModalUI" {
    export const NewProjectModalUI: import("react").FunctionComponent<{
        children: React.ReactElement;
    }>;
}
declare module "ui/ToolbarUI" {
    import { ToolbarProps } from '@fluentui/react-components';
    export const WorkspaceToolbarUI: import("react").FunctionComponent<Partial<ToolbarProps>>;
    export const ProjectToolbarUI: import("react").FunctionComponent<Partial<ToolbarProps>>;
}
declare module "monaco/MonacoUI" {
    import type { TypescriptFile } from "monaco/TypescriptFile";
    export const TypescriptEditorUI: import("react").FunctionComponent<{
        buffer: TypescriptFile;
    }>;
}
declare module "civitai/CivitaiSpec" {
    import type { Maybe } from "core/ComfyUtils";
    export class Civitai {
        query: string;
        results: Maybe<SearchResult>;
        constructor();
        search: (p: {
            limit?: number | string;
            page?: number | string;
            query?: string;
            tag?: string;
            username?: string;
        }) => Promise<SearchResult>;
    }
    type SearchResult = {
        items: SearchResultItem[];
        metadata: SearchResultMetadata;
    };
    type SearchResultItem = {
        id: number;
        name: string;
        description: string;
        type: 'Checkpoint' | 'TextualInversion' | 'Hypernetwork' | 'AestheticGradient' | 'LORA' | 'Controlnet' | 'Poses';
        nsfw: boolean;
        tags: string[];
        creator: {
            username: string;
            image: string | null;
        };
        modelVersions: {
            id: number;
            name: string;
            description: string;
            createdAt: Date;
            downloadUrl: string;
            trainedWords: string[];
            files: {
                sizeKb: number;
                format: 'pickle' | 'safetensor';
                pickleScanResult: 'Pending' | 'Success' | 'Danger' | 'Error';
                virusScanResult: 'Pending' | 'Success' | 'Danger' | 'Error';
                /** The date in which the file was scanned */
                scannedAt: Date | null;
                /** If the file is the primary file for the model version */
                primary: boolean | undefined;
            }[];
            images: {
                /** The url for the image */
                url: string;
                /** Whether or not the image is NSFW (note: if the model is NSFW, treat all images on the model as NSFW) */
                nsfw: string;
                /** The original width of the image */
                width: number;
                /** The original height of the image */
                height: number;
                /** The blurhash of the image */
                hash: string;
                /** The generation params of the image */
                meta: object | null;
            }[];
        }[];
    };
    type SearchResultMetadata = {
        totalItems: string;
        currentPage: string;
        pageSize: string;
        totalPages: string;
        nextPage: string;
        prevPage: string;
    };
}
declare module "civitai/CivitaiBrowserUI" {
    export const CivitaiUI: import("react").FunctionComponent<object>;
}
declare module "logger/LoggerUI" {
    export const LoggerUI: import("react").FunctionComponent<{
        className?: string | undefined;
    }>;
}
declare module "menu/AssetTreeUI" {
    export const NodeBrowserUI: import("react").FunctionComponent<{}>;
}
declare module "menu/ExecutionStepIconUI" {
    import { ScriptStep } from "core/ScriptStep";
    export const ExecutionStepIconUI: (step: ScriptStep) => JSX.Element;
}
declare module "menu/ProjectTreeUI" {
    export const ProjectTreeUI: import("react").FunctionComponent<object>;
    export const HasProblem: JSX.Element;
    export const IsOK: JSX.Element;
    export const Actions: () => JSX.Element;
}
declare module "menu/FocusedProjectTreeUI" {
    export const FocusedProjectTreeUI: import("react").FunctionComponent<{}>;
}
declare module "menu/MenuUI" {
    export const MenuUI: import("react").FunctionComponent<object>;
}
declare module "openpose/OpenPoseData" {
    export type OpenPoseData = {
        version: number;
        people: OpenPosePerson[];
    };
    export type OpenPosePerson = {
        pose_keypoints_2d: number[];
        face_keypoints_2d: number[];
        hand_left_keypoints_2d: number[];
        hand_right_keypoints_2d: number[];
        pose_keypoints_3d: number[];
        face_keypoints_3d: number[];
        hand_left_keypoints_3d: number[];
        hand_right_keypoints_3d: number[];
    };
    export class OpenPosePersonExt {
        readonly person: OpenPosePerson;
        constructor(person: OpenPosePerson);
    }
}
declare module "openpose/drawPoseV2" {
    import { OpenPoseData } from "openpose/OpenPoseData";
    export function drawOpenPoseBones(openposeData: OpenPoseData, ctx: CanvasRenderingContext2D): void;
}
declare module "openpose/OpenPoseAnimV0" {
    import { Workspace } from "core/Workspace";
    export class OpenPoseAnimV0 {
        workspace: Workspace;
        constructor(workspace: Workspace);
        poses: {
            version: number;
            people: {
                person_id: number[];
                pose_keypoints_2d: number[];
                face_keypoints_2d: never[];
                hand_left_keypoints_2d: number[];
                hand_right_keypoints_2d: number[];
                pose_keypoints_3d: never[];
                face_keypoints_3d: never[];
                hand_left_keypoints_3d: never[];
                hand_right_keypoints_3d: never[];
            }[];
        }[];
        ctx: CanvasRenderingContext2D | null;
        private intervalId;
        ix: number;
        drawAllToPngAndSaveLocally: () => Promise<void>;
        start: () => void;
        stop: () => void;
        draw: () => Promise<void>;
    }
}
declare module "openpose/OpenPoseUI" {
    export const OpenPoseViewerUI: import("react").FunctionComponent<{}>;
}
declare module "layout/LayoutCtx" {
    import type { CushyLayoutState } from "layout/LayoutState";
    export const CushyLayoutContext: import("react").Context<CushyLayoutState | null>;
    export const useLayout: () => CushyLayoutState;
}
declare module "panels/pGallery" {
    export const PGalleryUI: import("react").FunctionComponent<{}>;
}
declare module "panels/pGalleryFocus" {
    export const PGalleryFocusUI: import("react").FunctionComponent<{}>;
}
declare module "ui/Execution_askBooleanUI" {
    import { ScriptStep_askBoolean } from "core/ScriptStep_ask";
    export const Execution_askBooleanUI: import("react").FunctionComponent<{
        step: ScriptStep_askBoolean;
    }>;
}
declare module "ui/Execution_askStringUI" {
    import { ScriptStep_askString } from "core/ScriptStep_ask";
    export const Execution_askStringUI: import("react").FunctionComponent<{
        step: ScriptStep_askString;
    }>;
}
declare module "core/ComfyColors" {
    export const comfyColors: {
        [category: string]: string;
    };
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
        constructor(spec: ComfySchemaJSON);
        normalizeJSIdentifier: (name: string) => string;
        update(spec: ComfySchemaJSON): void;
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
declare module "ui/NodeRefUI" {
    import type { ComfyNodeUID } from "core/ComfyNodeUID";
    export const NodeRefUI: import("react").FunctionComponent<{
        nodeUID: ComfyNodeUID;
    }>;
}
declare module "ui/NodeListUI" {
    import { ComfyGraph } from "core/ComfyGraph";
    import { ComfyNode } from "core/CSNode";
    export const NodeListUI: import("react").FunctionComponent<{
        graph: ComfyGraph;
    }>;
    export const ComfyNodeUI: import("react").FunctionComponent<{
        node: ComfyNode<any>;
        showArtifacts?: boolean | undefined;
        folded?: boolean | undefined;
    }>;
}
declare module "ui/ExecutionUI" {
    import { ReactNode } from 'react';
    import { ScriptStep } from "core/ScriptStep";
    export const ExecutionUI: import("react").FunctionComponent<object>;
    export const StepWrapperUI: import("react").FunctionComponent<{
        step: ScriptStep;
    }>;
    export const ExecutionWrapperUI: import("react").FunctionComponent<{
        children: ReactNode;
    }>;
}
declare module "ui/ErrorScreenUI" {
    import { CSCriticalError } from "core/Workspace";
    export const ErrorScreenUI: import("react").FunctionComponent<{
        err: CSCriticalError;
    }>;
}
declare module "panels/pConnect" {
    export const PConnectUI: import("react").FunctionComponent<{}>;
}
declare module "ui/MainPaneUI" {
    export const MainPanelUI: import("react").FunctionComponent<{}>;
}
declare module "layout/LayoutDefault" {
    import { LayoutData } from 'rc-dock';
    export const defaultLayout: () => LayoutData;
}
declare module "layout/LayoutState" {
    import type { PromptOutputImage } from "core/PromptOutputImage";
    import DockLayout from 'rc-dock';
    import { Workspace } from "core/Workspace";
    export class CushyLayoutState {
        client: Workspace;
        layout: import("rc-dock").LayoutData;
        galleryFocus: PromptOutputImage | null;
        gallerySize: number;
        dockLayout: DockLayout | null;
        getRef: (r: DockLayout | null) => DockLayout | null;
        constructor(client: Workspace);
        addImagePopup: (url: string) => void;
        /** WIP */
        addHelpPopup: () => void;
    }
}
declare module "sdk/sdkTemplate" {
    export const sdkTemplate: string;
}
declare module "ws/ResilientWebsocket" {
    import type { Maybe } from "core/ComfyUtils";
    type Message = string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView;
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
        addEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof WebSocketEventMap>(type: K, listener: (this: WebSocket, ev: WebSocketEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    }
    interface WebSocketEventMap {
        open: Event;
        close: CloseEvent;
        error: Event;
        message: MessageEvent;
    }
}
declare module "core/defaultProjectCode" {
    export const defaultScript = "WORKFLOW(async (x) => {\n    // generate an empty table\n    const ckpt = x.CheckpointLoaderSimple({ ckpt_name: 'AOM3A1_orangemixs.safetensors' })\n    const latent = x.EmptyLatentImage({ width: 512, height: 512, batch_size: 1 })\n    const positive = x.CLIPTextEncode({ text: 'masterpiece, chair', clip: ckpt })\n    const negative = x.CLIPTextEncode({ text: '', clip: ckpt })\n    const sampler = x.KSampler({ seed: 2123, steps: 20, cfg: 10, sampler_name: 'euler', scheduler: 'normal', denoise: 0.8, model: ckpt, positive, negative, latent_image: latent })\n    const vae = x.VAEDecode({ samples: sampler, vae: ckpt })\n\n    x.SaveImage({ filename_prefix: 'ComfyUI', images: vae })\n    await x.get()\n})";
}
declare module "help/Library" {
    import { Demo } from "help/Demo";
    export const demoLibrary: Demo[];
}
declare module "core/Workspace" {
    import type { Cushy } from "cushy/Cushy";
    import type { ImportCandidate } from "importers/ImportCandidate";
    import type { ComfySchemaJSON } from "core/ComfySchemaJSON";
    import type { Maybe } from "core/ComfyUtils";
    import { RootFolder } from "fs/RootFolder";
    import { JsonFile } from "monaco/JsonFile";
    import { Demo } from "help/Demo";
    import { CushyLayoutState } from "layout/LayoutState";
    import { TypescriptFile } from "monaco/TypescriptFile";
    import { AbsolutePath, RelativePath } from "fs/pathUtils";
    import { ResilientWebSocketClient } from "ws/ResilientWebsocket";
    import { ComfyStatus, ComfyUploadImageResult } from "core/ComfyAPI";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    import { ComfySchema } from "core/ComfySchema";
    import { Project } from "core/Project";
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
        cushy: Cushy;
        absoluteWorkspaceFolderPath: AbsolutePath;
        schema: ComfySchema;
        focusedFile: Maybe<TypescriptFile>;
        focusedProject: Maybe<Project>;
        demos: Demo[];
        projects: Project[];
        assets: Map<string, boolean>;
        layout: CushyLayoutState;
        workspaceConfigFile: JsonFile<WorkspaceConfigJSON>;
        objectInfoFile: JsonFile<ComfySchemaJSON>;
        cushySDKFile: TypescriptFile;
        comfySDKFile: TypescriptFile;
        importQueue: ImportCandidate[];
        removeCandidate: (candidate: ImportCandidate) => void;
        openComfySDK: () => void;
        openCushySDK: () => void;
        static OPEN: (cushy: Cushy, absoluteFolderPath: AbsolutePath) => Promise<Workspace>;
        /** relative workspace folder where CushyStudio should store every artifacts and runtime files */
        get relativeCacheFolderPath(): RelativePath;
        rootFolder: RootFolder;
        private constructor();
        /** will be created only after we've loaded cnfig file
         * so we don't attempt to connect to some default server */
        ws: ResilientWebSocketClient;
        init(): Promise<void>;
        sid: string;
        onMessage: (e: MessageEvent) => void;
        private RANDOM_IMAGE_URL;
        /** attempt to convert an url to a Blob */
        private getUrlAsBlob;
        uploadURL: (url?: string) => Promise<ComfyUploadImageResult>;
        createProjectAndFocustIt: (workspaceRelativeFilePath: RelativePath, script?: string) => void;
        /** resolve any path to a relative workspace path
         * CRASH if path is outside of workspace folder or invalid */
        resolveToRelativePath: (rawPath: string) => RelativePath;
        /** load all project found in workspace */
        loadProjects: () => Promise<void>;
        /** save an image at given url to disk */
        saveImgToDisk: (url?: string) => Promise<'ok'>;
        /** upload an image present on disk to ComfyServer */
        uploadImgFromDisk: (path: string) => Promise<ComfyUploadImageResult>;
        /** upload an Uint8Array buffer as png to ComfyServer */
        uploadUIntArrToComfy: (ui8arr: Uint8Array) => Promise<ComfyUploadImageResult>;
        get serverHostHTTP(): string;
        fetchPrompHistory: () => Promise<unknown>;
        CRITICAL_ERROR: Maybe<CSCriticalError>;
        /** retri e the comfy spec from the schema*/
        updateComfy_object_info: () => Promise<ComfySchemaJSON>;
        get schemaStatusEmoji(): "🟢" | "🔴";
        status: ComfyStatus | null;
        notify: (msg: string) => undefined;
        addProjectFromComfyWorkflowJSON: (title: string, comfyPromptJSON: ComfyPromptJSON) => Promise<void>;
    }
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
declare module "core/Project" {
    import type { Maybe } from "core/ComfyUtils";
    import type { RunMode } from "core/ComfyGraph";
    import { Workspace } from "core/Workspace";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    import { Run } from "core/Run";
    import { TypescriptFile } from "monaco/TypescriptFile";
    import { RelativePath } from "fs/pathUtils";
    /** Script */
    export class Project {
        workspace: Workspace;
        workspaceRelativeFilePath: RelativePath;
        static __demoProjectIx: number;
        runCounter: number;
        /** unique project id */
        id: string;
        /** create a copy of a given project */
        duplicate: () => Promise<void>;
        /** focus project and open script in main panel */
        focus: () => void;
        /** list of all project runs */
        runs: Run[];
        /** last project run */
        get currentRun(): Run | null;
        scriptBuffer: TypescriptFile;
        name: string;
        workspaceRelativeCacheFolder: string;
        constructor(workspace: Workspace, workspaceRelativeFilePath: RelativePath, initialCode: Maybe<string>);
        /** convenient getter to retrive current client shcema */
        get schema(): import("core/ComfySchema").ComfySchema;
        static FROM_JSON: (workspace: Workspace, name: string, json: ComfyPromptJSON) => Project;
        /** converts a ComfyPromptJSON into it's canonical normal-form script */
        static LoadFromComfyPromptJSON: (_json: ComfyPromptJSON) => never;
        /** * project running is not the same as graph running; TODO: explain */
        isRunning: boolean;
        RUN: (mode?: RunMode) => Promise<boolean>;
    }
}
declare module "wildcards/wildcards" {
    export type Wildcards = {
        "3d_term": string[];
        "actors": string[];
        "actress": string[];
        "adj_architecture": string[];
        "adj_beauty": string[];
        "adj_general": string[];
        "adj_horror": string[];
        "alien": string[];
        "angel": string[];
        "animal": string[];
        "artist_anime": string[];
        "artist_black-white": string[];
        "artist_botanical": string[];
        "artist_c": string[];
        "artist_cartoon": string[];
        "artist_csv": string[];
        "artist_dig1": string[];
        "artist_dig2": string[];
        "artist_dig3": string[];
        "artist_fantasy": string[];
        "artist_fareast": string[];
        "artist_fineart": string[];
        "artist_horror": string[];
        "artist_n": string[];
        "artist_nudity": string[];
        "artist_scifi": string[];
        "artist_scribbles": string[];
        "artist_special": string[];
        "artist_surreal": string[];
        "artist_ukioe": string[];
        "artist_weird": string[];
        "artist": string[];
        "artist_concept": string[];
        "artist_director": string[];
        "artist_photographer": string[];
        "aspect_ratio": string[];
        "background_color": string[];
        "background": string[];
        "bangs": string[];
        "bdsm_type": string[];
        "bdsm": string[];
        "belt": string[];
        "biome": string[];
        "bird": string[];
        "blonde": string[];
        "body_fit": string[];
        "body_heavy": string[];
        "body_light": string[];
        "body_poor": string[];
        "body_short": string[];
        "body_tall": string[];
        "bodyshape": string[];
        "bodyshape2": string[];
        "bra": string[];
        "braids": string[];
        "breastsize": string[];
        "building": string[];
        "camera_manu": string[];
        "camera": string[];
        "cat": string[];
        "celeb": string[];
        "civilization": string[];
        "class": string[];
        "clothing_female": string[];
        "clothing_male": string[];
        "clothing": string[];
        "color": string[];
        "corset": string[];
        "cosmic_galaxy": string[];
        "cosmic_nebula": string[];
        "cosmic_star": string[];
        "cosmic_term": string[];
        "costume_female": string[];
        "costume_male": string[];
        "cumplay": string[];
        "decade": string[];
        "deity": string[];
        "detail": string[];
        "dinosaur": string[];
        "dog": string[];
        "dress": string[];
        "earrings": string[];
        "emoji_combo": string[];
        "emoji": string[];
        "expression": string[];
        "eyecolor": string[];
        "eyeliner": string[];
        "f_stop": string[];
        "fantasy_creature": string[];
        "fantasy_setting": string[];
        "fantasy": string[];
        "female_adult": string[];
        "female_young": string[];
        "fetish_type": string[];
        "fetish": string[];
        "film_genre": string[];
        "fish": string[];
        "flower": string[];
        "focal_length": string[];
        "food": string[];
        "forest_type": string[];
        "fruit": string[];
        "furniture": string[];
        "game": string[];
        "gem": string[];
        "gen_modifier": string[];
        "gender_ext": string[];
        "gender": string[];
        "genre": string[];
        "hair_color": string[];
        "hair_female-short": string[];
        "hair_female": string[];
        "hair_male": string[];
        "hairaccessory": string[];
        "hairlength": string[];
        "hd": string[];
        "headwear_female": string[];
        "headwear_male": string[];
        "high_heels": string[];
        "horror": string[];
        "identity": string[];
        "interior": string[];
        "iso_stop": string[];
        "landscape": string[];
        "legwear": string[];
        "lingerie": string[];
        "lipstick_shade": string[];
        "lipstick": string[];
        "location": string[];
        "makeup": string[];
        "male_adult": string[];
        "male_young": string[];
        "monster": string[];
        "movement": string[];
        "national_park": string[];
        "nationality": string[];
        "neckwear": string[];
        "neg_weight": string[];
        "noun_beauty": string[];
        "noun_fantasy": string[];
        "noun_general": string[];
        "noun_horror": string[];
        "noun_landscape": string[];
        "noun_romance": string[];
        "noun_scifi": string[];
        "occupation": string[];
        "oil_painting": string[];
        "outfit_cottagecore": string[];
        "outfit_goth": string[];
        "outfit_preppy": string[];
        "outfit_steampunk": string[];
        "panties": string[];
        "photo_term": string[];
        "photoshoot_type": string[];
        "planet": string[];
        "pop_culture": string[];
        "pop_location": string[];
        "portrait_type": string[];
        "public": string[];
        "punk": string[];
        "purse": string[];
        "quantity": string[];
        "race": string[];
        "render_engine": string[];
        "render": string[];
        "robot": string[];
        "rpg_Item": string[];
        "scenario_fantasy": string[];
        "scenario_romance": string[];
        "scenario_scifi": string[];
        "scenario": string[];
        "scenario2": string[];
        "scifi": string[];
        "sculpture": string[];
        "setting": string[];
        "sex_act": string[];
        "sex_position": string[];
        "sex_toy": string[];
        "ship": string[];
        "site": string[];
        "skin_color": string[];
        "still_life": string[];
        "style": string[];
        "subject_fantasy": string[];
        "subject_horror": string[];
        "subject_romance": string[];
        "subject_scifi": string[];
        "subject": string[];
        "suit_female": string[];
        "suit_male": string[];
        "superhero": string[];
        "supermodel": string[];
        "swimwear": string[];
        "technique": string[];
        "time": string[];
        "train": string[];
        "tree": string[];
        "tribe": string[];
        "trippy": string[];
        "underwater": string[];
        "water": string[];
        "watercolor": string[];
        "wave": string[];
        "wh_site": string[];
    };
    export const wildcards: Wildcards;
}
declare module "core/ComfyGraph" {
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import type { ComfyNodeUID } from "core/ComfyNodeUID";
    import type { Project } from "core/Project";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { Maybe } from "core/ComfyUtils";
    import type { Run } from "core/Run";
    import type { ScriptStep_prompt } from "core/ScriptStep_prompt";
    import { Workspace } from "core/Workspace";
    import { ComfyNode } from "core/CSNode";
    import { ComfySchema } from "core/ComfySchema";
    import { PromptOutputImage } from "core/PromptOutputImage";
    import { Cyto } from "graph/cyto";
    export type RunMode = 'fake' | 'real';
    export class ComfyGraph {
        project: Project;
        run: Run;
        uid: string;
        get client(): Workspace;
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
        constructor(project: Project, run: Run, json?: ComfyPromptJSON);
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
    import type { ComfyGraph } from "core/ComfyGraph";
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
        graph: ComfyGraph;
        uid: string;
        artifacts: WsMsgExecutedData[];
        images: PromptOutputImage[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        status: 'executing' | 'done' | 'error' | 'waiting' | null;
        get isExecuting(): boolean;
        get statusEmoji(): "🔥" | "" | "✅" | "❌" | "⏳";
        get inputs(): ComfyNode_input;
        json: ComfyNodeJSON;
        /** update a node */
        set(p: Partial<ComfyNode_input>): void;
        get color(): string;
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