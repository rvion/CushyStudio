import type { OutputFor } from './_prefabs'
import type { FormBuilder } from '../../../src/controls/FormBuilder'

import { run_cnet_openPose, ui_subform_OpenPose } from './ControlNet/prefab_cnet_openPose'
import { run_cnet_canny, ui_subform_Canny } from './ControlNet/prefab_cnet_canny'
import { run_cnet_Depth, ui_subform_Depth } from './ControlNet/prefab_cnet_depth'
import { run_cnet_Normal, ui_subform_Normal } from './ControlNet/prefab_cnet_normal'
import { ui_subform_Tile, run_cnet_Tile } from './ControlNet/prefab_cnet_tile'
import { run_cnet_IPAdapter, ui_subform_IPAdapter } from './ControlNet/prefab_cnet_ipAdapter'
import { run_cnet_Scribble, ui_subform_Scribble } from './ControlNet/prefab_cnet_scribble'
import { run_cnet_Lineart, ui_subform_Lineart } from './ControlNet/prefab_cnet_lineart'
import { run_cnet_SoftEdge, ui_subform_SoftEdge } from './ControlNet/prefab_cnet_softEdge'
import { getCurrentForm } from '../../../src/models/_ctx2'
import { bang } from 'src/utils/misc/bang'

// 🅿️ CNET UI -----------------------------------------------------------
export const ui_cnet = () => {
    const form = getCurrentForm()
    return form.groupOpt({
        label: 'ControlNets',
        items: () => ({
            useControlnetConditioningForUpscalePassIfEnabled: form.bool({ default: false }),
            controlNetList: form.list({
                label: false,
                element: () =>
                    form.group({
                        label: 'Controlnet Image',
                        items: () => ({
                            image: form.image({
                                default: 'cushy',
                                group: 'Cnet_Image',
                                tooltip:
                                    'There is currently a bug with multiple controlnets where an image wont allow drop except for the first controlnet in the list. If you add multiple controlnets, then reload using Ctrl+R, it should allow you to drop an image on any of the controlnets.',
                            }),
                            cnets: form.choices({
                                label: false, //'Pick Cnets=>',
                                placeholder: 'ControlNets...',
                                items: () => ({
                                    OpenPose: ui_subform_OpenPose(),
                                    Canny: ui_subform_Canny(),
                                    Depth: ui_subform_Depth(),
                                    Normal: ui_subform_Normal(),
                                    Tile: ui_subform_Tile(),
                                    IPAdapter: ui_subform_IPAdapter(),
                                    Scribble: ui_subform_Scribble(),
                                    Lineart: ui_subform_Lineart(),
                                    SoftEdge: ui_subform_SoftEdge(),
                                }),
                            }),
                        }),
                    }),
            }),
        }),
    })
}

// 🅿️ CNET COMMON FORM ===================================================
export const cnet_ui_common = (form: FormBuilder) => ({
    strength: form.float({ default: 1, min: 0, max: 2, step: 0.1 }),
    advanced: form.groupOpt({
        items: () => ({
            startAtStepPercent: form.float({ default: 0, min: 0, max: 1, step: 0.1 }),
            endAtStepPercent: form.float({ default: 1, min: 0, max: 1, step: 0.1 }),
            crop: form.enum({
                enumName: 'Enum_LatentUpscale_crop',
                default: 'disabled',
                group: 'ControlNet',
                label: 'Image Prep Crop mode',
            }),
            upscale_method: form.enum({
                enumName: 'Enum_ImageScale_upscale_method',
                default: 'lanczos',
                group: 'ControlNet',
                label: 'Scale method',
            }),
        }),
    }),
})

export const cnet_preprocessor_ui_common = (form: FormBuilder) => ({
    saveProcessedImage: form.bool({ default: false }),
    resolution: form.int({ default: 512, min: 512, max: 1024, step: 512 }),
})

// RUN -----------------------------------------------------------
export type Cnet_args = {
    positive: _CONDITIONING
    negative: _CONDITIONING
    width: INT
    height: INT
    ckptPos: _MODEL
}

export type Cnet_return = {
    cnet_positive: _CONDITIONING
    cnet_negative: _CONDITIONING
    post_cnet_positive: _CONDITIONING
    post_cnet_negative: _CONDITIONING
    ckpt_return: _MODEL
}

export const run_cnet = async (opts: OutputFor<typeof ui_cnet>, ctx: Cnet_args) => {
    const run = getCurrentRun()
    const cnetList = opts?.controlNetList
    let args: Cnet_args = { ...ctx }

    if (cnetList) {
        for (const cnetImage of cnetList) {
            let image: IMAGE = (await run.loadImageAnswer(cnetImage.image))._IMAGE

            const { IPAdapter, Canny, Depth, Normal, Lineart, OpenPose, Scribble, SoftEdge, Tile } = cnetImage.cnets
            // IPAdapter ===========================================================
            if (IPAdapter) {
                const ip_adapter_result = run_cnet_IPAdapter(IPAdapter, ctx, image)
                args.ckptPos = ip_adapter_result.ip_adapted_model
            }
            // CANNY ===========================================================
            if (Canny) {
                const y = run_cnet_canny(Canny, ctx, image)
                _apply_cnet(args, Canny.strength, y.image, y.cnet_name)
            }
            // POSE ===========================================================
            if (OpenPose) {
                const y = run_cnet_openPose(OpenPose, ctx, image)
                _apply_cnet(args, OpenPose.strength, y.image, y.cnet_name)
            }
            // DEPTH ===========================================================
            if (Depth) {
                const y = run_cnet_Depth(Depth, ctx, image)
                _apply_cnet(args, Depth.strength, y.image, y.cnet_name)
            }
            // Normal ===========================================================
            if (Normal) {
                const y = run_cnet_Normal(Normal, ctx, image)
                _apply_cnet(args, Normal.strength, y.image, y.cnet_name)
            }
            // Tile ===========================================================
            if (Tile) {
                const y = run_cnet_Tile(Tile, ctx, image)
                _apply_cnet(args, Tile.strength, y.image, y.cnet_name)
            }
            // Scribble ===========================================================
            if (Scribble) {
                const y = run_cnet_Scribble(Scribble, ctx, image)
                _apply_cnet(args, Scribble.strength, y.image, y.cnet_name)
            }
            // Lineart ===========================================================
            if (Lineart) {
                const y = run_cnet_Lineart(Lineart, ctx, image)
                _apply_cnet(args, Lineart.strength, y.image, y.cnet_name)
            }
            // SoftEdge ===========================================================
            if (SoftEdge) {
                const y = run_cnet_SoftEdge(SoftEdge, ctx, image)
                _apply_cnet(args, SoftEdge.strength, y.image, y.cnet_name)
            }
        }
    }

    return {
        // transformed ckpt
        ckpt_return: args.ckptPos,

        // transformed conditionnings
        cnet_positive: args.positive,
        cnet_negative: args.negative,

        // forward either the original or the transformed conditioning
        post_cnet_positive: opts?.useControlnetConditioningForUpscalePassIfEnabled //
            ? args.positive
            : ctx.positive, // generally upscales are cleaner if not controlled
        post_cnet_negative: opts?.useControlnetConditioningForUpscalePassIfEnabled //
            ? args.negative
            : ctx.negative,
    }
}

const _apply_cnet = (
    args: Cnet_args,
    //
    strength: number,
    image: _IMAGE,
    cnet_name: Enum_ControlNetLoader_control_net_name,
) => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_node = graph.ControlNetApplyAdvanced({
        strength: strength ?? 1,
        positive: args.positive,
        negative: args.negative,
        image: /* 🔴 */ bang(image),
        control_net: graph.ControlNetLoader({
            control_net_name: /* 🔴 */ bang(cnet_name),
        }),
    })
    args.positive = cnet_node.outputs.positive
    args.negative = cnet_node.outputs.negative
}
