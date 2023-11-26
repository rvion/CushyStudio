import { observer } from 'mobx-react-lite'
import { AppIllustrationUI } from 'src/cards/fancycard/AppIllustrationUI'
import { OutputPreviewUI } from 'src/outputs/OutputUI'
import { Dropdown } from 'src/rsuite/Dropdown'
import { InputNumberUI } from 'src/rsuite/InputNumberUI'
import { Slider } from 'src/rsuite/shims'
import { parseFloatNoRoundingErr } from 'src/utils/misc/parseFloatNoRoundingErr'
import { FieldAndLabelUI } from 'src/widgets/misc/FieldAndLabelUI'
import { useSt } from '../state/stateContext'
import { Panel_ViewImage } from './Panel_ViewImage'
import { RevealUI } from 'src/rsuite/RevealUI'

export const Panel_Output = observer(function Panel_Output_(p: {}) {
    const st = useSt()
    const steps = st.db.steps.values.slice(-st.__TEMPT__maxStepsToShow).reverse()
    const step = st.db.steps.last()
    const mode: 'H' | 'V' = 1 - 1 == 0 ? 'V' : 'H'
    const dir = mode === 'H' ? 'flex-col' : 'flex-row'
    return (
        <div tw={[mode === 'H' ? 'flex-row' : 'flex-col', 'flex flex-grow h-full w-full']}>
            {/* HISTORY */}
            <div tw={[dir, 'flex gap-1 overflow-auto flex-shrink-0 bg-base-200']}>
                <RevealUI tw='self-start'>
                    <div tw='btn btn-sm btn-primary'>
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
                    {steps.map((step) => (
                        <div
                            tw='cursor-pointer'
                            onClick={() => (st.focusedStepID = step.id)}
                            style={{
                                width: st.historySizeStr,
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
                    ))}
                </div>
            </div>

            {/* OUTPUTS */}
            <div tw={[dir, 'flex gap-1 bg-base-200']}>
                <Dropdown
                    //
                    title=''
                    startIcon={<span className='material-symbols-outlined'>present_to_all</span>}
                >
                    <div>
                        <FieldAndLabelUI label='Size'>
                            <Slider
                                style={{ width: '5rem' }}
                                min={32}
                                max={200}
                                onChange={(ev) => (st.outputPreviewSize = parseFloatNoRoundingErr(ev.target.value))}
                                value={st.outputPreviewSize}
                            />
                        </FieldAndLabelUI>
                    </div>
                </Dropdown>
                <div tw={[dir, 'flex gap-1 overflow-auto']}>
                    {step?.data.outputs?.map((output, ix) => (
                        <OutputPreviewUI key={ix} step={step} output={output} />
                    ))}
                </div>
            </div>

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
