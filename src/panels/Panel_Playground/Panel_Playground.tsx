import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { cushyFactory } from '../../controls/Builder'
import { ErrorBoundaryUI } from '../../csuite/errors/ErrorBoundaryUI'
import { FormUI } from '../../csuite/form/FormUI'
import { Frame } from '../../csuite/frame/Frame'
import { MessageInfoUI } from '../../csuite/messages/MessageInfoUI'
import { readJSON, writeJSON } from '../../state/jsonUtils'
import { useSt } from '../../state/stateContext'
import { PlaygroundCustomPanelsUI } from './PlaygroundCustomPanelsUI'
import { PlaygroundForms } from './PlaygroundForms'
import { PlaygroundGraphUI } from './PlaygroundGraphUI'
import { PlaygroundMessages } from './PlaygroundMessages'
import { PlaygroundRegisteredForms } from './PlaygroundRegisteredForms'
import { PlaygroundRequirements, PlaygroundRequirementsHeader } from './PlaygroundRequirements'
import { PlaygroundScratchPad } from './PlaygroundScratchPad'
import { PlaygroundSelectUI } from './PlaygroundSelectUI'
import { PlaygroundSizeUI } from './PlaygroundSize'
import { PlaygroundWidgetDisplay } from './PlaygroundWidgetDisplay'

const Header_Playground = cushyFactory.entity(
    (ui) =>
        ui.choice({
            appearance: 'tab',
            default: 'scratchPad',
            tabPosition: 'start',
            items: {
                forms: ui.empty(),
                customPanels: ui.empty(),
                requirements: ui.empty(),
                registeredForms: ui.empty(),
                widgetShowcase: ui.empty(),
                scratchPad: ui.empty(),
                graph: ui.empty(),
                comfyImport: ui.empty(),
                messages: ui.empty(),
                select: ui.empty(),
                size: ui.empty(),
            },
        }),
    {
        name: 'Playground Conf',
        serial: () => readJSON('settings/playground_config.json'),
        onSerialChange: (form) => writeJSON('settings/playground_config.json', form.serial),
    },
)

export const Panel_Playground = observer(function Panel_Playground_(p: {}) {
    const st = useSt()
    const relPathToThisPage = 'src/panels/Panel_Playground/Panel_Playground.tsx' as RelativePath
    const mode = Header_Playground.value

    useLayoutEffect(() => {
        cushy.layout.syncTabTitle('Playground', {}, 'DevPlayground')
    }, [])

    return (
        <Frame tw='p-1 gap-1' col>
            <MessageInfoUI>
                <div tw='inline text-sm overflow-clip'>
                    <span>Use this panel as a scratchpad by modifying </span>
                    <span tw='rounded px-1'>PlaygroundScratchPad</span>
                    <span> in </span>
                    <span onClick={() => void st.openInVSCode(relPathToThisPage)} tw='cursor-pointer text-info underline'>
                        {relPathToThisPage}
                    </span>
                </div>
            </MessageInfoUI>
            {/* ------------ */}
            {/* <FormUI form={Header_Playground} /> */}
            {/* {Header_Playground.root.renderWithLabel()} */}
            {/* {Header_Playground.root.renderWithLabel({ label: false })} */}
            {Header_Playground.root.header()}
            {/* ------------ */}
            {/* {mode.requirements && <PlaygroundRequirementsHeader />} */}
            <ErrorBoundaryUI>
                {/* 👇 PLAYGROUND HERE */}
                {mode.forms && <PlaygroundForms />}
                {mode.requirements && <PlaygroundRequirements />}
                {mode.registeredForms && <PlaygroundRegisteredForms />}
                {mode.widgetShowcase && <PlaygroundWidgetDisplay />}
                {mode.scratchPad && <PlaygroundScratchPad />}
                {mode.graph && <PlaygroundGraphUI />}
                {mode.customPanels && <PlaygroundCustomPanelsUI />}
                {mode.messages && <PlaygroundMessages />}
                {mode.select && <PlaygroundSelectUI />}
                {mode.size && <PlaygroundSizeUI />}
                {/* {mode.value.comfyImport && <PlaygroundImportFromComfy />} */}
            </ErrorBoundaryUI>
        </Frame>
    )
})
