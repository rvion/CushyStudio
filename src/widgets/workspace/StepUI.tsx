import type { StepL } from 'src/models/Step'

import { observer, useLocalObservable } from 'mobx-react-lite'
import { Status } from '../../back/Status'
import { _formatPreviewDate } from '../../utils/_formatPreviewDate'
import { StepOutputUI } from './StepOutputUI'

export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    const uiSt = useLocalObservable(() => ({
        expanded: step.data.status === Status.Running,
    }))
    const header = (
        <div
            tw='cursor-pointer hover:bg-gray-900 py-2'
            onClick={() => (uiSt.expanded = !uiSt.expanded)}
            style={{ borderTop: '1px solid #2d2d2d' }}
            className='flex justify-between text-xs text-gray-400'
        >
            <b>{step.name}</b>
            <div className='text-xs pr-4 text-gray-400'>{_formatPreviewDate(new Date(step.createdAt))}</div>
        </div>
    )
    if (!uiSt.expanded) return header
    if (uiSt.expanded)
        return (
            <div>
                {header}
                <div className='flex flex-col-reverse gap-1'>
                    {step.data.outputs?.map((output, ix) => (
                        <StepOutputUI key={ix} step={step} output={output} />
                    ))}
                </div>
            </div>
        )
})
