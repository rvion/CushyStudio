import { observer } from 'mobx-react-lite'

import { MessageInfoUI } from '../MessageUI'
import { InstallRequirementsBtnUI, Panel_InstallRequirementsUI } from 'src/controls/REQUIREMENTS/Panel_InstallRequirementsUI'
import { useSt } from 'src/state/stateContext'
import { PanelHeaderUI } from '../PanelHeader'
import { FormUI } from 'src/controls/FormUI'
import { Form } from 'src/controls/Form'
import { readJSON, writeJSON } from 'src/state/jsonUtils'

export const Header_Playground = new Form(
    (ui) => ({
        header: ui.group({
            label: false,
            alignLabel: false,
            layout: 'H',
            border: false,
            collapsed: false,
            items: {
                mode: ui.choice({
                    layout: 'H',
                    label: false,
                    alignLabel: false,
                    border: false,
                    collapsed: false,
                    default: 'scratchPad',
                    items: {
                        requirements: ui.group(),
                        registeredForms: ui.group(),
                        widgetShowcase: ui.group(),
                        scratchPad: ui.group(),
                    },
                }),
                // PlaygroundRequirementsHeader equivalent here when mode == requirements
                _: ui.spacer(),
                // Add option menu here, example:
                // menuButton: ui.menu({formId: "MENU_PLAYGROUND_CONFIG"}),
            },
        }),
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
    const mode = st.playgroundHeader.fields.header.fields.mode

    return (
        <>
            <PanelHeaderUI>
                <FormUI form={st.playgroundHeader} />
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
            <FormUI form={st.playgroundWidgetDisplay} />
        </div>
    )
})
export const FORM_PlaygroundWidgetDisplayss = new Form(
    (ui) => {
        return { test: ui.bool() }
    },
    {
        name: 'Playground Conf',
        initialValue: () => readJSON('settings/playground_form_display.json'),
        onChange: (form) => writeJSON('settings/playground_form_display.json', form.serial),
    },
)

export const FORM_PlaygroundWidgetDisplay = new Form(
    (ui) => {
        const booleanForm = {
            check: ui.bool({}),
            checkLabel: ui.bool({
                label: false,
                text: 'Check Label',
            }),
            checkLabelIcon: ui.bool({
                label: false,
                text: 'Check Label',
                icon: 'save',
            }),
            toggleButton: ui.bool({
                label: '',
                text: 'Toggle Button',
                display: 'button',
            }),
            toggleButtonIcon: ui.bool({
                label: false,
                text: 'Toggle Button Icon',
                display: 'button',
                icon: 'check_box',
            }),
            toggleButtonExpand: ui.bool({
                label: '',
                text: 'Toggle Button Expand',
                display: 'button',
                expand: true,
            }),
            toggleButtonExpandIcon: ui.bool({
                label: '',
                text: 'Toggle Button Expand',
                display: 'button',
                expand: true,
                icon: 'check_box',
            }),
        }

        const intForm = {
            int: ui.int(),
            intConstrained: ui.int({ min: 0, max: 100, step: 10 }),
            intConstrainedSoft: ui.int({ min: 0, max: 100, softMax: 10, step: 10 }),
            intSuffix: ui.int({ min: 0, max: 100, step: 10, suffix: 'px' }),
            intLabel: ui.int({ label: false, text: 'Inner Label', min: 0, max: 100, step: 10 }),
            intLabelSuffix: ui.int({ label: false, text: 'Inner Label Suffix', min: 0, max: 100, step: 10, suffix: 'px' }),
        }

        const floatForm = {
            float: ui.float(),
            floatConstrained: ui.float({ min: 0, max: 100, step: 10 }),
            floatConstrainedSoft: ui.float({ min: 0, max: 100, softMax: 10, step: 10 }),
            floatSuffix: ui.float({ min: 0, max: 100, step: 10, suffix: 'px' }),
            floatLabel: ui.float({ label: false, text: 'Inner Label', min: 0, max: 100, step: 10 }),
            floatLabelSuffix: ui.float({ label: false, text: 'Inner Label Suffix', min: 0, max: 100, step: 10, suffix: 'px' }),
        }

        const dateForm = {
            date: ui.date(),
            dateTime: ui.datetime(),
        }

        const emailForm = {
            email: ui.email(),
        }

        const enumForm = {
            choice: ui.fields({
                enumSelection: ui.choice({
                    items: Object.fromEntries(Object.entries(ui.enum).map(([key]) => [key, ui.group()])),
                }),
            }),
        }

        const groupForm = {
            test: ui.group(),
        }

        const choiceForm = {
            choice: ui.choice({
                label: 'Choice',
                items: { choiceOne: ui.group(), choiceTwo: ui.group(), choiceThree: ui.group() },
            }),
            choices: ui.choices({
                label: 'Choices',
                items: { choiceOne: ui.group(), choiceTwo: ui.group(), choiceThree: ui.group() },
            }),
        }

        return {
            boolean: ui.group({
                startCollapsed: true,
                items: {
                    aligned: ui.group({
                        border: false,
                        items: booleanForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        alignLabel: false,
                        items: booleanForm,
                    }),
                },
            }),

            int: ui.group({
                startCollapsed: true,
                items: {
                    aligned: ui.group({
                        border: false,
                        items: intForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        alignLabel: false,
                        items: intForm,
                    }),
                },
            }),

            float: ui.group({
                startCollapsed: true,
                items: {
                    aligned: ui.group({
                        border: false,
                        items: floatForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        alignLabel: false,
                        items: floatForm,
                    }),
                },
            }),

            button: ui.group({
                startCollapsed: true,
                items: { button: ui.button() },
            }),

            color: ui.group({
                startCollapsed: true,
                items: {
                    v1: ui.group({
                        border: false,
                        items: { color: ui.color({}), colorN: ui.color({ label: false, alignLabel: false }) },
                    }),
                    v2: ui.group({
                        border: false,
                        items: { color: ui.colorV2({}), colorN: ui.colorV2({ label: false, alignLabel: false }) },
                    }),
                },
            }),

            date: ui.group({
                items: {
                    aligned: ui.group({
                        border: false,
                        items: dateForm,
                    }),
                    notAligned: ui.group({
                        border: false,
                        alignLabel: false,
                        items: dateForm,
                    }),
                },
            }),

            email: ui.group({
                items: {
                    aligned: ui.group({ border: false, items: emailForm }),
                    notAligned: ui.group({ border: false, alignLabel: false, items: emailForm }),
                },
            }),

            enum: ui.group({
                items: { aligned: ui.group({ border: false, items: enumForm }) },
            }),

            group: ui.group({
                items: {
                    group: ui.group({ items: { inside: ui.float() } }),
                    groupNoAlign: ui.group({ alignLabel: false, items: { inside: ui.float() } }),
                    groupNoBorder: ui.group({ border: false, items: { inside: ui.float() } }),
                    groupNoCollapse: ui.group({ collapsed: false, items: { inside: ui.float() } }),
                },
            }),

            test: ui.choice({
                items: choiceForm,
            }),
        }
    },
    {
        name: 'Playground Widget Showcase',
        initialValue: () => readJSON('settings/playground_form_display.json'),
        onChange: (form) => writeJSON('settings/playground_form_display.json', form.serial),
    },
)
