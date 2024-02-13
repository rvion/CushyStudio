import type { OutputFor } from '../_prefabs'
import type { FormBuilder } from 'src'

import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ Lineart FORM ===================================================
export const ui_subform_Lineart = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Lineart',
        requirements: [
            //
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'ControlNet-v1-1 (lineart; fp16)' },
        ],
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Lineart_Preprocessor(),
            models: form.group({
                label: 'Select or Download Models',
                // startCollapsed: true,
                items: () => ({
                    cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                        label: 'Model',
                        filter: (name) => name.toString().includes('lineart'),
                        // @ts-ignore
                        default: 'control_v11p_sd15_lineart.pth',
                    }),
                }),
            }),
        }),
    })
}

export const ui_subform_Lineart_Preprocessor = () => {
    const form: FormBuilder = getCurrentForm()
    return form.choice({
        label: 'Lineart Preprocessor',
        startCollapsed: true,
        default: 'Realistic',
        appearance: 'tab',
        items: {
            None: () => form.group({}),
            Realistic: () => ui_subform_Lineart_realistic(),
            Anime: () => ui_subform_Lineart_Anime(),
            Manga: () => ui_subform_Lineart_Manga(),
        },
    })
}

export const ui_subform_Lineart_realistic = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            coarse: form.bool({ default: false }),
        }),
    })
}

export const ui_subform_Lineart_Anime = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

export const ui_subform_Lineart_Manga = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
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
