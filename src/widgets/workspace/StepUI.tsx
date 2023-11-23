import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { _formatPreviewDate } from '../../utils/formatters/_formatPreviewDate'
import { StepOutputUI } from './StepOutputUI'

export const StepUI = observer(function StepUI_(p: { step: StepL }) {
    const step = p.step
    const isExpanded = step.expanded
    if (!isExpanded) return <StepHeaderUI className='py-2' step={step} />
    if (isExpanded)
        return (
            <div>
                <StepHeaderUI className='py-2' step={step} />
                <StepBodyUI step={step} />
            </div>
        )
})

export const StepHeaderUI = observer(function StepHeaderUI_(p: { step: StepL; className?: string }) {
    const step = p.step
    return (
        <div
            tw={['cursor-pointer justify-between text-xs text-gray-400 hover:bg-base-200', p.className]}
            onClick={() => (step.expanded = !step.expanded)}
            style={{ borderTop: '1px solid #2d2d2d' }}
        >
            <b>{step.name}</b>
            <div className='text-xs pr-4 opacity-50'>{_formatPreviewDate(new Date(step.createdAt))}</div>
        </div>
    )
})

export const StepBodyUI = observer(function StepBodyUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <div className='flex flex-col-reverse gap-1'>
            {step.data.outputs?.map((output, ix) => (
                <StepOutputUI key={ix} step={step} output={output} />
            ))}
        </div>
    )
})
