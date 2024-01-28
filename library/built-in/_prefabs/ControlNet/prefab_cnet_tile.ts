import type { FormBuilder } from 'src'
import type { OutputFor } from '../_prefabs'

import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'

// 🅿️ Tile FORM ===================================================
export const ui_subform_Tile = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Tile',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Tile_Preprocessor(form),
            cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                label: 'Model',
                default: 'control_v11u_sd15_tile_fp16.safetensors',
                filter: (name) => name.toString().includes('_tile'),
                extraDefaults: ['control_v11f1e_sd15_tile.pth'],
                recommandedModels: { knownModel: ['ControlNet-v1-1 (tile; fp16; v11u)', 'ControlNet-v1-1 (tile; fp16; v11f1e)'] },
            }),
        }),
    })
}

export const ui_subform_Tile_Preprocessor = (form: FormBuilder) => {
    return form.groupOpt({
        label: 'Tile Preprocessor',
        startActive: true,
        items: () => ({
            advanced: form.groupOpt({
                label: 'Advanced Preprocessor Settings',
                items: () => ({
                    ...cnet_preprocessor_ui_common(form),
                    pyrup: form.int({ default: 3, min: 0 }),
                    // TODO: Add support for auto-modifying the resolution based on other form selections
                    // TODO: Add support for auto-cropping
                }),
            }),
        }),
    })
}

// 🅿️ Tile RUN ===================================================
export const run_cnet_Tile = (
    Tile: OutputFor<typeof ui_subform_Tile>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Tile.cnet_model_name

    // PREPROCESSOR - Tile ===========================================================
    if (Tile.preprocessor) {
        const tile = Tile.preprocessor.advanced
        image = graph.TilePreprocessor({
            image: image,
            resolution: resolution,
            pyrUp_iters: tile?.pyrup ?? 3,
        })._IMAGE
        if (tile?.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Tile\\midas' })
        else graph.PreviewImage({ images: image })
    }

    return { cnet_name, image }
}
