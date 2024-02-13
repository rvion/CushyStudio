import type { KnownModel_Name } from 'src/manager/model-list/KnownModel_Name'
import type { FormBuilder } from 'src'

//🅿️ IPAdapter Model Selection ===================================================

export const ui_ipadapter_modelSelection = (
    form: FormBuilder,
    defaultModel: Enum_IPAdapterModelLoader_ipadapter_file = 'ip-adapter_sd15.safetensors',
    knownModels:
        | KnownModel_Name //
        | KnownModel_Name[]
        | undefined,
) => {
    return {
        cnet_model_name: form.enum.Enum_IPAdapterModelLoader_ipadapter_file({
            default: defaultModel,
            requirements:
                knownModels == null
                    ? undefined
                    : (Array.isArray(knownModels) ? knownModels : [knownModels]).map((knownModel) => ({
                          type: 'modelInManager',
                          modelName: knownModel,
                      })),
            // default: 'ip-adapter_sd15.safetensors'
            label: 'IP Adapter Model',
        }),
    }
}
