import type { StepL } from '../models/Step'

import { observer } from 'mobx-react-lite'

import { _formatPreviewDate } from '../utils/formatters/_formatPreviewDate'
import { OutputPreviewUI } from './OutputUI'
import { StepOutputsHeaderV2UI } from './StepOutputsV2UI'

export const StepOutputsV1UI = observer(function StepOutputsV1UI_(p: { step: StepL }) {
    const st = cushy
    const step = p.step
    const showSingle = st.__TEMPT__maxStepsToShow == 1
    const isExpanded = step.expanded || showSingle
    if (!isExpanded) return <StepOutputsHeaderV1UI tw='border-b-2 border-b-base-300' className='py-1.5' step={step} />
    if (isExpanded)
        return (
            <div tw='border-b-2 border-b-base-300'>
                {showSingle ? <></> : <StepOutputsHeaderV1UI className='py-1.5' step={step} />}
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
                '',
                'flex items-center px-1',
                'cursor-pointer text-xs text-opacity-50 hover:brightness-125 text-shadow',
                p.className,
            ]}
            onClick={() => (step.expanded = !step.expanded)}
            onMouseDown={(ev) => {
                if (ev.button != 0) {
                    return
                }
            }}
            // style={{ borderTop: '1px solid #2d2d2d' }}
        >
            {/* <FoldIconUI val={step.expanded} /> */}
            <span className='material-symbols-outlined'>{!step.expanded ? 'chevron_right' : 'expand_more'}</span>
            <div tw='truncate'>{step.name ?? step.name}</div>
            <div tw='flex-grow'></div>
            <div className='text-xs opacity-50 truncate'>{_formatPreviewDate(new Date(step.createdAt))}</div>
        </div>
    )
})

export const StepOutputsBodyV1UI = observer(function StepBodyUI_(p: { step: StepL }) {
    const step = p.step
    return (
        <div className='flex flex-wrap bg-base-300'>
            {step && <StepOutputsHeaderV2UI step={step} />}
            {step.outputs?.map((output, ix) => <OutputPreviewUI key={ix} step={step} output={output} />)}
        </div>
    )
})
