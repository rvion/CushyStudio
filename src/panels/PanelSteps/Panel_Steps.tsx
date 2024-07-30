import type { NO_PROPS } from '../../csuite/types/NO_PROPS'

import { observer } from 'mobx-react-lite'

import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { clamp } from '../../csuite/utils/clamp'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { Panel, type PanelHeader } from '../../router/Panel'
import { useSt } from '../../state/stateContext'
import { PanelStepsConf } from './Panel_StepsConf'
import { StepCardUI } from './StepCardUI'

export const PanelSteps = new Panel({
    name: 'Steps',
    widget: (): React.FC<NO_PROPS> => PanelStepsUI,
    header: (p): PanelHeader => ({ title: 'Steps' }),
    def: (): NO_PROPS => ({}),
    icon: undefined,
})

export const PanelStepsUI = observer(function PanelStepsUI_(p: NO_PROPS) {
    // this panels allow to list / search steps matching conditions
    const st = useSt()
    const amount = clamp(Math.round(PanelStepsConf.value.maxItem), 1, 1000)
    console.log(`[🤠] amount`, amount)
    const steps = st.db.step.getLastN(amount)
    return (
        <div className='flex flex-col h-full'>
            <PanelHeaderUI tw='sticky top-0' icon='mdiStepForward'>
                <FormAsDropdownConfigUI form={PanelStepsConf} title='Step Options' />
                {/* HERE SHOULD BE RENDERED AS CELL */}
            </PanelHeaderUI>
            <div className='flex flex-col gap-0.5 flex-grow select-none' style={{ overflow: 'auto' }}>
                {/* {PanelStepsConf.render()} */}
                {steps.map((step, ix: number) => (
                    <StepCardUI contrast={ix % 2 === 0 ? 8 : undefined} key={step.id} step={step} />
                ))}
            </div>
        </div>
    )
})
