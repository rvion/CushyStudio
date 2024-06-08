import { observer } from 'mobx-react-lite'

import { InstallRequirementsBtnUI, Panel_InstallRequirementsUI } from '../../manager/REQUIREMENTS/Panel_InstallRequirementsUI'

export const PlaygroundRequirementsHeader = observer(function PlaygroundRequirements_(p: {}) {
    return (
        <>
            {/* stuff to test how it looks like when in button form */}
            <InstallRequirementsBtnUI
                active
                requirements={[
                    // { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
                    // { type: 'modelInManager', modelName: 'T2I-Adapter (depth)' },
                    // { type: 'modelInManager', modelName: 'ControlNet-v1-1 (depth; fp16)' },
                    // { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank128.safetensors' },
                    // { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank256.safetensors' },
                    // { type: 'modelInManager', modelName: 'controlnet-SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe' },
                    //
                    { type: 'customNodesByNameInCushy', nodeName: '_0246$5Cloud' },
                    { type: 'customNodesByNameInCushy', nodeName: 'SDXLPromptStylerAdvanced' },
                    //
                    { type: 'customNodesByTitle', title: 'Allor Plugin' },
                    { type: 'customNodesByURI', uri: 'https://civitai.com/api/download/models/24154' },
                    { type: 'customNodesByURI', uri: 'https://github.com/Fannovel16/ComfyUI-Loopchain' },
                    // { type: 'modelCustom',infos:{} }
                    // { type: 'modelInCivitai', civitaiURL: 'https://civitai.com/api/download/models/24154' },
                    { type: 'modelInManager', modelName: 'stabilityai/stable-diffusion-x4-upscaler' },
                ]}
            />
        </>
    )
})
export const PlaygroundRequirements = observer(function PlaygroundRequirements_(p: {}) {
    return (
        <div tw='flex-col'>
            {/* stuff to test how the panel look like when unfolded */}
            <Panel_InstallRequirementsUI
                requirements={[
                    // { type: 'customNodesByTitle', title: 'ComfyUI-Advanced-ControlNet' },
                    // { type: 'modelInManager', modelName: 'T2I-Adapter (depth)' },
                    // { type: 'modelInManager', modelName: 'ControlNet-v1-1 (depth; fp16)' },
                    // { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank128.safetensors' },
                    // { type: 'modelInManager', modelName: 'stabilityai/control-lora-depth-rank256.safetensors' },
                    // { type: 'modelInManager', modelName: 'controlnet-SargeZT/controlnet-sd-xl-1.0-depth-16bit-zoe' },
                    //
                    { type: 'customNodesByNameInCushy', nodeName: '_0246$5Cloud' },
                    { type: 'customNodesByNameInCushy', nodeName: 'SDXLPromptStylerAdvanced' },
                    //
                    { type: 'customNodesByTitle', title: 'Allor Plugin' },
                    { type: 'customNodesByURI', uri: 'https://civitai.com/api/download/models/24154' },
                    { type: 'customNodesByURI', uri: 'https://github.com/Fannovel16/ComfyUI-Loopchain' },
                    // { type: 'modelCustom',infos:{} }
                    // { type: 'modelInCivitai', civitaiURL: 'https://civitai.com/api/download/models/24154' },
                    { type: 'modelInManager', modelName: 'stabilityai/stable-diffusion-x4-upscaler' },
                ]}
            />
        </div>
    )
})
