import type { StepL } from '../../models/Step'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { statusUI } from '../../back/statusUI'
import { AppIllustrationUI } from '../../cards/fancycard/AppIllustrationUI'
import { DraftIllustrationUI } from '../../cards/fancycard/DraftIllustration'
import { SpacerUI } from '../../controls/widgets/spacer/SpacerUI'
import { _formatPreviewDate } from '../../csuite/formatters/_formatPreviewDate'
import { Frame } from '../../csuite/frame/Frame'
import { OutputPreviewUI } from '../../outputs/OutputUI'
import { useSt } from '../../state/stateContext'
import { PanelStepsConf } from './Panel_StepsConf'

export const StepCardUI = observer(function StepOutputsV1HeaderUI_(p: {
    // Data ---------------------
    step: StepL

    // Style --------------------
    className?: string
    style?: CSSProperties

    // Slots --------------------
    showTitle?: boolean /**         default: true */
    showApp?: boolean /**           default: true */
    showDraft?: boolean /**         default: true */
    showStatus?: boolean /**        default: true */
    showOutputs?: boolean /**       default: true */
    showExecutionTime?: boolean /** default: true */
    showDate?: boolean /**          default: true */

    // Sizes --------------------
    appSize?: number
    outputSize?: number
}) {
    const conf = PanelStepsConf
    const st = useSt()
    const step = p.step
    const isSelected = st.focusedStepL === step
    const appSize = conf.value.appSize ? `${conf.value.appSize}rem` : '2rem'
    const outputSize = conf.value.outputSize ? `${conf.value.outputSize}rem` : '2rem'

    const showTitle = p.showTitle ?? conf.value.show.title
    const showApp = p.showApp ?? conf.value.show.app
    const showDraft = p.showDraft ?? conf.value.show.draft
    const showStatus = p.showStatus ?? conf.value.show.status
    const showOutputs = p.showOutputs ?? conf.value.show.outputs
    const showExecutionTime = p.showExecutionTime ?? conf.value.show.executionTime
    const showDate = p.showDate ?? conf.value.show.date

    return (
        <Frame
            border={10}
            base={10}
            tw={['relative oerflowv-hidden', 'cursor-pointer justify-between', p.className]}
            onClick={() => (st.focusedStepID = step.id)}
            style={p.style}
        >
            <div className='flex gap-1 minh-input'>
                {/* 1. NAME --------------------------------------------------------------- */}
                {showTitle && <div>{step.name}</div>}

                <SpacerUI />

                {/* 3. CREATED_AT --------------------------------------------------------------- */}
                {showDate && <div className='truncate'>{_formatPreviewDate(new Date(step.createdAt))}</div>}

                {/* 5. STATUS --------------------------------------------------------------- */}
                {showStatus && <div>{statusUI(p.step.finalStatus)}</div>}
            </div>

            <div tw='flex gap-1'>
                {/* 2. APP --------------------------------------------------------------- */}
                {showApp && (
                    <div
                        tw={['cursor-pointer', isSelected ? 'border-2 border-primary' : '']}
                        style={{
                            // 🔴
                            outline: isSelected ? '4px solid white' : undefined,
                            width: appSize,
                            height: appSize,
                            flexShrink: 0,
                        }}
                    >
                        {step.app ? (
                            <AppIllustrationUI tw='opacity-40 hover:opacity-100' size={appSize} app={step.app} />
                        ) : (
                            <div style={{ width: appSize, height: appSize }}>❓</div>
                        )}
                    </div>
                )}

                {/* 4. DRAFT --------------------------------------------------------------- */}
                {showDraft &&
                    (step.draft ? (
                        <div>
                            {/*  */}
                            <DraftIllustrationUI draft={step.draft} size={appSize} />
                            {/* draft: {step.draft?.name ?? '❓'} */}
                        </div>
                    ) : (
                        <div style={{ width: appSize, height: appSize }}>❓</div>
                    ))}
            </div>

            {/* 6. OUTPUTS --------------------------------------------------------------- */}
            {showOutputs && (
                <div>
                    outputs:
                    <div tw='flex'>
                        {step?.outputs?.map((output, ix) => (
                            <OutputPreviewUI //
                                key={ix}
                                step={step}
                                // size={outputSize}
                                output={output}
                            />
                        ))}
                    </div>
                </div>
            )}
        </Frame>
    )
})
