import type { KnownModel_Name } from '../../../src/CUSHY'

//🅿️ IPAdapter Model Selection ===================================================

export type UI_ipadapter_modelSelection = {
    cnet_model_name: X.XEnum<Enum_AV$_IPAdapterPipe_ip_adapter_name>
}

export const ui_ipadapter_modelSelection = (
    form: X.Builder,
    defaultModel: Enum_IPAdapterModelLoader_ipadapter_file = 'ip-adapter_sd15.safetensors',
    knownModels:
        | KnownModel_Name //
        | KnownModel_Name[]
        | undefined,
): UI_ipadapter_modelSelection => {
    return {
        cnet_model_name: form.enum
            .Enum_IPAdapterModelLoader_ipadapter_file({
                default: defaultModel,
                // default: 'ip-adapter_sd15.safetensors'
                label: 'IP Adapter Model',
            })
            .addRequirements(
                knownModels == null
                    ? undefined
                    : (Array.isArray(knownModels) ? knownModels : [knownModels]).map((knownModel) => ({
                          type: 'modelInManager',
                          modelName: knownModel,
                      })),
            ),
    }
}
