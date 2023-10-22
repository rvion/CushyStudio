import type { StepL } from 'src/models/Step'

import { Panel } from 'rsuite'
import { observer } from 'mobx-react-lite'
import { StepOutputUI } from './StepOutputUI'
import { _formatPreviewDate } from '../../../utils/_formatPreviewDate'
import { Status } from '../../../back/Status'

export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step

    return (
        <Panel
            className='nobg'
            collapsible
            defaultExpanded={step.data.status === Status.Running}
            header={
                <div style={{ borderTop: '1px solid #2d2d2d' }} className='flex justify-between text-xs text-gray-400 mt-2'>
                    <b>{step.name}</b>
                    <div className='text-xs pr-4 text-gray-400'>{_formatPreviewDate(new Date(step.createdAt))}</div>
                </div>
            }
        >
            <div className='flex flex-col-reverse gap-1'>
                {step.data.outputs?.map((output, ix) => <StepOutputUI key={ix} step={step} output={output} />)}
            </div>
        </Panel>
    )
})
