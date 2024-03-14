import { observer } from 'mobx-react-lite'

import { wagon1 } from './wagons/wagon1'
import { WagonUI } from './engine/WagonUI'
import { MessageInfoUI } from '../MessageUI'
import { PanelHeaderUI } from '../PanelHeader'
import { FORM_PlaygroundWidgetDisplay } from './FORM_PlaygroundWidgetDisplay'
import { CushyFormManager } from 'src/controls/FormBuilder'
import { FormUI } from 'src/controls/FormUI'
import { InstallRequirementsBtnUI, Panel_InstallRequirementsUI } from 'src/controls/REQUIREMENTS/Panel_InstallRequirementsUI'
import { readJSON, writeJSON } from 'src/state/jsonUtils'
import { useSt } from 'src/state/stateContext'

const Header_Playground = CushyFormManager.form(
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
        onSerialChange: (form) => writeJSON('settings/playground_config.json', form.serial),
    },
)

// console.log(`[🤠] wagon1`, wagon1)
export const Panel_Playground = observer(function Panel_Playground_(p: {}) {
    console.log(`[🤠] yay`)
    // const wagon1 = (window as any).CushyObservableCache.wagon1
    return <WagonUI wagon={wagon1} />
})
