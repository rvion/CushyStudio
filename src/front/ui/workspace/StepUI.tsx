import type { StepL } from 'src/models/Step'

import { Panel } from 'rsuite'
import { observer } from 'mobx-react-lite'
import { StepOutputUI } from './StepOutputUI'
import { _formatPreviewDate } from '../../../utils/_formatPreviewDate'
import { useSt } from '../../../front/FrontStateCtx'
import { InView } from 'react-intersection-observer'
import { Status } from '../../../back/Status'

export const StepListUI = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps
    return (
        <div className='flex flex-col flex-grow' style={{ overflow: 'auto' }}>
            {steps.map((step) => (
                <InView as='div' onChange={(inView, entry) => console.log('Inview:', inView)}>
                    <StepUI step={step} />
                </InView>
            ))}
        </div>
    )
})
export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <Panel
            collapsible
            defaultExpanded={step.data.status === Status.Running}
            header={
                <div className='flex justify-between text-xs text-gray-400'>
                    {/*  */}
                    <div>{step.tool.item.name}</div>
                    <div className='text-sm text-gray-400'>{_formatPreviewDate(new Date(step.createdAt))}</div>
                </div>
            }
        >
            <div className='flex flex-col gap-1'>
                {step.data.outputs?.map((output, ix) => <StepOutputUI key={ix} step={step} output={output} />)}
            </div>
        </Panel>
    )
})
