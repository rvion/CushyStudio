import { observer } from 'mobx-react-lite'
import { useSt } from '../../../front/FrontStateCtx'
import { InView } from 'react-intersection-observer'
import { StepUI } from './StepUI'

export const StepListUI = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps
    const lastGraph = st.db.graphs.last()
    return (
        <div className='flex flex-col'>
            {/* </Panel> */}
            <div className='flex flex-col-reverse flex-grow' style={{ overflow: 'auto' }}>
                {steps.map((step) => (
                    <InView
                        key={step.id}
                        as='div'
                        onChange={(inView, entry) => {
                            // console.log('Inview:', inView)
                        }}
                    >
                        <StepUI step={step} />
                    </InView>
                ))}
            </div>
        </div>
    )
})
