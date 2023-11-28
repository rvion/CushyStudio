import { observer } from 'mobx-react-lite'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { OutputPreviewUI } from 'src/outputs/OutputUI'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { RevealUI } from 'src/rsuite/RevealUI'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'
import { useSt } from '../state/stateContext'
import { Panel_ViewImage } from './Panel_ViewImage'

const mode: 'H' | 'V' = 1 - 1 == 0 ? 'V' : 'H'
const dir = mode === 'H' ? 'flex-col' : 'flex-row'

export const Panel_Output = observer(function Panel_Output_(p: {}) {
    const st = useSt()
    return (
        <div
            tw={[
                //
                mode === 'H' ? 'flex-row' : 'flex-col',
                'flex flex-grow h-full w-full gap-0.5',
            ]}
        >
            {/* <MainOutputHistoryUI /> */}
            <MainOutputItemsUI />
            <Panel_ViewImage />
        </div>
    )
})

// export const Panel_LastStep = observer(function StepListUI_(p: {}) {
//     const st = useSt()
//     const lastStep = st.db.steps.last()
//     if (lastStep == null) return null
//     return (
//         <div className='flex flex-col'>
//             {/* <StepHeaderUI step={lastStep} /> */}
//             <StepBodyUI step={lastStep} />
//         </div>
//     )
// })

export const MainOutputItemsUI = observer(function MainOutputItemsUI_(p: {}) {
    const st = useSt()
    const selectedStep = st.focusedStepL
    const size = st.outputPreviewSizeStr
    return (
        <div tw={[dir, 'flex gap-0.5 overflow-auto flex-shrink-0 bg-base-200 items-center']}>
            <RevealUI tw='self-start' disableHover>
                <div style={{ width: size, height: size, lineHeight: size }} tw='btn h-full'>
                    <span className='material-symbols-outlined'>settings</span>
                </div>
                <div tw='flex flex-col gap-1'>
                    <div tw='flex items-center'>
                        <InputNumberUI
                            style={{ width: '5rem' }}
                            mode={'int'}
                            min={32}
                            max={200}
                            onValueChange={(next) => (st.outputPreviewSize = next)}
                            value={st.outputPreviewSize}
                        />
                        px Output Preview Size
                    </div>
                    <div tw='flex items-center'>
                        <InputNumberUI
                            style={{ width: '5rem' }}
                            mode={'int'}
                            min={3}
                            max={100}
                            onValueChange={(next) => (st.latentSize = next)}
                            value={st.latentSize}
                        />
                        % Latent Size
                    </div>
                </div>
            </RevealUI>
            <div tw={[dir, 'flex flex-grow gap-1 overflow-auto']}>
                {selectedStep?.data.outputs?.map((output, ix) => (
                    <OutputPreviewUI key={ix} step={selectedStep} output={output} />
                ))}
            </div>
        </div>
    )
})

export const MainOutputHistoryUI = observer(function MainOutputHistoryUI_(p: {}) {
    const st = useSt()
    const steps = st.db.steps.values.slice(-st.__TEMPT__maxStepsToShow).reverse()
    const selectedStep = st.focusedStepL
    const size = st.historySizeStr
    return (
        <div tw={[dir, 'flex gap-0.5 overflow-auto flex-shrink-0 bg-base-200 items-center']}>
            <RevealUI disableHover>
                <div style={{ width: size, height: size, lineHeight: size }} tw='btn-accent btn h-full'>
                    <span className='material-symbols-outlined'>history</span>
                </div>
                <div>
                    <FieldAndLabelUI label='Size'>
                        <InputNumberUI
                            style={{ width: '5rem' }}
                            mode={'int'}
                            min={32}
                            max={200}
                            onValueChange={(next) => (st.historySize = next)}
                            value={st.historySize}
                        />
                    </FieldAndLabelUI>
                </div>
            </RevealUI>
            <div tw={[dir, 'flex gap-1 overflow-auto']}>
                {steps.map((step) => {
                    const selected = selectedStep === step
                    return (
                        <div
                            tw={['cursor-pointer', selectedStep === step ? 'border-2 border-primary' : '']}
                            onClick={() => (st.focusedStepID = step.id)}
                            style={{
                                // 🔴
                                border: selected ? '4px solid white' : undefined,
                                width: size,
                                height: st.historySizeStr,
                                flexShrink: 0,
                            }}
                        >
                            {step.appFile ? (
                                <AppIllustrationUI size={st.historySizeStr} card={step.appFile} />
                            ) : (
                                <div style={{ width: st.historySizeStr, height: st.historySizeStr }}></div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
})
