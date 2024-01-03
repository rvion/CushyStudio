import type { FormBuilder, Runtime } from 'src'
import { Cnet_args, cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'
import { OutputFor } from '../_prefabs'

// 🅿️ Tile FORM ===================================================
export const ui_subform_Tile = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Tile',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Tile_Preprocessor(form),
            cnet_model_name: form.enum({
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: {
                    value: 'control_v11f1e_sd15_tile.pth',
                    knownModel: ['ControlNet-v1-1 (tile; fp16; v11u)', 'ControlNet-v1-1 (tile; fp16; v11f1e)'],
                },
                group: 'Controlnet',
                label: 'Model',
            }),
        }),
    })
}

export const ui_subform_Tile_Preprocessor = (form: FormBuilder) => {
    return form.groupOpt({
        label: 'Tile Preprocessor',
        items: () => ({
            type: form.choice({
                label: 'Type',
                items: () => ({
                    Tile: ui_subform_Tile_pyrUp(form),
                }),
            }),
            // TODO: Add support for auto-modifying the resolution based on other form selections
            // TODO: Add support for auto-cropping
        }),
    })
}

export const ui_subform_Tile_pyrUp = (form: FormBuilder) => {
    return form.group({
        label: 'Tile Preprocessor',
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            pyrup: form.int({ default: 3, min: 0 }),
        }),
    })
}

// 🅿️ Tile RUN ===================================================
export const run_cnet_Tile = async (Tile: OutputFor<typeof ui_subform_Tile>, cnet_args: Cnet_args) => {
    const run = getCurrentRun()
    const graph = run.nodes
    let image: IMAGE
    const cnet_name = Tile.cnet_model_name
    //crop the image to the right size
    //todo: make these editable
    image = graph.ImageScale({
        image: (await run.loadImageAnswer(Tile.image))._IMAGE,
        width: cnet_args.width ?? 512,
        height: cnet_args.height ?? 512,
        upscale_method: Tile.upscale_method,
        crop: Tile.crop,
    })._IMAGE

    // PREPROCESSOR - Tile ===========================================================
    if (Tile.preprocessor) {
        if (Tile.preprocessor.type.Tile) {
            const tile = Tile.preprocessor.type.Tile
            image = graph.TilePreprocessor({
                image: image,
                resolution: tile.resolution,
                pyrUp_iters: tile.pyrup,
            })._IMAGE
            if (tile.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Tile\\midas' })
            else graph.PreviewImage({ images: image })
        }
    }

    return { cnet_name, image }
}
