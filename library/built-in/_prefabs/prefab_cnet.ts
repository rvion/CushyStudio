import { run_cnet_openPose, ui_subform_OpenPose } from './ControlNet/prefab_cnet_openPose'
import { run_cnet_canny, ui_subform_Canny } from './ControlNet/prefab_cnet_canny'
import { run_cnet_Depth, ui_subform_Depth } from './ControlNet/prefab_cnet_depth'
import { run_cnet_Normal, ui_subform_Normal } from './ControlNet/prefab_cnet_normal'
import { ui_subform_Tile, run_cnet_Tile } from './ControlNet/prefab_cnet_tile'
import { run_cnet_IPAdapter, ui_subform_IPAdapter } from './ControlNet/prefab_cnet_ipAdapter'
import { run_cnet_Scribble, ui_subform_Scribble } from './ControlNet/prefab_cnet_scribble'
import { run_cnet_Lineart, ui_subform_Lineart } from './ControlNet/prefab_cnet_lineart'
import { run_cnet_SoftEdge, ui_subform_SoftEdge } from './ControlNet/prefab_cnet_softEdge'
import type { OutputFor } from './_prefabs'
//import type { FormBuilder } from 'src/controls/FormBuilder'
import { FormBuilder } from '../../../src/controls/FormBuilder'
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
                                label: 'Pick Cnets=>',
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

export const run_cnet = async (opts: OutputFor<typeof ui_cnet>, cnet_args: Cnet_args) => {
    const run = getCurrentRun()
    const graph = run.nodes
    // var positive = cnet_args.positive
    // var negative = cnet_args.negative
    // CNET APPLY
    const cnetList = opts?.controlNetList
    let ckpt_return = cnet_args.ckptPos
    let cnet_positive = cnet_args.positive
    let cnet_negative = cnet_args.negative

    if (cnetList) {
        for (const cnetImage of cnetList) {
            let image: IMAGE = (await run.loadImageAnswer(cnetImage.image))._IMAGE
            let cnet_name: Enum_ControlNetLoader_control_net_name

            if (cnetImage.cnets.IPAdapter) {
                // IPAdapter APPLY ===========================================================
                const ip_adapter_result = run_cnet_IPAdapter(cnetImage.cnets.IPAdapter, cnet_args, image)
                ckpt_return = (await ip_adapter_result).ip_adapted_model
            } else {
                let strength: number | undefined
                // CANNY ===========================================================
                if (cnetImage.cnets.Canny) {
                    const cnet_return_canny = await run_cnet_canny(cnetImage.cnets.Canny, cnet_args, image)
                    strength = cnetImage.cnets.Canny.strength
                    image = cnet_return_canny.image
                    cnet_name = cnet_return_canny.cnet_name
                }
                // POSE ===========================================================
                else if (cnetImage.cnets.OpenPose) {
                    const cnet_return_openPose = await run_cnet_openPose(cnetImage.cnets.OpenPose, cnet_args, image)
                    strength = cnetImage.cnets.OpenPose.strength
                    image = cnet_return_openPose.image
                    cnet_name = cnet_return_openPose.cnet_name
                }
                // DEPTH ===========================================================
                else if (cnetImage.cnets.Depth) {
                    const cnet_return_depth = await run_cnet_Depth(cnetImage.cnets.Depth, cnet_args, image)
                    strength = cnetImage.cnets.Depth.strength
                    image = cnet_return_depth.image
                    cnet_name = cnet_return_depth.cnet_name
                }
                // Normal ===========================================================
                else if (cnetImage.cnets.Normal) {
                    const cnet_return_normal = await run_cnet_Normal(cnetImage.cnets.Normal, cnet_args, image)
                    strength = cnetImage.cnets.Normal.strength
                    image = cnet_return_normal.image
                    cnet_name = cnet_return_normal.cnet_name
                }
                // Tile ===========================================================
                else if (cnetImage.cnets.Tile) {
                    const cnet_return_tile = await run_cnet_Tile(cnetImage.cnets.Tile, cnet_args, image)
                    strength = cnetImage.cnets.Tile.strength
                    image = cnet_return_tile.image
                    cnet_name = cnet_return_tile.cnet_name
                }
                // Scribble ===========================================================
                else if (cnetImage.cnets.Scribble) {
                    const cnet_return_scribble = await run_cnet_Scribble(cnetImage.cnets.Scribble, cnet_args, image)
                    strength = cnetImage.cnets.Scribble.strength
                    image = cnet_return_scribble.image
                    cnet_name = cnet_return_scribble.cnet_name
                }
                // Lineart ===========================================================
                else if (cnetImage.cnets.Lineart) {
                    const cnet_return_lineart = await run_cnet_Lineart(cnetImage.cnets.Lineart, cnet_args, image)
                    strength = cnetImage.cnets.Lineart.strength
                    image = cnet_return_lineart.image
                    cnet_name = cnet_return_lineart.cnet_name
                }
                // SoftEdge ===========================================================
                else if (cnetImage.cnets.SoftEdge) {
                    const cnet_return_softedge = await run_cnet_SoftEdge(cnetImage.cnets.SoftEdge, cnet_args, image)
                    strength = cnetImage.cnets.SoftEdge.strength
                    image = cnet_return_softedge.image
                    cnet_name = cnet_return_softedge.cnet_name
                } else {
                    throw new Error('invalid CNET')
                }

                // CONTROL NET APPLY ===========================================================
                const cnet_node = graph.ControlNetApplyAdvanced({
                    strength: strength ?? 1,
                    positive: cnet_positive,
                    negative: cnet_negative,
                    image: /* 🔴 */ bang(image),
                    control_net: graph.ControlNetLoader({
                        control_net_name: /* 🔴 */ bang(cnet_name),
                    }),
                })
                cnet_positive = cnet_node.outputs.positive
                cnet_negative = cnet_node.outputs.negative
            }
        }
    }

    return {
        cnet_positive,
        cnet_negative,
        post_cnet_positive: opts?.useControlnetConditioningForUpscalePassIfEnabled ? cnet_positive : cnet_args.positive, //generally upscales are cleaner if not controlled
        post_cnet_negative: opts?.useControlnetConditioningForUpscalePassIfEnabled ? cnet_negative : cnet_args.negative,
        ckpt_return,
    }
}
