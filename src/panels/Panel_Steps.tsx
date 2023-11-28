import { observer } from 'mobx-react-lite'
import { Slider } from 'src/rsuite/shims'
import { useSt } from '../state/stateContext'
import { StepOutputsBodyV1UI, StepOutputsV1UI } from '../outputs/StepOutputsV1UI'

export const Panel_Steps = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps.stmt_lastN(st.__TEMPT__maxStepsToShow)
    return (
        <div className='flex flex-col'>
            {/* <FieldAndLabelUI label='Show Last'> */}
            <Slider
                style={{ width: '5rem' }}
                min={1}
                max={100}
                value={st.__TEMPT__maxStepsToShow}
                onChange={(ev) => (st.__TEMPT__maxStepsToShow = parseInt(ev.target.value, 10))}
            />
            {/* </FieldAndLabelUI> */}
            {/* </Panel> */}
            <div className='flex flex-col-reverse flex-grow' style={{ overflow: 'auto' }}>
                {steps.map((step) => (
                    // <InView key={step.id} as='div' onChange={(inView, entry) => {}}>
                    <StepOutputsV1UI step={step} />
                    // </InView>
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
