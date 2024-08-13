import type { OutputFor } from '../_prefabs/_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from './cnet_ui_common'

// 🅿️ Lineart FORM ===================================================
export type UI_subform_Lineart = X.XGroup<{
    preprocessor: UI_subform_Lineart_Preprocessor
    models: X.XGroup<{
        cnet_model_name: X.XEnum<Enum_ControlNetLoader_control_net_name>
    }>
    strength: X.XNumber
    advanced: X.XGroup<{
        startAtStepPercent: X.XNumber
        endAtStepPercent: X.XNumber
        crop: X.XEnum<Enum_LatentUpscale_crop>
        upscale_method: X.XEnum<Enum_ImageScale_upscale_method>
    }>
}>

export function ui_subform_Lineart(): UI_subform_Lineart {
    const ui: X.Builder = getCurrentForm()
    return ui
        .group({
            label: 'Lineart',
            items: {
                ...cnet_ui_common(ui),
                preprocessor: ui_subform_Lineart_Preprocessor(),
                models: ui.group({
                    label: 'Select or Download Models',
                    // startCollapsed: true,
                    items: {
                        cnet_model_name: ui.enum.Enum_ControlNetLoader_control_net_name({
                            label: 'Model',
                            filter: (name) => name.toString().includes('lineart'),
                            // @ts-ignore
                            default: 'control_v11p_sd15_lineart.pth',
                        }),
                    },
                }),
            },
        })
        .addRequirements([
            //
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (lineart; fp16)' },
        ])
}

// ====================================================================================================
export type UI_subform_Lineart_Preprocessor = X.XChoice<{
    None: X.XEmpty
    Realistic: UI_subform_Lineart_realistic
    Anime: UI_subform_Lineart_Anime
    Manga: UI_subform_Lineart_Manga
}>
export function ui_subform_Lineart_Preprocessor(): UI_subform_Lineart_Preprocessor {
    const form: X.Builder = getCurrentForm()
    return form.choice({
        label: 'Lineart Preprocessor',
        startCollapsed: true,
        default: 'Realistic',
        appearance: 'tab',
        items: {
            None: form.empty(),
            Realistic: ui_subform_Lineart_realistic(),
            Anime: ui_subform_Lineart_Anime(),
            Manga: ui_subform_Lineart_Manga(),
        },
    })
}

// ====================================================================================================
export type UI_subform_Lineart_realistic = X.XGroup<{
    coarse: X.XBool
    saveProcessedImage: X.XBool
}>
export function ui_subform_Lineart_realistic(): UI_subform_Lineart_realistic {
    const form: X.Builder = getCurrentForm()
    return form.group({
        // label: 'Settings',
        // startCollapsed: true,
        items: {
            ...cnet_preprocessor_ui_common(form),
            coarse: form.bool({ default: false }),
        },
    })
}

// ========================================================================
export type UI_subform_Lineart_Anime = X.XGroup<{
    saveProcessedImage: X.XBool
}>
export function ui_subform_Lineart_Anime(): UI_subform_Lineart_Anime {
    const form: X.Builder = getCurrentForm()
    return form.group({
        // label: 'Settings',
        // startCollapsed: true,
        items: {
            ...cnet_preprocessor_ui_common(form),
        },
    })
}

// ========================================================================
export type UI_subform_Lineart_Manga = X.XGroup<{
    saveProcessedImage: X.XBool
}>
export function ui_subform_Lineart_Manga(): UI_subform_Lineart_Manga {
    const form: X.Builder = getCurrentForm()
    return form.group({
        // label: 'Settings',
        // startCollapsed: true,
        items: {
            ...cnet_preprocessor_ui_common(form),
        },
    })
}

// 🅿️ Lineart RUN ===================================================
export const run_cnet_Lineart = (
    Lineart: OutputFor<typeof ui_subform_Lineart>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Lineart.models.cnet_model_name

    // PREPROCESSOR - Lineart ===========================================================
    if (Lineart.preprocessor) {
        if (Lineart.preprocessor.Anime) {
            const anime = Lineart.preprocessor.Anime
            image = graph.AnimeLineArtPreprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (anime.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Lineart\\anime' })
            else graph.PreviewImage({ images: image })
        } else if (Lineart.preprocessor.Manga) {
            const manga = Lineart.preprocessor.Manga
            image = graph.Manga2Anime$_LineArt$_Preprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (manga.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Lineart\\manga' })
            else graph.PreviewImage({ images: image })
        } else if (Lineart.preprocessor.Realistic) {
            const Realistic = Lineart.preprocessor.Realistic
            image = graph.LineArtPreprocessor({
                image: image,
                resolution: resolution,
                coarse: !Realistic || Realistic?.coarse ? 'enable' : 'disable',
            })._IMAGE
            if (Realistic?.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Lineart\\realistic' })
            else graph.PreviewImage({ images: image })
        }
    }

    return { cnet_name, image }
}
