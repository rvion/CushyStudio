import { cnet_ui_common } from '../prefab_cnet'
import { OutputFor } from '../_prefabs'

// 🅿️ Sketch FORM ===================================================
export const ui_subform_Sketch = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Sketch',
        requirements: [
            //
            { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
            { type: 'modelInManager', modelName: 'T2I-Adapter (sketch)' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-sketch-rank128-metadata.safetensors' },
            { type: 'modelInManager', modelName: 'stabilityai/control-lora-sketch-rank256.safetensors' },
        ],
        items: () => ({
            cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                label: 'Model',
                default: 't2iadapter_sketch_sd14v1.pth',
            }),
            ...cnet_ui_common(form),
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
