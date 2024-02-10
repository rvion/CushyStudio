import { cnet_preprocessor_ui_common, cnet_ui_common } from '../prefab_cnet'
import type { OutputFor } from '../_prefabs'
import type { FormBuilder } from 'src'

// 🅿️ Scribble FORM ===================================================
export const ui_subform_Scribble = () => {
    const form: FormBuilder = getCurrentForm()
    return form.group({
        label: 'Scribble',
        customNodesByTitle: 'ComfyUI-Advanced-ControlNet',
        items: () => ({
            ...cnet_ui_common(form),
            preprocessor: ui_subform_Scribble_Preprocessor(),
            cnet_model_name: form.enum.Enum_ControlNetLoader_control_net_name({
                default: 'control_scribble-fp16.safetensors',
                extraDefaults: ['control_v11p_sd15_scribble.pth'],
                filter: (name) => name.toString().includes('scribble'),
                recommandedModels: { knownModel: ['ControlNet-v1-1 (scribble; fp16)'] },
                label: 'Model',
            }),
        }),
    })
}

export const ui_subform_Scribble_Preprocessor = () => {
    const form = getCurrentForm()
    return form.choice({
        label: 'Scribble Preprocessor',
        default: 'ScribbleLines',
        appearance: 'tab',
        startCollapsed: true,
        items: {
            None: () => form.group({}),
            ScribbleLines: () => ui_subform_Scribble_Lines(),
            FakeScribble: () => ui_subform_Fake_Scribble_Lines(),
            XDOG: () => ui_subform_Scribble_XDoG_Lines(),
        },
    })
}

export const ui_subform_Scribble_Lines = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
        }),
    })
}

export const ui_subform_Fake_Scribble_Lines = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            safe: form.bool({ default: true }),
        }),
    })
}

export const ui_subform_Scribble_XDoG_Lines = () => {
    const form = getCurrentForm()
    return form.group({
        label: 'Settings',
        startCollapsed: true,
        items: () => ({
            ...cnet_preprocessor_ui_common(form),
            threshold: form.int({ default: 32, min: 0, max: 64 }),
        }),
    })
}

// 🅿️ Scribble RUN ===================================================
export const run_cnet_Scribble = (
    Scribble: OutputFor<typeof ui_subform_Scribble>,
    image: _IMAGE,
    resolution: number, // 512 | 768 | 1024 = 512,
): {
    image: _IMAGE
    cnet_name: Enum_ControlNetLoader_control_net_name
} => {
    const run = getCurrentRun()
    const graph = run.nodes
    const cnet_name = Scribble.cnet_model_name

    // PREPROCESSOR - Scribble ===========================================================
    if (Scribble.preprocessor) {
        if (Scribble.preprocessor.FakeScribble) {
            const fake = Scribble.preprocessor.FakeScribble
            image = graph.FakeScribblePreprocessor({
                image: image,
                resolution: resolution,
                safe: fake.safe ? 'enable' : 'disable',
            })._IMAGE
            if (fake.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\fake' })
            else graph.PreviewImage({ images: image })
        } else if (Scribble.preprocessor.XDOG) {
            const xdog = Scribble.preprocessor.XDOG
            image = graph.Scribble$_XDoG$_Preprocessor({
                image: image,
                resolution: resolution,
                threshold: xdog.threshold,
            })._IMAGE
            if (xdog.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\xdog' })
            else graph.PreviewImage({ images: image })
        } else if (Scribble.preprocessor.ScribbleLines) {
            const scribble = Scribble.preprocessor.ScribbleLines
            image = graph.ScribblePreprocessor({
                image: image,
                resolution: resolution,
            })._IMAGE
            if (scribble.saveProcessedImage) graph.SaveImage({ images: image, filename_prefix: 'cnet\\Scribble\\scribble' })
            else graph.PreviewImage({ images: image })
        }
    }

    return { cnet_name, image }
}
