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
declare module "core/ScriptStep_prompt" {
    import type { WsMsgProgress, WsMsgExecuting, WsMsgExecuted } from "core/ComfyAPI";
    import type { ScriptExecution } from "core/ScriptExecution";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { ComfyNode } from "core/ComfyNode";
    import type { ScriptStep_Iface } from "core/ScriptStep_Iface";
    import { ComfyGraph } from "core/ComfyGraph";
    export class ScriptStep_prompt implements ScriptStep_Iface<ScriptStep_prompt> {
        execution: ScriptExecution;
        prompt: ComfyPromptJSON;
        uid: string;
        static promptID: number;
        name: string;
        /** ready to be forked */
        _graph: ComfyGraph;
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
declare module "core/ScriptExecution" {
    import type { ComfyProject } from "core/ComfyProject";
    import { ScriptStep_prompt } from "core/ScriptStep_prompt";
    import { Maybe } from "core/ComfyUtils";
    import { ComfyGraph } from "core/ComfyGraph";
    import { WsMsgExecuted } from "core/ComfyAPI";
    import { ScriptStep } from "core/ScriptStep";
    /** script runtime context */
    export class ScriptExecution {
        project: ComfyProject;
        opts?: {
            mock?: boolean | undefined;
        } | undefined;
        /** the main graph that will be updated along the script execution */
        graph: ComfyGraph;
        uid: string;
        allOutputs: WsMsgExecuted['data']['output'][];
        constructor(project: ComfyProject, opts?: {
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
declare module "ui/DemoScript1" {
    export const DemoScript1: string;
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
declare module "ui/TypescriptOptions" {
    import type * as T from 'monaco-editor/esm/vs/editor/editor.api';
    export type TypescriptOptions = any
    export type ITextModel = any
    export type IStandaloneCodeEditor = any
    export type Monaco = typeof T;
}
declare module "ui/Monaco" {
    export let globalMonaco: typeof import("monaco-editor") | null;
    export const ensureMonacoReady: () => typeof import("monaco-editor") | null;
}
declare module "ui/sdkDTS" {
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
        get serverHostHTTP(): string;
        get serverHostWs(): string;
        fetchPrompHistory: () => Promise<unknown>;
        CRITICAL_ERROR: Maybe<{
            title: string;
            help: string;
        }>;
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
        static LoadFromComfyPromptJSON: (_json: ComfyPromptJSON) => never;
        /** * project running is not the same as graph running; TODO: explain */
        isRunning: boolean;
        run: (mode?: RunMode) => Promise<boolean>;
    }
}
declare module "core/ComfyColors" {
    export const comfyColors: {
        [category: string]: string;
    };
}
declare module "embeds/wildcards" {
    export const wildcards: {
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
}
declare module "core/ComfyGraph" {
    import type { VisEdges, VisNodes } from "ui/VisUI";
    import type { ComfyNodeUID } from "core/ComfyNodeUID";
    import type { ComfyProject } from "core/ComfyProject";
    import type { ComfyPromptJSON } from "core/ComfyPrompt";
    import type { Maybe } from "core/ComfyUtils";
    import type { ScriptExecution } from "core/ScriptExecution";
    import { ComfyClient } from "core/ComfyClient";
    import { ComfyNode } from "core/ComfyNode";
    import { ComfySchema } from "core/ComfySchema";
    export type RunMode = 'fake' | 'real';
    export class ComfyGraph {
        project: ComfyProject;
        executionContext: ScriptExecution;
        uid: string;
        get client(): ComfyClient;
        get schema(): ComfySchema;
        get nodesArray(): ComfyNode<any>[];
        nodes: Map<string, ComfyNode<any>>;
        isRunning: boolean;
        wildcards: {
            "3d_term": string[];
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
            "artist_black-white": string[];
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
            game: string[]; /** wether it should really send the prompt to the backend */
            gem: string[];
            gen_modifier: string[];
            gender_ext: string[];
            gender: string[];
            genre: string[];
            hair_color: string[];
            "hair_female-short": string[];
            hair_female: string[];
            hair_male: string[];
            hairaccessory: string[];
            hairlength: string[];
            hd: string[];
            headwear_female: string[];
            headwear_male: string[];
            high_heels: string[];
            /** visjs JSON format (network visualisation) */
            horror: string[];
            identity: string[];
            interior: string[];
            iso_stop: string[];
            /** visjs JSON format (network visualisation) */
            landscape: string[];
            legwear: string[];
            lingerie: string[];
            lipstick_shade: string[];
            lipstick: string[];
            location: string[];
            makeup: string[];
            /** visjs JSON format (network visualisation) */
            male_adult: string[];
            male_young: string[];
            monster: string[];
            /** visjs JSON format (network visualisation) */
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
            /** visjs JSON format (network visualisation) */
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
            /** visjs JSON format (network visualisation) */
            public: string[]; /** visjs JSON format (network visualisation) */
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
        /** return the coresponding comfy prompt  */
        get json(): ComfyPromptJSON;
        /** temporary proxy */
        askBoolean: (msg: string, def?: Maybe<boolean>) => Promise<boolean>;
        askString: (msg: string, def?: Maybe<string>) => Promise<string>;
        constructor(project: ComfyProject, executionContext: ScriptExecution, json?: ComfyPromptJSON);
        private _nextUID;
        getUID: () => string;
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        get allArtifactsImgs(): string[];
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
        get allArtifactsImgs(): string[];
        progress: NodeProgress | null;
        $schema: ComfyNodeSchema;
        status: 'executing' | 'done' | 'error' | 'waiting' | null;
        get isExecuting(): boolean;
        get statusEmoji(): "" | "❌" | "🔥" | "⏳" | "✅";
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