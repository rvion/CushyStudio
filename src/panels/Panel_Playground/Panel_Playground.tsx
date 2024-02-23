import { observer } from 'mobx-react-lite'

import { MessageInfoUI } from '../MessageUI'
import { InstallRequirementsBtnUI, Panel_InstallRequirementsUI } from 'src/controls/REQUIREMENTS/Panel_InstallRequirementsUI'
import { useSt } from 'src/state/stateContext'

export const Panel_Playground = observer(function Panel_Playground_(p: {}) {
    const st = useSt()
    const relPathToThisPage = 'src/panels/Panel_Playground/Panel_Playground.tsx' as RelativePath
    return (
        <div>
            <h1>Dev Playground - a place for contributor to hack around the codebase</h1>
            <MessageInfoUI>
                <div tw='inline text-sm'>
                    <span>page defined in </span>
                    <span onClick={() => st.openInVSCode(relPathToThisPage)} tw='cursor-pointer text-info underline'>
                        {relPathToThisPage}
                    </span>{' '}
                    <span>Do not commit changes in this file.</span>
                </div>
            </MessageInfoUI>

            {/* 👇 PLAYGROUND HERE */}

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
