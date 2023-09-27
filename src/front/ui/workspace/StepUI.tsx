import type { StepL } from 'src/models/Step'

import { Panel } from 'rsuite'
import LazyLoad from 'react-lazyload'
import { observer } from 'mobx-react-lite'
import { StepOutputUI } from './StepOutputUI'
import { _formatPreviewDate } from '../../../utils/_formatPreviewDate'
import { useSt } from '../../../front/FrontStateCtx'

export const StepListUI = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps
    return (
        <div className='flex flex-col-reverse gap-2 flex-grow' style={{ overflow: 'auto' }}>
            {steps.map((step) => (
                <StepUI step={step} />
            ))}
        </div>
    )
})
export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <LazyLoad>
            <Panel
                header={
                    <div className='flex justify-between'>
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
        </LazyLoad>
    )
})
