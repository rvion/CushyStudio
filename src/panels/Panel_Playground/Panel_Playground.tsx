import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { MessageInfoUI } from '../MessageUI'
import { PanelHeaderUI } from '../PanelHeader'
import { FORM_PlaygroundWidgetDisplay } from './FORM_PlaygroundWidgetDisplay'
import { Form } from 'src/controls/Form'
import { FormUI } from 'src/controls/FormUI'
import { InstallRequirementsBtnUI, Panel_InstallRequirementsUI } from 'src/controls/REQUIREMENTS/Panel_InstallRequirementsUI'
import { readJSON, writeJSON } from 'src/state/jsonUtils'
import { useSt } from 'src/state/stateContext'

const Header_Playground = new Form(
    (ui) => ({
        // header: ui.group({
        //     // label: false,
        //     alignLabel: false,
        //     layout: 'H',
        //     border: false,
        //     collapsed: false,
        //     items: {
        mode: ui.choice({
            appearance: 'tab',
            layout: 'H',
            label: false,
            alignLabel: false,
            border: false,
            collapsed: false,
            default: 'scratchPad',
            tabPosition: 'start',
            items: {
                requirements: ui.group(),
                registeredForms: ui.group(),
                widgetShowcase: ui.group(),
                scratchPad: ui.group(),
            },
        }),
        //         // PlaygroundRequirementsHeader equivalent here when mode == requirements
        //         _: ui.spacer(),
        //         // Add option menu here, example:
        //         // menuButton: ui.menu({formId: "MENU_PLAYGROUND_CONFIG"}),
        //     },
        // }),
    }),
    {
        name: 'Playground Conf',
        initialValue: () => readJSON('settings/playground_config.json'),
        onChange: (form) => writeJSON('settings/playground_config.json', form.serial),
    },
)

export const Panel_Playground = observer(function Panel_Playground_(p: {}) {
    const st = useSt()
    const relPathToThisPage = 'src/panels/Panel_Playground/Panel_Playground.tsx' as RelativePath
    const mode = Header_Playground.fields.mode

    useLayoutEffect(() => {
        cushy.layout.syncTabTitle('Playground', {}, 'DevPlayground')
    }, [])

    return (
        <>
            <PanelHeaderUI>
                <FormUI form={Header_Playground} />
                {mode.value.requirements && <PlaygroundRequirementsHeader />}
            </PanelHeaderUI>
            <div tw='px-1 bg-base-300'>
                <MessageInfoUI>
                    <div tw='inline text-sm overflow-clip'>
                        <span>Use this panel as a scratchpad by modifying </span>
                        <span tw='rounded bg-error-2 px-1'>PlaygroundScratchPad</span>
                        <span> in </span>
                        <span onClick={() => st.openInVSCode(relPathToThisPage)} tw='cursor-pointer text-info underline'>
                            {relPathToThisPage}
                        </span>{' '}
                        <span>Do not commit changes in this file unless specifically adding functionality to it.</span>
                    </div>
                </MessageInfoUI>
            </div>
            <div tw='h-full overflow-auto'>
                {/* 👇 PLAYGROUND HERE */}
                {mode.value.requirements && <PlaygroundRequirements />}
                {mode.value.registeredForms && <PlaygroundRegisteredForms />}
                {mode.value.widgetShowcase && <PlaygroundWidgetDisplay />}
                {mode.value.scratchPad && <PlaygroundScratchPad />}
            </div>
        </>
    )
})

/** Freely modify this as you like, then pick the "Scratch Pad" option in the top left. Do not commit changes made to this. */
const PlaygroundScratchPad = observer(function PlaygroundScratchPad_(p: {}) {
    return <div tw='bg-base-300 h-full'></div>
})

const PlaygroundRequirementsHeader = observer(function PlaygroundRequirements_(p: {}) {
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

const PlaygroundRequirements = observer(function PlaygroundRequirements_(p: {}) {
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

/** This will allow devs to view re-usable forms once the form registering system is implemented */
const PlaygroundRegisteredForms = observer(function PlaygroundRequirements_(p: {}) {
    const st = useSt()
    return (
        <div tw='h-full bg-base-300 p-1'>
            <div tw='p-1 rounded bg-base-100 border border-primary/30'>
                <div tw='w-full items-center text-center'>
                    <p>Currently Unused</p>
                </div>
                <div tw='w-full my-1 rounded bg-neutral-content' style={{ height: '1px', minHeight: '1px' }} />
                {/* TODO: Should get a registered form by id and display it. */}
                <FormUI form={st.sideBarConf} />
            </div>
        </div>
    )
})

const PlaygroundWidgetDisplay = observer(function PlaygroundRequirements_(p: {}) {
    const st = useSt()
    return (
        <div tw='h-full bg-base-300 p-1 overflow-auto'>
            <FormUI form={FORM_PlaygroundWidgetDisplay} />
        </div>
    )
})
