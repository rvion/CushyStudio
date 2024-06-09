import { observer } from 'mobx-react-lite'

import { Status } from '../../back/Status'
import { useSt } from '../../state/stateContext'
import { StepCardUI } from '../Panel_Steps/StepCardUI'

export const PanelOutput_OutputListHeaderUI = observer(function PanelOutput_OutputListHeaderUI_(p: {}) {
    const st = useSt()
    const step = st.focusedStepL
    const size = st.historySizeStr
    return (
        <div tw={'flex flex-wrap gap-0.5 p-1 overflow-auto flex-shrink-0  items-center max-h-[50%]'}>
            {/* <RevealUI
                tw='self-start'
                content={() => (
                    <div tw='flex flex-col gap-1 p-2 shadow-xl'>
                        <FieldAndLabelUI label='Output Preview Size (px)'>
                            <InputNumberUI
                                style={{ width: '5rem' }}
                                mode={'int'}
                                min={32}
                                max={200}
                                onValueChange={(next) => (st.historySize = next)}
                                value={st.historySize}
                            />
                        </FieldAndLabelUI>
                        <FieldAndLabelUI label='Latent Size (%)'>
                            <InputNumberUI
                                style={{ width: '5rem' }}
                                mode={'int'}
                                min={3}
                                max={100}
                                onValueChange={(next) => (st.latentSize = next)}
                                value={st.latentSize}
                            />
                        </FieldAndLabelUI>
                    </div>
                )}
            >
                <Button icon='mdiEyeSettings' style={{ width: size, height: size, lineHeight: size }}></Button>
            </RevealUI> */}
            {step?.finalStatus === Status.Running && (
                <div tw='btn btn-sm btn-outline' onClick={() => st.stopCurrentPrompt()}>
                    STOP
                </div>
            )}
            {step && <StepCardUI step={step} />}
            {/* {step?.outputs?.map((output, ix) => <OutputPreviewUI key={ix} step={step} output={output} />)} */}
        </div>
    )
})
