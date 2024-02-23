import type { StepL } from 'src/models/Step'

import { observer } from 'mobx-react-lite'

import { _formatPreviewDate } from '../utils/formatters/_formatPreviewDate'
import { OutputPreviewUI } from './OutputUI'
import { statusUI } from 'src/back/statusUI'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { useSt } from 'src/state/stateContext'

export const StepOutputsV2UI = observer(function StepOutputsV2UI_(p: { step: StepL }) {
    const step = p.step
    return (
        <div tw='flex flex-wrap'>
            <StepOutputsHeaderV2UI step={step} />
            {step.outputs?.map((output, ix) => (
                <OutputPreviewUI key={ix} step={step} output={output} />
            ))}
        </div>
    )
})

export const StepOutputsHeaderV2UI = observer(function StepOutputsV1HeaderUI_(p: { step: StepL; className?: string }) {
    const st = useSt()
    const selectedStep = st.focusedStepL
    const step = p.step
    const selected = selectedStep === step
    const size = st.historySizeStr
    return (
        <div
            tw={[
                //
                'virtualBorder relative overflow-hidden',
                'cursor-pointer justify-between text-xs text-gray-400 hover:bg-base-200',
                p.className,
            ]}
            // onClick={(ev) => {
            //     // step.expanded = !step.expanded
            //     ev.stopPropagation()
            //     ev.preventDefault()
            // }}
            onClick={() => (st.focusedStepID = step.id)}
            style={{ borderTop: '1px solid #2d2d2d' }}
        >
            {/* <b>{step.name}</b> */}
            <div
                tw={['cursor-pointer', selectedStep === step ? 'border-2 border-primary' : '']}
                style={{
                    // 🔴
                    outline: selected ? '4px solid white' : undefined,
                    width: size,
                    height: size,
                    flexShrink: 0,
                }}
            >
                {step.app ? (
                    <AppIllustrationUI tw='opacity-40 hover:opacity-100' size={size} app={step.app} />
                ) : (
                    <div
                        style={{
                            width: size,
                            height: size,
                        }}
                    >
                        ❓
                    </div>
                )}
            </div>
            {/* <div className='text-xs pr-4 whitespace-nowrap overflow-ellipsis opacity-90 bg-black text-white absolute bottom-0'>
                {_formatPreviewDate(new Date(step.createdAt))}
            </div> */}
            <div className='text-xs whitespace-nowrap overflow-ellipsis opacity-90 bg-black text-white absolute top-0 right-0'>
                {statusUI(p.step.finalStatus)}
                {/*  */}
            </div>
        </div>
    )
})
