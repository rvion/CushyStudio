import type { KnownModel_Name } from '../../../src/CUSHY'

//🅿️ IPAdapter Model Selection ===================================================

export type UI_ipadapter_modelSelection = {
   cnet_model_name: Z.Enum<'IPAdapter_plus.IPAdapterModelLoader.ipadapter_file'>
}

export const ui_ipadapter_modelSelection = (
   form: Z.Builder,
   defaultModel: Comfy.Slots['IPAdapter_plus.IPAdapterModelLoader.ipadapter_file'] = 'ip-adapter_sd15.safetensors' as any,
   knownModels:
      | KnownModel_Name //
      | KnownModel_Name[]
      | undefined,
): UI_ipadapter_modelSelection => {
   return {
      cnet_model_name: form.enum['IPAdapter_plus.IPAdapterModelLoader.ipadapter_file']({
         default: defaultModel,
         // default: 'ip-adapter_sd15.safetensors'
         label: 'IP Adapter Model',
      }).addRequirements(
         knownModels == null
            ? undefined
            : (Array.isArray(knownModels) ? knownModels : [knownModels]).map((knownModel) => ({
                 type: 'modelInManager',
                 modelName: knownModel,
              })),
      ),
   }
}
