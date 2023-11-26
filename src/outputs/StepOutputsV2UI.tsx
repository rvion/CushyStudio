import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'
import { _formatPreviewDate } from '../utils/formatters/_formatPreviewDate'
import { OutputPreviewUI, OutputUI } from './OutputUI'

export const StepOutputsV2UI = observer(function StepOutputsV2UI_(p: { step: StepL }) {
    const step = p.step
    // const isExpanded = step.expanded
    // if (!isExpanded) return <StepOutputsHeaderV2UI className='py-2' step={step} />
    // if (isExpanded)
    return (
        <div tw='flex'>
            <StepOutputsHeaderV2UI className='py-2' step={step} />
            {step.data.outputs?.map((output, ix) => (
                <OutputPreviewUI key={ix} step={step} output={output} />
            ))}
        </div>
    )
})

const StepOutputsHeaderV2UI = observer(function StepOutputsV1HeaderUI_(p: { step: StepL; className?: string }) {
    const step = p.step
    return (
        <div
            tw={[
                //
                'virtualBorder',
                'cursor-pointer justify-between text-xs text-gray-400 hover:bg-base-200',
                p.className,
            ]}
            onClick={() => (step.expanded = !step.expanded)}
            style={{ borderTop: '1px solid #2d2d2d' }}
        >
            {/* <b>{step.name}</b> */}
            <div className='text-xs pr-4 opacity-50'>{_formatPreviewDate(new Date(step.createdAt))}</div>
        </div>
    )
})
