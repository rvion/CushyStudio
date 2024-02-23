import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'

import { _formatPreviewDate } from '../utils/formatters/_formatPreviewDate'
import { OutputPreviewUI } from './OutputUI'
import { StepOutputsHeaderV2UI } from './StepOutputsV2UI'
import { FoldIconUI } from 'src/cards/FoldIconUI'

export const StepOutputsV1UI = observer(function StepOutputsV1UI_(p: { step: StepL }) {
    const step = p.step
    const isExpanded = step.expanded
    if (!isExpanded) return <StepOutputsHeaderV1UI className='py-2' step={step} />
    if (isExpanded)
        return (
            <div>
                <StepOutputsHeaderV1UI className='py-2' step={step} />
                <StepOutputsBodyV1UI step={step} />
            </div>
        )
})

export const StepOutputsHeaderV1UI = observer(function StepOutputsV1HeaderUI_(p: { step: StepL; className?: string }) {
    const step = p.step
    return (
        <div
            tw={[
                //
                'bg-base-200',
                'flex items-center',
                'cursor-pointer text-xs text-opacity-50 hover:bg-base-200',
                p.className,
            ]}
            onClick={() => (step.expanded = !step.expanded)}
            style={{ borderTop: '1px solid #2d2d2d' }}
        >
            <FoldIconUI val={step.expanded} />
            <b>{step.name ?? step.name}</b>
            <div tw='flex-grow'></div>
            <div className='text-xs opacity-50'>{_formatPreviewDate(new Date(step.createdAt))}</div>
        </div>
    )
})

export const StepOutputsBodyV1UI = observer(function StepBodyUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <div className='flex flex-wrap'>
            {step && <StepOutputsHeaderV2UI step={step} />}
            {step.outputs?.map((output, ix) => (
                <OutputPreviewUI key={ix} step={step} output={output} />
            ))}
        </div>
    )
})
