import type { ComfyUIManagerKnownModelNames } from 'src/wiki/modelListType'
import type { FormBuilder } from 'src'

//🅿️ IPAdapter Model Selection ===================================================

export const ui_ipadapter_modelSelection = (
    form: FormBuilder,
    defaultModel: Enum_IPAdapterModelLoader_ipadapter_file = 'ip-adapter_sd15.safetensors',
    knownModels: ComfyUIManagerKnownModelNames | ComfyUIManagerKnownModelNames[] | undefined,
) => ({
    cnet_model_name: form.enum.Enum_IPAdapterModelLoader_ipadapter_file({
        default: defaultModel,
        recommandedModels: {
            knownModel: knownModels,
        },
        // default: 'ip-adapter_sd15.safetensors'
        label: 'IP Adapter Model',
    }),
})
