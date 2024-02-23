import { observer } from 'mobx-react-lite'

import { StepOutputsBodyV1UI, StepOutputsV1UI } from '../outputs/StepOutputsV1UI'
import { useSt } from '../state/stateContext'
import { PanelHeaderUI } from './PanelHeader'
import { InputNumberUI } from 'src/controls/widgets/number/InputNumberUI'
import { Slider } from 'src/rsuite/shims'

export const Panel_Steps = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps.getLastN(st.__TEMPT__maxStepsToShow)
    return (
        <div className='flex flex-col'>
            <PanelHeaderUI>
                <div className='line'>
                    <div>number of items to display</div>
                    <InputNumberUI
                        mode='int'
                        min={1}
                        max={100}
                        softMax={20}
                        step={1}
                        value={st.__TEMPT__maxStepsToShow}
                        onValueChange={(next) => (st.__TEMPT__maxStepsToShow = next)}
                    />
                </div>
            </PanelHeaderUI>
            <div className='flex flex-col flex-grow' style={{ overflow: 'auto' }}>
                {steps.map((step) => (
                    <StepOutputsV1UI key={step.id} step={step} />
                ))}
            </div>
        </div>
    )
})

export const Panel_LastStep = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const lastStep = st.db.steps.last()
    if (lastStep == null) return null
    return (
        <div className='flex flex-col'>
            {/* <StepHeaderUI step={lastStep} /> */}
            <StepOutputsBodyV1UI step={lastStep} />
        </div>
    )
})
