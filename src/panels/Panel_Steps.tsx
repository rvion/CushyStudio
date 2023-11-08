import { observer } from 'mobx-react-lite'
import { useSt } from '../state/stateContext'
import { InView } from 'react-intersection-observer'
import { StepUI } from '../widgets/workspace/StepUI'

export const Panel_Steps = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps
    const lastGraph = st.db.graphs.last()
    return (
        <div className='flex flex-col'>
            {/* </Panel> */}
            <div className='flex flex-col-reverse flex-grow' style={{ overflow: 'auto' }}>
                {steps.map((step) => (
                    <InView key={step.id} as='div' onChange={(inView, entry) => {}}>
                        <StepUI step={step} />
                    </InView>
                ))}
            </div>
        </div>
    )
})
