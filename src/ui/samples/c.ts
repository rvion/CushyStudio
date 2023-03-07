export const c__ = `

declare module "core/ComfyNodeUID" {
    export type ComfyNodeUID = string;
    export const getUID: () => string;
}
declare module "client/api" {
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
declare module "core/ComfyNodeJSON" {
    export type ComfyNodeJSON = {
        inputs: {
            [key: string]: any;
        };
        class_type: string;
    };
}
declare module "generator/prettify" {
    export const getRepoFilePath: (...relPath: string[]) => string;
    export const prettify: (out: string, parser?: string) => string;
}
declare module "generator/renderBar" {
    export const renderBar: (text: string, prefix?: string) => string;
}
declare module "generator/CodeBuffer" {
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
        writeTS: (path: string) => void;
    }
    export const repeatStr: (x: number, str: string) => string;
}
declare module "core/dsl.gen" {
    export type NodeInput = {
        name: string;
        type: string;
        opts?: any;
    };
    export type NodeOutput = {
        type: string;
        name: string;
    };
    export type EnumHash = string;
    export type EnumName = string;
    export class MAIN {
        knownTypes: Set<string>;
        knownEnums: Map<string, {
            name: EnumName;
            values: string[];
        }>;
        nodes: NodeDecl[];
        constructor();
        toTSType: (t: string) => string;
        codegen: () => void;
    }
    export class NodeDecl {
        name: string;
        category: string;
        inputs: NodeInput[];
        outputs: NodeOutput[];
        constructor(name: string, category: string, inputs: NodeInput[], outputs: NodeOutput[]);
        codegen(): string;
    }
}
declare module "utils/sleep" {
    export const sleep: (ms: number) => Promise<unknown>;
}
declare module "core/ComfyBase" {
    import { ComfyStatus, WsMsgExecuted, WsMsgExecuting, WsMsgProgress, WsMsgStatus } from "client/api";
    import { ComfyNodeUID } from "core/ComfyNodeUID";
    import { ComfyNode } from "core/ComfyNode";
    /** top level base class */
    export abstract class ComfyBase {
        serverIP: string;
        serverPort: number;
        serverHost: string;
        nodes: Map<string, ComfyNode<any>>;
        constructor();
        getNodeOrCrash: (nodeID: ComfyNodeUID) => ComfyNode<any>;
        currentExecutingNode: ComfyNode<any> | null;
        clientID: string | null;
        status: ComfyStatus | null;
        onStatus: (msg: WsMsgStatus) => void;
        onProgress: (msg: WsMsgProgress) => void;
        onExecuting: (msg: WsMsgExecuting) => void;
        onExecuted: (msg: WsMsgExecuted) => void;
        get(): Promise<Response>;
        toJSON(): {
            [key: string]: any;
        };
    }
}
declare module "core/NodeOutput" {
    import { ComfyNode } from "core/ComfyNode";
    export class NodeOutput<T> {
        node: ComfyNode<any>;
        slotIx: number;
        type: T;
        constructor(node: ComfyNode<any>, slotIx: number, type: T);
    }
}
declare module "core/ComfyNode" {
    import type { NodeProgress } from "client/api";
    import type { ComfyNodeJSON } from "core/ComfyNodeJSON";
    import { ComfyBase } from "core/ComfyBase";
    import { NodeOutput } from "core/NodeOutput";
    export abstract class ComfyNode<ComfyNode_input extends object> {
        comfy: ComfyBase;
        uid: string;
        inputs: ComfyNode_input;
        artifacts: {
            images: string[];
        }[];
        progress: NodeProgress | null;
        get allArtifactsImgs(): string[];
        get(): Promise<void>;
        constructor(comfy: ComfyBase, uid: string, inputs: ComfyNode_input);
        toJSON(): ComfyNodeJSON;
        getExpecteTypeForField(name: string): string;
        getOutputForType(type: string): NodeOutput<any>;
        private serializeValue;
    }
}
declare module "core/dsl" {
    import * as rt from "core/ComfyNodeUID";
    import * as ComfyNode from "core/ComfyNode";
    import { ComfyBase } from "core/ComfyBase";
    import { NodeOutput } from "core/NodeOutput";
    type MODEL = NodeOutput<'MODEL'>;
    type INT = number;
    type FLOAT = number;
    type CONDITIONING = NodeOutput<'CONDITIONING'>;
    type LATENT = NodeOutput<'LATENT'>;
    type STRING = string;
    type CLIP = NodeOutput<'CLIP'>;
    type VAE = NodeOutput<'VAE'>;
    type IMAGE = NodeOutput<'IMAGE'>;
    type MASK = NodeOutput<'MASK'>;
    type CONTROL_NET = NodeOutput<'CONTROL_NET'>;
    type enum_KSampler_sampler_name = 'ddim' | 'dpm_2' | 'dpm_2_ancestral' | 'dpm_adaptive' | 'dpm_fast' | 'dpmpp_2m' | 'dpmpp_2s_ancestral' | 'dpmpp_sde' | 'euler' | 'euler_ancestral' | 'heun' | 'lms' | 'uni_pc' | 'uni_pc_bh2';
    type enum_KSampler_scheduler = 'ddim_uniform' | 'karras' | 'normal' | 'simple';
    type enum_CheckpointLoader_config_name = 'anything_v3.yaml' | 'v1-inference.yaml' | 'v1-inference_clip_skip_2.yaml' | 'v1-inference_clip_skip_2_fp16.yaml' | 'v1-inference_fp16.yaml' | 'v1-inpainting-inference.yaml' | 'v2-inference-v.yaml' | 'v2-inference-v_fp32.yaml' | 'v2-inference.yaml' | 'v2-inference_fp32.yaml' | 'v2-inpainting-inference.yaml';
    type enum_CheckpointLoader_ckpt_name = 'AbyssOrangeMix2_hard.safetensors' | 'v1-5-pruned-emaonly.ckpt';
    type enum_VAELoader_vae_name = 'vae-ft-mse-840000-ema-pruned.safetensors';
    type enum_LatentUpscale_upscale_method = 'area' | 'bilinear' | 'nearest-exact';
    type enum_LatentUpscale_crop = 'center' | 'disabled';
    type enum_LoadImage_image = 'example.png';
    type enum_LoadImageMask_channel = 'alpha' | 'blue' | 'green' | 'red';
    type enum_KSamplerAdvanced_add_noise = 'disable' | 'enable';
    type enum_LatentRotate_rotation = '180 degrees' | '270 degrees' | '90 degrees' | 'none';
    type enum_LatentFlip_flip_method = 'x-axis: vertically' | 'y-axis: horizontally';
    type enum_LoraLoader_lora_name = never;
    export interface HasSingle_MODEL { _MODEL: MODEL; }
    export interface HasSingle_INT { _INT: INT; }
    export interface HasSingle_FLOAT { _FLOAT: FLOAT; }
    export interface HasSingle_CONDITIONING { _CONDITIONING: CONDITIONING; }
    export interface HasSingle_LATENT { _LATENT: LATENT; }
    export interface HasSingle_STRING { _STRING: STRING; }
    export interface HasSingle_CLIP { _CLIP: CLIP; }
    export interface HasSingle_VAE { _VAE: VAE; }
    export interface HasSingle_IMAGE { _IMAGE: IMAGE; }
    export interface HasSingle_MASK { _MASK: MASK; }
    export interface HasSingle_CONTROL_NET { _CONTROL_NET: CONTROL_NET; }
    export interface HasSingle_enum_KSampler_sampler_name { _enum_KSampler_sampler_name: enum_KSampler_sampler_name; }
    export interface HasSingle_enum_KSampler_scheduler { _enum_KSampler_scheduler: enum_KSampler_scheduler; }
    export interface HasSingle_enum_CheckpointLoader_config_name { _enum_CheckpointLoader_config_name: enum_CheckpointLoader_config_name; }
    export interface HasSingle_enum_CheckpointLoader_ckpt_name { _enum_CheckpointLoader_ckpt_name: enum_CheckpointLoader_ckpt_name; }
    export interface HasSingle_enum_VAELoader_vae_name { _enum_VAELoader_vae_name: enum_VAELoader_vae_name; }
    export interface HasSingle_enum_LatentUpscale_upscale_method { _enum_LatentUpscale_upscale_method: enum_LatentUpscale_upscale_method; }
    export interface HasSingle_enum_LatentUpscale_crop { _enum_LatentUpscale_crop: enum_LatentUpscale_crop; }
    export interface HasSingle_enum_LoadImage_image { _enum_LoadImage_image: enum_LoadImage_image; }
    export interface HasSingle_enum_LoadImageMask_channel { _enum_LoadImageMask_channel: enum_LoadImageMask_channel; }
    export interface HasSingle_enum_KSamplerAdvanced_add_noise { _enum_KSamplerAdvanced_add_noise: enum_KSamplerAdvanced_add_noise; }
    export interface HasSingle_enum_LatentRotate_rotation { _enum_LatentRotate_rotation: enum_LatentRotate_rotation; }
    export interface HasSingle_enum_LatentFlip_flip_method { _enum_LatentFlip_flip_method: enum_LatentFlip_flip_method; }
    export interface HasSingle_enum_LoraLoader_lora_name { _enum_LoraLoader_lora_name: enum_LoraLoader_lora_name; }
    export class KSampler extends ComfyNode.ComfyNode<KSampler_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step?: undefined;
            };
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type KSampler_input = {
        model: MODEL | HasSingle_MODEL;
        seed: INT;
        steps: INT;
        cfg: FLOAT;
        sampler_name: enum_KSampler_sampler_name | HasSingle_enum_KSampler_sampler_name;
        scheduler: enum_KSampler_scheduler | HasSingle_enum_KSampler_scheduler;
        positive: CONDITIONING | HasSingle_CONDITIONING;
        negative: CONDITIONING | HasSingle_CONDITIONING;
        latent_image: LATENT | HasSingle_LATENT;
        denoise: FLOAT | HasSingle_FLOAT;
    };
    export class CheckpointLoader extends ComfyNode.ComfyNode<CheckpointLoader_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        MODEL: NodeOutput<"MODEL">;
        CLIP: NodeOutput<"CLIP">;
        VAE: NodeOutput<"VAE">;
        get _MODEL(): NodeOutput<"MODEL">;
        get _CLIP(): NodeOutput<"CLIP">;
        get _VAE(): NodeOutput<"VAE">;
    }
    export type CheckpointLoader_input = {
        config_name: enum_CheckpointLoader_config_name | HasSingle_enum_CheckpointLoader_config_name;
        ckpt_name: enum_CheckpointLoader_ckpt_name | HasSingle_enum_CheckpointLoader_ckpt_name;
    };
    export class CheckpointLoaderSimple extends ComfyNode.ComfyNode<CheckpointLoaderSimple_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        MODEL: NodeOutput<"MODEL">;
        CLIP: NodeOutput<"CLIP">;
        VAE: NodeOutput<"VAE">;
        get _MODEL(): NodeOutput<"MODEL">;
        get _CLIP(): NodeOutput<"CLIP">;
        get _VAE(): NodeOutput<"VAE">;
    }
    export type CheckpointLoaderSimple_input = {
        ckpt_name: enum_CheckpointLoader_ckpt_name | HasSingle_enum_CheckpointLoader_ckpt_name;
    };
    export class CLIPTextEncode extends ComfyNode.ComfyNode<CLIPTextEncode_input> {
        static inputs: ({
            name: string;
            type: string;
            opts: {
                multiline: boolean;
                dynamic_prompt: boolean;
            };
        } | {
            name: string;
            type: string;
            opts?: undefined;
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONDITIONING: NodeOutput<"CONDITIONING">;
        get _CONDITIONING(): NodeOutput<"CONDITIONING">;
    }
    export type CLIPTextEncode_input = {
        text: STRING | HasSingle_STRING;
        clip: CLIP | HasSingle_CLIP;
    };
    export class CLIPSetLastLayer extends ComfyNode.ComfyNode<CLIPSetLastLayer_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CLIP: NodeOutput<"CLIP">;
        get _CLIP(): NodeOutput<"CLIP">;
    }
    export type CLIPSetLastLayer_input = {
        clip: CLIP | HasSingle_CLIP;
        stop_at_clip_layer: INT | HasSingle_INT;
    };
    export class VAEDecode extends ComfyNode.ComfyNode<VAEDecode_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        IMAGE: NodeOutput<"IMAGE">;
        get _IMAGE(): NodeOutput<"IMAGE">;
    }
    export type VAEDecode_input = {
        samples: LATENT | HasSingle_LATENT;
        vae: VAE | HasSingle_VAE;
    };
    export class VAEEncode extends ComfyNode.ComfyNode<VAEEncode_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type VAEEncode_input = {
        pixels: IMAGE | HasSingle_IMAGE;
        vae: VAE | HasSingle_VAE;
    };
    export class VAEEncodeForInpaint extends ComfyNode.ComfyNode<VAEEncodeForInpaint_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type VAEEncodeForInpaint_input = {
        pixels: IMAGE | HasSingle_IMAGE;
        vae: VAE | HasSingle_VAE;
        mask: MASK | HasSingle_MASK;
    };
    export class VAELoader extends ComfyNode.ComfyNode<VAELoader_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        VAE: NodeOutput<"VAE">;
        get _VAE(): NodeOutput<"VAE">;
    }
    export type VAELoader_input = {
        vae_name: enum_VAELoader_vae_name | HasSingle_enum_VAELoader_vae_name;
    };
    export class EmptyLatentImage extends ComfyNode.ComfyNode<EmptyLatentImage_input> {
        static inputs: ({
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step?: undefined;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type EmptyLatentImage_input = {
        width: INT | HasSingle_INT;
        height: INT | HasSingle_INT;
        batch_size: INT | HasSingle_INT;
    };
    export class LatentUpscale extends ComfyNode.ComfyNode<LatentUpscale_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type LatentUpscale_input = {
        samples: LATENT | HasSingle_LATENT;
        upscale_method: enum_LatentUpscale_upscale_method | HasSingle_enum_LatentUpscale_upscale_method;
        width: INT | HasSingle_INT;
        height: INT | HasSingle_INT;
        crop: enum_LatentUpscale_crop | HasSingle_enum_LatentUpscale_crop;
    };
    export class SaveImage extends ComfyNode.ComfyNode<SaveImage_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: string;
            };
        })[];
        static outputs: never[];
    }
    export type SaveImage_input = {
        images: IMAGE | HasSingle_IMAGE;
        filename_prefix: STRING | HasSingle_STRING;
    };
    export class LoadImage extends ComfyNode.ComfyNode<LoadImage_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        IMAGE: NodeOutput<"IMAGE">;
        get _IMAGE(): NodeOutput<"IMAGE">;
    }
    export type LoadImage_input = {
        image: enum_LoadImage_image | HasSingle_enum_LoadImage_image;
    };
    export class LoadImageMask extends ComfyNode.ComfyNode<LoadImageMask_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        MASK: NodeOutput<"MASK">;
        get _MASK(): NodeOutput<"MASK">;
    }
    export type LoadImageMask_input = {
        image: enum_LoadImage_image | HasSingle_enum_LoadImage_image;
        channel: enum_LoadImageMask_channel | HasSingle_enum_LoadImageMask_channel;
    };
    export class ImageScale extends ComfyNode.ComfyNode<ImageScale_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        IMAGE: NodeOutput<"IMAGE">;
        get _IMAGE(): NodeOutput<"IMAGE">;
    }
    export type ImageScale_input = {
        image: IMAGE | HasSingle_IMAGE;
        upscale_method: enum_LatentUpscale_upscale_method | HasSingle_enum_LatentUpscale_upscale_method;
        width: INT | HasSingle_INT;
        height: INT | HasSingle_INT;
        crop: enum_LatentUpscale_crop | HasSingle_enum_LatentUpscale_crop;
    };
    export class ImageInvert extends ComfyNode.ComfyNode<ImageInvert_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        IMAGE: NodeOutput<"IMAGE">;
        get _IMAGE(): NodeOutput<"IMAGE">;
    }
    export type ImageInvert_input = {
        image: IMAGE | HasSingle_IMAGE;
    };
    export class ConditioningCombine extends ComfyNode.ComfyNode<ConditioningCombine_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONDITIONING: NodeOutput<"CONDITIONING">;
        get _CONDITIONING(): NodeOutput<"CONDITIONING">;
    }
    export type ConditioningCombine_input = {
        conditioning_1: CONDITIONING | HasSingle_CONDITIONING;
        conditioning_2: CONDITIONING | HasSingle_CONDITIONING;
    };
    export class ConditioningSetArea extends ComfyNode.ComfyNode<ConditioningSetArea_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONDITIONING: NodeOutput<"CONDITIONING">;
        get _CONDITIONING(): NodeOutput<"CONDITIONING">;
    }
    export type ConditioningSetArea_input = {
        conditioning: CONDITIONING | HasSingle_CONDITIONING;
        width: INT | HasSingle_INT;
        height: INT | HasSingle_INT;
        x: INT | HasSingle_INT;
        y: INT | HasSingle_INT;
        strength: FLOAT | HasSingle_FLOAT;
    };
    export class KSamplerAdvanced extends ComfyNode.ComfyNode<KSamplerAdvanced_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type KSamplerAdvanced_input = {
        model: MODEL | HasSingle_MODEL;
        add_noise: enum_KSamplerAdvanced_add_noise | HasSingle_enum_KSamplerAdvanced_add_noise;
        noise_seed: INT | HasSingle_INT;
        steps: INT | HasSingle_INT;
        cfg: FLOAT | HasSingle_FLOAT;
        sampler_name: enum_KSampler_sampler_name | HasSingle_enum_KSampler_sampler_name;
        scheduler: enum_KSampler_scheduler | HasSingle_enum_KSampler_scheduler;
        positive: CONDITIONING | HasSingle_CONDITIONING;
        negative: CONDITIONING | HasSingle_CONDITIONING;
        latent_image: LATENT | HasSingle_LATENT;
        start_at_step: INT | HasSingle_INT;
        end_at_step: INT | HasSingle_INT;
        return_with_leftover_noise: enum_KSamplerAdvanced_add_noise | HasSingle_enum_KSamplerAdvanced_add_noise;
    };
    export class SetLatentNoiseMask extends ComfyNode.ComfyNode<SetLatentNoiseMask_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type SetLatentNoiseMask_input = {
        samples: LATENT | HasSingle_LATENT;
        mask: MASK | HasSingle_MASK;
    };
    export class LatentComposite extends ComfyNode.ComfyNode<LatentComposite_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type LatentComposite_input = {
        samples_to: LATENT | HasSingle_LATENT;
        samples_from: LATENT | HasSingle_LATENT;
        x: INT | HasSingle_INT;
        y: INT | HasSingle_INT;
        feather: INT | HasSingle_INT;
    };
    export class LatentRotate extends ComfyNode.ComfyNode<LatentRotate_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type LatentRotate_input = {
        samples: LATENT | HasSingle_LATENT;
        rotation: enum_LatentRotate_rotation | HasSingle_enum_LatentRotate_rotation;
    };
    export class LatentFlip extends ComfyNode.ComfyNode<LatentFlip_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type LatentFlip_input = {
        samples: LATENT | HasSingle_LATENT;
        flip_method: enum_LatentFlip_flip_method | HasSingle_enum_LatentFlip_flip_method;
    };
    export class LatentCrop extends ComfyNode.ComfyNode<LatentCrop_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        LATENT: NodeOutput<"LATENT">;
        get _LATENT(): NodeOutput<"LATENT">;
    }
    export type LatentCrop_input = {
        samples: LATENT | HasSingle_LATENT;
        width: INT | HasSingle_INT;
        height: INT | HasSingle_INT;
        x: INT | HasSingle_INT;
        y: INT | HasSingle_INT;
    };
    export class LoraLoader extends ComfyNode.ComfyNode<LoraLoader_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        MODEL: NodeOutput<"MODEL">;
        CLIP: NodeOutput<"CLIP">;
        get _MODEL(): NodeOutput<"MODEL">;
        get _CLIP(): NodeOutput<"CLIP">;
    }
    export type LoraLoader_input = {
        model: MODEL | HasSingle_MODEL;
        clip: CLIP | HasSingle_CLIP;
        lora_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name;
        strength_model: FLOAT | HasSingle_FLOAT;
        strength_clip: FLOAT | HasSingle_FLOAT;
    };
    export class CLIPLoader extends ComfyNode.ComfyNode<CLIPLoader_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CLIP: NodeOutput<"CLIP">;
        get _CLIP(): NodeOutput<"CLIP">;
    }
    export type CLIPLoader_input = {
        clip_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name;
    };
    export class ControlNetApply extends ComfyNode.ComfyNode<ControlNetApply_input> {
        static inputs: ({
            name: string;
            type: string;
            opts?: undefined;
        } | {
            name: string;
            type: string;
            opts: {
                default: number;
                min: number;
                max: number;
                step: number;
            };
        })[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONDITIONING: NodeOutput<"CONDITIONING">;
        get _CONDITIONING(): NodeOutput<"CONDITIONING">;
    }
    export type ControlNetApply_input = {
        conditioning: CONDITIONING | HasSingle_CONDITIONING;
        control_net: CONTROL_NET | HasSingle_CONTROL_NET;
        image: IMAGE | HasSingle_IMAGE;
        strength: FLOAT | HasSingle_FLOAT;
    };
    export class ControlNetLoader extends ComfyNode.ComfyNode<ControlNetLoader_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONTROL_NET: NodeOutput<"CONTROL_NET">;
        get _CONTROL_NET(): NodeOutput<"CONTROL_NET">;
    }
    export type ControlNetLoader_input = {
        control_net_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name;
    };
    export class DiffControlNetLoader extends ComfyNode.ComfyNode<DiffControlNetLoader_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONTROL_NET: NodeOutput<"CONTROL_NET">;
        get _CONTROL_NET(): NodeOutput<"CONTROL_NET">;
    }
    export type DiffControlNetLoader_input = {
        model: MODEL | HasSingle_MODEL;
        control_net_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name;
    };
    export class T2IAdapterLoader extends ComfyNode.ComfyNode<T2IAdapterLoader_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        CONTROL_NET: NodeOutput<"CONTROL_NET">;
        get _CONTROL_NET(): NodeOutput<"CONTROL_NET">;
    }
    export type T2IAdapterLoader_input = {
        t2i_adapter_name: enum_LoraLoader_lora_name | HasSingle_enum_LoraLoader_lora_name;
    };
    export class VAEDecodeTiled extends ComfyNode.ComfyNode<VAEDecodeTiled_input> {
        static inputs: {
            name: string;
            type: string;
        }[];
        static outputs: {
            type: string;
            name: string;
        }[];
        IMAGE: NodeOutput<"IMAGE">;
        get _IMAGE(): NodeOutput<"IMAGE">;
    }
    export type VAEDecodeTiled_input = {
        samples: LATENT | HasSingle_LATENT;
        vae: VAE | HasSingle_VAE;
    };
    export const nodes: {
        KSampler: typeof KSampler;
        CheckpointLoader: typeof CheckpointLoader;
        CheckpointLoaderSimple: typeof CheckpointLoaderSimple;
        CLIPTextEncode: typeof CLIPTextEncode;
        CLIPSetLastLayer: typeof CLIPSetLastLayer;
        VAEDecode: typeof VAEDecode;
        VAEEncode: typeof VAEEncode;
        VAEEncodeForInpaint: typeof VAEEncodeForInpaint;
        VAELoader: typeof VAELoader;
        EmptyLatentImage: typeof EmptyLatentImage;
        LatentUpscale: typeof LatentUpscale;
        SaveImage: typeof SaveImage;
        LoadImage: typeof LoadImage;
        LoadImageMask: typeof LoadImageMask;
        ImageScale: typeof ImageScale;
        ImageInvert: typeof ImageInvert;
        ConditioningCombine: typeof ConditioningCombine;
        ConditioningSetArea: typeof ConditioningSetArea;
        KSamplerAdvanced: typeof KSamplerAdvanced;
        SetLatentNoiseMask: typeof SetLatentNoiseMask;
        LatentComposite: typeof LatentComposite;
        LatentRotate: typeof LatentRotate;
        LatentFlip: typeof LatentFlip;
        LatentCrop: typeof LatentCrop;
        LoraLoader: typeof LoraLoader;
        CLIPLoader: typeof CLIPLoader;
        ControlNetApply: typeof ControlNetApply;
        ControlNetLoader: typeof ControlNetLoader;
        DiffControlNetLoader: typeof DiffControlNetLoader;
        T2IAdapterLoader: typeof T2IAdapterLoader;
        VAEDecodeTiled: typeof VAEDecodeTiled;
    };
    export type NodeType = keyof typeof nodes;
    export class Comfy extends ComfyBase {
        KSampler: (args: KSampler_input, uid?: rt.ComfyNodeUID) => KSampler;
        CheckpointLoader: (args: CheckpointLoader_input, uid?: rt.ComfyNodeUID) => CheckpointLoader;
        CheckpointLoaderSimple: (args: CheckpointLoaderSimple_input, uid?: rt.ComfyNodeUID) => CheckpointLoaderSimple;
        CLIPTextEncode: (args: CLIPTextEncode_input, uid?: rt.ComfyNodeUID) => CLIPTextEncode;
        CLIPSetLastLayer: (args: CLIPSetLastLayer_input, uid?: rt.ComfyNodeUID) => CLIPSetLastLayer;
        VAEDecode: (args: VAEDecode_input, uid?: rt.ComfyNodeUID) => VAEDecode;
        VAEEncode: (args: VAEEncode_input, uid?: rt.ComfyNodeUID) => VAEEncode;
        VAEEncodeForInpaint: (args: VAEEncodeForInpaint_input, uid?: rt.ComfyNodeUID) => VAEEncodeForInpaint;
        VAELoader: (args: VAELoader_input, uid?: rt.ComfyNodeUID) => VAELoader;
        EmptyLatentImage: (args: EmptyLatentImage_input, uid?: rt.ComfyNodeUID) => EmptyLatentImage;
        LatentUpscale: (args: LatentUpscale_input, uid?: rt.ComfyNodeUID) => LatentUpscale;
        SaveImage: (args: SaveImage_input, uid?: rt.ComfyNodeUID) => SaveImage;
        LoadImage: (args: LoadImage_input, uid?: rt.ComfyNodeUID) => LoadImage;
        LoadImageMask: (args: LoadImageMask_input, uid?: rt.ComfyNodeUID) => LoadImageMask;
        ImageScale: (args: ImageScale_input, uid?: rt.ComfyNodeUID) => ImageScale;
        ImageInvert: (args: ImageInvert_input, uid?: rt.ComfyNodeUID) => ImageInvert;
        ConditioningCombine: (args: ConditioningCombine_input, uid?: rt.ComfyNodeUID) => ConditioningCombine;
        ConditioningSetArea: (args: ConditioningSetArea_input, uid?: rt.ComfyNodeUID) => ConditioningSetArea;
        KSamplerAdvanced: (args: KSamplerAdvanced_input, uid?: rt.ComfyNodeUID) => KSamplerAdvanced;
        SetLatentNoiseMask: (args: SetLatentNoiseMask_input, uid?: rt.ComfyNodeUID) => SetLatentNoiseMask;
        LatentComposite: (args: LatentComposite_input, uid?: rt.ComfyNodeUID) => LatentComposite;
        LatentRotate: (args: LatentRotate_input, uid?: rt.ComfyNodeUID) => LatentRotate;
        LatentFlip: (args: LatentFlip_input, uid?: rt.ComfyNodeUID) => LatentFlip;
        LatentCrop: (args: LatentCrop_input, uid?: rt.ComfyNodeUID) => LatentCrop;
        LoraLoader: (args: LoraLoader_input, uid?: rt.ComfyNodeUID) => LoraLoader;
        CLIPLoader: (args: CLIPLoader_input, uid?: rt.ComfyNodeUID) => CLIPLoader;
        ControlNetApply: (args: ControlNetApply_input, uid?: rt.ComfyNodeUID) => ControlNetApply;
        ControlNetLoader: (args: ControlNetLoader_input, uid?: rt.ComfyNodeUID) => ControlNetLoader;
        DiffControlNetLoader: (args: DiffControlNetLoader_input, uid?: rt.ComfyNodeUID) => DiffControlNetLoader;
        T2IAdapterLoader: (args: T2IAdapterLoader_input, uid?: rt.ComfyNodeUID) => T2IAdapterLoader;
        VAEDecodeTiled: (args: VAEDecodeTiled_input, uid?: rt.ComfyNodeUID) => VAEDecodeTiled;
    }
}



declare const C: import('core/dsl').Comfy;
`
