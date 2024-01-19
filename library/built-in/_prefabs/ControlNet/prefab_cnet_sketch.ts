import { cnet_ui_common } from '../prefab_cnet'
import { OutputFor } from '../_prefabs'

// 🅿️ Sketch FORM ===================================================
export const ui_subform_Sketch = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Sketch',
        customNodesByTitle: 'ComfyUI-Advanced-ControlNet',
        items: () => ({
            ...cnet_ui_common(form),
            cnet_model_name: form.enum({
                enumName: 'Enum_ControlNetLoader_control_net_name',
                default: {
                    value: 't2iadapter_sketch_sd14v1.pth',
                },
                recommandedModels: {
                    knownModel: [
                        'T2I-Adapter (sketch)',
                        'stabilityai/control-lora-sketch-rank128-metadata.safetensors',
                        'stabilityai/control-lora-sketch-rank256.safetensors',
                    ],
                },
                group: 'Controlnet',
                label: 'Model',
            }),
        }),
    })
}

// 🅿️ Sketch RUN ===================================================
export const run_cnet_Sketch = (
    Sketch: OutputFor<typeof ui_subform_Sketch>,
    image: _IMAGE,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Sketch.cnet_model_name

    //sketch does not really have any preprocessor or anything, so not much here

    return { cnet_name, image }
}
