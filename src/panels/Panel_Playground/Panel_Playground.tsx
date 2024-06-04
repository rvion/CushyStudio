import { observer } from 'mobx-react-lite'
import { useLayoutEffect } from 'react'

import { CushyFormManager } from '../../controls/FormBuilder'
import { FormUI } from '../../controls/FormUI'
import { ErrorBoundaryUI } from '../../rsuite/errors/ErrorBoundaryUI'
import { MessageInfoUI } from '../../rsuite/messages/MessageInfoUI'
import { readJSON, writeJSON } from '../../state/jsonUtils'
import { useSt } from '../../state/stateContext'
import { PlaygroundCustomPanelsUI } from './PlaygroundCustomPanelsUI'
import { PlaygroundGraphUI } from './PlaygroundGraphUI'
import { PlaygroundRegisteredForms } from './PlaygroundRegisteredForms'
import { PlaygroundRequirements, PlaygroundRequirementsHeader } from './PlaygroundRequirements'
import { PlaygroundScratchPad } from './PlaygroundScratchPad'
import { PlaygroundWidgetDisplay } from './PlaygroundWidgetDisplay'

const Header_Playground = CushyFormManager.fields(
    (ui) => ({
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
                customPanels: ui.group(),
                requirements: ui.group(),
                registeredForms: ui.group(),
                widgetShowcase: ui.group(),
                scratchPad: ui.group(),
                graph: ui.group(),
                comfyImport: ui.group(),
            },
        }),
    }),
    {
        name: 'Playground Conf',
        initialSerial: () => readJSON('settings/playground_config.json'),
        onSerialChange: (form) => writeJSON('settings/playground_config.json', form.serial),
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
            {/* <PanelHeaderUI> */}
            <FormUI form={Header_Playground} />
            {mode.value.requirements && <PlaygroundRequirementsHeader />}
            {/* </PanelHeaderUI> */}
            <div tw='px-1'>
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
            <ErrorBoundaryUI>
                <div tw='h-full overflow-auto p-1'>
                    {/* 👇 PLAYGROUND HERE */}
                    {mode.value.requirements && <PlaygroundRequirements />}
                    {mode.value.registeredForms && <PlaygroundRegisteredForms />}
                    {mode.value.widgetShowcase && <PlaygroundWidgetDisplay />}
                    {mode.value.scratchPad && <PlaygroundScratchPad />}
                    {mode.value.graph && <PlaygroundGraphUI />}
                    {mode.value.customPanels && <PlaygroundCustomPanelsUI />}
                    {/* {mode.value.comfyImport && <PlaygroundImportFromComfy />} */}
                </div>
            </ErrorBoundaryUI>
        </>
    )
})
