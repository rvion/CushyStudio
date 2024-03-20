import { observer } from 'mobx-react-lite'

import { StepOutputsBodyV1UI, StepOutputsV1UI } from '../outputs/StepOutputsV1UI'
import { useSt } from '../state/stateContext'
import { PanelHeaderUI } from './PanelHeader'
import { InputNumberUI } from '../controls/widgets/number/InputNumberUI'
import { SpacerUI } from '../controls/widgets/spacer/SpacerUI'
import { RevealUI } from '../rsuite/reveal/RevealUI'

export const Panel_Steps = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.step.getLastN(st.__TEMPT__maxStepsToShow)
    return (
        <div className='flex flex-col overflow-hidden'>
            <PanelHeaderUI>
                <SpacerUI />
                <RevealUI
                    tw='WIDGET-FIELD'
                    title='Step Options'
                    content={() => (
                        <div tw='w-64 p-2' className='line'>
                            <InputNumberUI
                                mode='int'
                                min={1}
                                max={100}
                                softMax={20}
                                step={1}
                                text='Items'
                                value={st.__TEMPT__maxStepsToShow}
                                onValueChange={(next) => (st.__TEMPT__maxStepsToShow = next)}
                            />
                        </div>
                    )}
                >
                    <div tw='flex px-1 cursor-default bg-base-200 rounded w-full h-full items-center justify-center hover:brightness-125 border border-base-100'>
                        <span className='material-symbols-outlined'>settings</span>
                        <span className='material-symbols-outlined'>expand_more</span>
                    </div>
                </RevealUI>
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
    const lastStep = st.db.step.last()
    if (lastStep == null) return null
    return (
        <div className='flex flex-col'>
            {/* <StepHeaderUI step={lastStep} /> */}
            <StepOutputsBodyV1UI step={lastStep} />
        </div>
    )
})
