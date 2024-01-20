import type { FormBuilder, Runtime } from 'src'
import { Cnet_args, cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'
import { OutputFor } from '../_prefabs'

// 🅿️ Lineart FORM ===================================================
export const ui_subform_Lineart = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Lineart',
        customNodesByTitle: 'ComfyUI-Advanced-ControlNet',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Lineart_Preprocessor(),
            cnet_model_name: form.enum({
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: { value: 'control_v11p_sd15_lineart.pth' },
                recommandedModels: { knownModel: ['ControlNet-v1-1 (lineart; fp16)'] },
                group: 'Controlnet',
                label: 'Model',
            }),
        }),
    })
}

export const ui_subform_Lineart_Preprocessor = () => {
    const form = getCurrentForm()
    return form.groupOpt({
        label: 'Lineart Preprocessor',
        startActive: true,
        items: () => ({
            advanced: form.groupOpt({
                label: 'Advanced Preprocessor Settings',
                items: () => ({
                    type: form.choice({
                        label: 'Type',
                        default: 'Realistic',
                        items: {
                            Realistic: () => ui_subform_Lineart_realistic(),
                            Anime: () => ui_subform_Lineart_Anime(),
                            Manga: () => ui_subform_Lineart_Manga(),
                        },
                    }),
                    // TODO: Add support for auto-modifying the resolution based on other form selections
                    // TODO: Add support for auto-cropping
                }),
            }),
        }),
    })
}

export const ui_subform_Lineart_realistic = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Realistic Lineart',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            coarse: form.bool({ default: false }),
        }),
    })
}

export const ui_subform_Lineart_Anime = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Anime Lineart',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

export const ui_subform_Lineart_Manga = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Mange Lineart',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

// 🅿️ Lineart RUN ===================================================
export const run_cnet_Lineart = (
    Lineart: OutputFor<typeof ui_subform_Lineart>,
    image: _IMAGE,
    resolution: 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Lineart.cnet_model_name

    // PREPROCESSOR - Lineart ===========================================================
    if (Lineart.preprocessor) {
        if (Lineart.preprocessor.advanced?.type.Anime) {
            const anime = Lineart.preprocessor.advanced.type.Anime
            image = graph.AnimeLineArtPreprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (anime.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Lineart\\anime' })
            else graph.PreviewImage({ images: image })
        } else if (Lineart.preprocessor.advanced?.type.Manga) {
            const manga = Lineart.preprocessor.advanced.type.Manga
            image = graph.Manga2Anime$_LineArt$_Preprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (manga.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Lineart\\manga' })
            else graph.PreviewImage({ images: image })
        } else {
            const Realistic = Lineart.preprocessor.advanced?.type.Realistic
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
