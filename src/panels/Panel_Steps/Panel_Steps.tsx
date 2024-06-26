import { observer } from 'mobx-react-lite'

import { FormAsDropdownConfigUI } from '../../csuite/form/FormAsDropdownConfigUI'
import { clamp } from '../../csuite/utils/clamp'
import { PanelHeaderUI } from '../../csuite/wrappers/PanelHeader'
import { useSt } from '../../state/stateContext'
import { PanelStepsConf } from './Panel_StepsConf'
import { StepCardUI } from './StepCardUI'

export const Panel_Steps = observer(function StepListUI_(p: {}) {
    // this panels allow to list / search steps matching conditions
    const st = useSt()
    const amount = clamp(Math.round(PanelStepsConf.value.maxItem), 1, 1000)
    console.log(`[🤠] amount`, amount)
    const steps = st.db.step.getLastN(amount)
    return (
        <div className='flex flex-col h-full'>
            <PanelHeaderUI tw='sticky top-0' title='Steps' icon='mdiStepForward'>
                <FormAsDropdownConfigUI tw='ml-auto' form={PanelStepsConf} title='Step Options' />
            </PanelHeaderUI>
            <div className='flex flex-col gap-0.5 flex-grow select-none' style={{ overflow: 'auto' }}>
                {PanelStepsConf.render()}
                {steps.map((step) => (
                    <StepCardUI key={step.id} step={step} />
                ))}
            </div>
        </div>
    )
})
