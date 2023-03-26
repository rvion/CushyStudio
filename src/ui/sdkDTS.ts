export const c__:string = `/// <reference types="cytoscape" />

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
declare module "core/CSImage" {
    import type { ComfyImageInfo } from "core/ComfyAPI";
    import type { Workspace } from "core/Workspace";
    import type { Maybe } from "core/ComfyUtils";
    import type { ScriptStep_prompt } from "core/ScriptStep_prompt";
    /** Cushy wrapper around ComfyImageInfo */
    export class CSImage {
        prompt: ScriptStep_prompt;
        data: ComfyImageInfo;
        /** unique image id */
        uid: string;
        /** path within the input folder */
        inputPath?: Maybe<string>;
        saved: boolean;
        get folder(): string;
        get fileName(): string;
        get filePath(): string;
        save: () => Promise<void>;
        /** this is such a bad workaround but 🤷‍♂️ */
        makeAvailableAsInput: () => Promise<string>;
        client: Workspace;
        constructor(prompt: ScriptStep_prompt, data: ComfyImageInfo);
        /** url to acces the image */
        get comfyURL(): string;
    }
}
declare module "core/ScriptStep_prompt" {
    import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from "core/ComfyAPI";
    import type { Run } from "core/Run";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { ComfyNode } from "core/CSNode";
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    import { ComfyGraph } from "core/ComfyGraph";
    import { CSImage } from "core/CSImage";
    export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
        run: Run;
        prompt: ComfyPromptJSON;
        static promptID: number;
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
        images: CSImage[];
        /** udpate execution list */
        onExecuted: (msg: WsMsgExecuted) => void;
        /** finish this step */
        private _finish;
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
declare module "ui/graph/cyto" {
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
    export const getYYYYMMDD_HHMM_SS: () => string;
}
declare module "core/Run" {
    import type { Project } from "core/Project";
    import { ScriptStep_prompt } from "core/ScriptStep_prompt";
    import { Maybe } from "core/ComfyUtils";
    import { ComfyGraph } from "core/ComfyGraph";
    import { WsMsgExecuted } from "core/ComfyAPI";
    import { ScriptStep } from "core/ScriptStep";
    import { CSImage } from "core/CSImage";
    import { Cyto } from "ui/graph/cyto";
    /** script exeuction instance */
    export class Run {
        script: Project;
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
        gallery: CSImage[];
        /** folder where CushyStudio will save run informations */
        get folderPath(): string;
        /** save current script */
        save: () => Promise<void>;
        constructor(script: Project, opts?: {
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
declare module "utils/bang" {
    export const bang: <T>(x: T | null) => T;
}
declare module "utils/stringifyReadable" {
    export function readableStringify(obj: any, maxLevel?: number, level?: number): string;
}
declare module "config/PersistedJSON" {
    export type PersistedJSONInfo<T> = {
        folder: Promise<string>;
        name: string;
        init: () => T;
        maxLevel?: number;
        onReady?: (data: T) => void;
    };
    export class PersistedJSON<T extends object> {
        private opts;
        private ready_yes;
        private ready_no;
        finished: Promise<boolean>;
        constructor(opts: PersistedJSONInfo<T>);
        /** true when config loaded */
        ready: boolean;
        setReady(): void;
        private _folder;
        get folder(): string;
        private _path;
        get path(): string;
        private _value;
        get value(): T;
        /** save the file */
        save: () => Promise<true>;
        /** update config then save it */
        assign: (configChanges: Partial<T>) => Promise<true>;
        init: (p: PersistedJSONInfo<T>) => Promise<T>;
    }
}
declare module "ui/TypescriptOptions" {
    import type * as T from 'monaco-editor/esm/vs/editor/editor.api';
    export type TypescriptOptions = any
    export type ITextModel = any
    export type IStandaloneCodeEditor = any
    export type Monaco = typeof T;
}
declare module "ui/Monaco" {
    export const globalMonaco: Promise<typeof import("monaco-editor")>;
    export const ensureMonacoReady: () => void;
}
declare module "ui/code/TypescriptBuffer" {
    import type { Maybe } from "core/ComfyUtils";
    import type { Workspace } from "core/Workspace";
    import type { ITextModel } from "ui/TypescriptOptions";
    export class TypescriptBuffer {
        workspace: Workspace;
        name: string;
        path: string;
        constructor(workspace: Workspace, opts: {
            name: string;
            path: string;
            def: Maybe<string>;
        });
        /** the monaco textmodel that should remains alive for typeschecking to work */
        textModel: Maybe<ITextModel>;
        /** set to true,
         *  - either when file is initially loaded from disk
         *  - or when file content is set programmatically for the first time
         * */
        ready: boolean;
        /** initialize the buffer
         *  - load the file from disk if it exists
         *  - or create a new file with the default content if default content provided
         *  - or do nothing if file does not exist and no default content provided
         */
        init: (def: Maybe<string>) => Promise<void>;
        ensureTextModel: () => Promise<void>;
        code: string;
        /** internal path as needed for monaco engine */
        get monacoPath(): string;
        /** initialize a buffer that may or may not exist on disk */
        initProgrammatically: (value: Maybe<string>) => Promise<boolean>;
        udpateCodeFromEditor: (value: Maybe<string>) => void;
        saveOnDisk: () => Promise<void>;
    }
}
declare module "help/TutorialUI" {
    export const TutorialUI: import("react").FunctionComponent<object>;
}
declare module "config/CushyStudio" {
    import { Maybe } from "core/ComfyUtils";
    import { Workspace } from "core/Workspace";
    import { PersistedJSON } from "config/PersistedJSON";
    export type UserConfigJSON = {
        version: 1;
        theme?: 'dark' | 'light';
        recentProjects?: string[];
    };
    export class CushyStudio {
        constructor();
        /** currently opened workspace */
        workspace: Maybe<Workspace>;
        openWorkspace: (folderPath: string) => Promise<Workspace>;
        closeWorkspace: () => Promise<void>;
        userConfig: PersistedJSON<UserConfigJSON>;
        /** true when user config is ready */
        get ready(): boolean;
    }
}
declare module "config/CushyStudioContext" {
    import { CushyStudio } from "config/CushyStudio";
    export const CSContext: import("react").Context<CushyStudio | null>;
    export const useCS: () => CushyStudio;
}
declare module "ui/WorkspaceContext" {
    import { Workspace } from "core/Workspace";
    export const workspaceContext: import("react").Context<Workspace | null>;
    export const useWorkspace: () => Workspace;
    export const useProject: () => import("core/ComfyUtils").Maybe<import("core/Project").Project>;
}
declare module "ui/menu/NewProjectModalUI" {
    export const NewProjectModalUI: import("react").FunctionComponent<{
        children: React.ReactElement;
    }>;
}
declare module "ui/ToolbarUI" {
    import { ToolbarProps } from '@fluentui/react-components';
    export const WorkspaceToolbarUI: import("react").FunctionComponent<Partial<ToolbarProps>>;
    export const ProjectToolbarUI: import("react").FunctionComponent<Partial<ToolbarProps>>;
}
declare module "ui/code/ComfyCodeEditorUI" {
    import type { TypescriptBuffer } from "ui/code/TypescriptBuffer";
    export const TypescriptEditorUI: import("react").FunctionComponent<{
        buffer: TypescriptBuffer;
    }>;
}
declare module "civitai/CivitaiAPI" {
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
declare module "civitai/CIvitaiUI" {
    export const CivitaiUI: import("react").FunctionComponent<object>;
}
declare module "ui/ErrorScreenUI" {
    import { CSCriticalError } from "core/Workspace";
    export const ErrorScreenUI: import("react").FunctionComponent<{
        err: CSCriticalError;
    }>;
}
declare module "ui/panels/pConnect" {
    export const PConnectUI: import("react").FunctionComponent<{}>;
}
declare module "ui/WelcomeScreenUI" {
    export const WelcomeScreenUI: import("react").FunctionComponent<{
        children: React.ReactNode;
    }>;
    export const OpenWorkspaceUI: import("react").FunctionComponent<{}>;
}
declare module "ui/MainPaneUI" {
    export const MainPanelUI: import("react").FunctionComponent<{}>;
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
declare module "ui/layout/LayoutCtx" {
    import type { CushyLayoutState } from "ui/layout/LayoutState";
    export const CushyLayoutContext: import("react").Context<CushyLayoutState | null>;
    export const useLayout: () => CushyLayoutState;
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
declare module "ui/DropZoneUI" {
    export const DropZoneUI: import("react").FunctionComponent<object>;
}
declare module "ui/menu/AssetTreeUI" {
    export const AssetTreeUI: import("react").FunctionComponent<{
        children: React.ReactNode;
    }>;
}
declare module "ui/menu/ExecutionStepIconUI" {
    import { ScriptStep } from "core/ScriptStep";
    export const ExecutionStepIconUI: (step: ScriptStep) => JSX.Element;
}
declare module "ui/menu/ProjectTreeUI" {
    export const ProjectTreeUI: import("react").FunctionComponent<object>;
    export const HasProblem: JSX.Element;
    export const IsOK: JSX.Element;
    export const Actions: () => JSX.Element;
}
declare module "ui/menu/MenuUI" {
    export const MenuUI: import("react").FunctionComponent<object>;
}
declare module "ui/paint/PaintUI" {
    export const PaintUI: import("react").FunctionComponent<{}>;
}
declare module "ui/panels/pGallery" {
    export const PGalleryUI: import("react").FunctionComponent<{}>;
}
declare module "ui/panels/pGalleryFocus" {
    export const PGalleryFocusUI: import("react").FunctionComponent<{}>;
}
declare module "ui/panels/pUpload" {
    export const PUploadUI: import("react").FunctionComponent<{}>;
}
declare module "ui/layout/LayoutDefault" {
    import { LayoutData } from 'rc-dock';
    export const defaultLayout: () => LayoutData;
}
declare module "ui/layout/LayoutState" {
    import type { CSImage } from "core/CSImage";
    import DockLayout from 'rc-dock';
    import { Workspace } from "core/Workspace";
    export class CushyLayoutState {
        client: Workspace;
        layout: import("rc-dock").LayoutData;
        galleryFocus: CSImage | null;
        gallerySize: number;
        dockLayout: DockLayout | null;
        getRef: (r: DockLayout | null) => DockLayout | null;
        constructor(client: Workspace);
        addImagePopup: (url: string) => void;
        /** WIP */
        addHelpPopup: () => void;
    }
}
declare module "png/getPngMetadata" {
    /** code copy-pasted from ComfyUI repo */
    import type { Workspace } from "core/Workspace";
    export type TextChunks = {
        [key: string]: string;
    };
    export function getPngMetadata(client: Workspace, file: File): Promise<TextChunks>;
}
declare module "ui/sdkDTS" {
    export const c__: string;
}
declare module "core/Workspace" {
    import type { ComfySchemaJSON } from "core/ComfySchemaJSON";
    import type { Maybe } from "core/ComfyUtils";
    import { PersistedJSON } from "config/PersistedJSON";
    import { TypescriptBuffer } from "ui/code/TypescriptBuffer";
    import { CushyLayoutState } from "ui/layout/LayoutState";
    import { ComfyStatus, ComfyUploadImageResult } from "core/ComfyAPI";
    import { ComfySchema } from "core/ComfySchema";
    import { Project } from "core/Project";
    export type WorkspaceConfigJSON = {
        version: 2;
        comfyWSURL: string;
        comfyHTTPURL: string;
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
        folder: string;
        schema: ComfySchema;
        focusedFile: Maybe<TypescriptBuffer>;
        focusedProject: Maybe<Project>;
        projects: Project[];
        assets: Map<string, boolean>;
        layout: CushyLayoutState;
        _config: PersistedJSON<WorkspaceConfigJSON>;
        _schema: PersistedJSON<ComfySchemaJSON>;
        CushySDKBuff: TypescriptBuffer;
        ComfySDKBuff: TypescriptBuffer;
        openComfySDK: () => void;
        openCushySDK: () => void;
        static OPEN: (folder: string) => Promise<Workspace>;
        private constructor();
        init(): Promise<void>;
        private RANDOM_IMAGE_URL;
        /** attempt to convert an url to a Blob */
        private getUrlAsBlob;
        uploadURL: (url?: string) => Promise<ComfyUploadImageResult>;
        createProject: (folderName: string, script?: string) => void;
        /** load all project found in workspace */
        loadProjects: () => Promise<void>;
        /** save an image at given url to disk */
        saveImgToDisk: (url?: string) => Promise<'ok'>;
        /** upload an image present on disk to ComfyServer */
        uploadImgFromDisk: (path: string) => Promise<ComfyUploadImageResult>;
        /** upload an Uint8Array buffer as png to ComfyServer */
        uploadUIntArrToComfy: (ui8arr: Uint8Array) => Promise<ComfyUploadImageResult>;
        get serverHostHTTP(): string;
        get serverHostWs(): string;
        fetchPrompHistory: () => Promise<unknown>;
        CRITICAL_ERROR: Maybe<CSCriticalError>;
        /** retri e the comfy spec from the schema*/
        fetchObjectsSchema: () => Promise<ComfySchemaJSON>;
        static Init: () => void;
        get wsStatusTxt(): "not initialized" | "connected" | "disconnected" | "connecting";
        wsStatus: 'on' | 'off';
        get wsStatusEmoji(): "🟢" | "🔴" | "❓";
        get schemaStatusEmoji(): "🟢" | "🔴";
        sid: string;
        status: ComfyStatus | null;
        ws: Maybe</*WS.WebSocket |*/ WebSocket>;
        startWSClientSafe: () => void;
        startWSClient: () => void;
        notify: (msg: string) => undefined;
        /** Loads workflow data from the specified file */
        handleFile(file: File): Promise<void>;
    }
}
declare module "core/toposort" {
    export type TNode = string;
    export type TEdge = [TNode, TNode];
    export function toposort(nodes: TNode[], edges: TEdge[]): TNode[];
}
declare module "core/ComfyImporter" {
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
    import type { RunMode } from "core/ComfyGraph";
    import { Workspace } from "core/Workspace";
    import { ComfyPromptJSON } from "core/ComfyPrompt";
    import { Run } from "core/Run";
    import { TypescriptBuffer } from "ui/code/TypescriptBuffer";
    /** Script */
    export class Project {
        workspace: Workspace;
        folderName: string;
        static __demoProjectIx: number;
        runCounter: number;
        /** unique project id */
        id: string;
        /** folder where CushyStudio will save script informations */
        get folderPath(): string;
        save: () => Promise<void>;
        duplicate: () => Promise<void>;
        focus: () => void;
        /** project name */
        /** list of all project runs */
        runs: Run[];
        /** last project run */
        get currentRun(): Run | null;
        scriptBuffer: TypescriptBuffer;
        constructor(workspace: Workspace, folderName: string, initialCode?: string);
        /** convenient getter to retrive current client shcema */
        get schema(): import("core/ComfySchema").ComfySchema;
        get code(): string;
        udpateCode: (code: string) => Promise<string>;
        static FROM_JSON: (client: Workspace, json: ComfyPromptJSON) => Project;
        /** converts a ComfyPromptJSON into it's canonical normal-form script */
        static LoadFromComfyPromptJSON: (_json: ComfyPromptJSON) => never;
        /** * project running is not the same as graph running; TODO: explain */
        isRunning: boolean;
        RUN: (mode?: RunMode) => Promise<boolean>;
    }
}
declare module "embeds/wildcards" {
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
    import { CSImage } from "core/CSImage";
    import { Cyto } from "ui/graph/cyto";
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
        randomSeed(): number;
        wildcards: import("embeds/wildcards").Wildcards;
        /** return the coresponding comfy prompt  */
        get json(): ComfyPromptJSON;
        /** temporary proxy */
        convertToImageInput: (x: CSImage) => Promise<string>;
        askBoolean: (msg: string, def?: Maybe<boolean>) => Promise<boolean>;
        askString: (msg: string, def?: Maybe<string>) => Promise<string>;
        print: (...msg: any[]) => void;
        constructor(project: Project, run: Run, json?: ComfyPromptJSON);
        private _nextUID;
        getUID: () => string;
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        /** all images generated by nodes in this graph */
        get allImages(): CSImage[];
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
    import { CSImage } from "core/CSImage";
    /** ComfyNode
     * - correspond to a signal in the graph
     * - belongs to a script
     */
    export class ComfyNode<ComfyNode_input extends object> {
        graph: ComfyGraph;
        uid: string;
        artifacts: WsMsgExecutedData[];
        images: CSImage[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        status: 'executing' | 'done' | 'error' | 'waiting' | null;
        get isExecuting(): boolean;
        get statusEmoji(): "" | "🔥" | "✅" | "❌" | "⏳";
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
declare module "core/_dts" {
    export type { ComfyNodeOutput } from "core/ComfyNodeOutput";
    export type { ComfyNodeUID } from "core/ComfyNodeUID";
    export type { ComfyNode } from "core/CSNode";
    export type { ComfyNodeSchemaJSON } from "core/ComfySchemaJSON";
}
`