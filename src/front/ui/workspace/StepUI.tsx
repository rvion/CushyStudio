import type { StepL } from 'src/models/Step'

import { Panel } from 'rsuite'
import { observer } from 'mobx-react-lite'
import { StepOutputUI } from './StepOutputUI'
import { _formatPreviewDate } from '../../../utils/_formatPreviewDate'
import { useSt } from '../../../front/FrontStateCtx'
import { InView } from 'react-intersection-observer'
import { Status } from '../../../back/Status'
import { GraphPreviewUI } from '../MsgShowHTMLUI'

export const StepListUI = observer(function StepListUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps
    const lastGraph = st.db.graphs.last()
    return (
        <div className='flex flex-col' style={{ borderLeft: '1px solid #2d2d2d' }}>
            {/* <Panel className='nobg' header='Last Graph' collapsible defaultExpanded> */}
            {lastGraph && <GraphPreviewUI graph={lastGraph} />}
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
export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <Panel
            className='nobg'
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
