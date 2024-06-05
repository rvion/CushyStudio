import type { IconName } from '../../csuite/icons/icons'
import type { DraftL } from '../../models/Draft'

import { observer } from 'mobx-react-lite'

import { InputNumberUI } from '../../controls/widgets/number/InputNumberUI'
import { Button } from '../../csuite/button/Button'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { knownOKLCHHues } from '../../csuite/tinyCSS/knownHues'

export const RunOrAutorunUI = observer(function RunOrAutorunUI_(p: { className?: string; draft: DraftL }) {
    const draft = p.draft
    const icon: IconName = draft.shouldAutoStart ? 'mdiPause' : 'mdiPlay'
    return (
        <div tw='flex gap-1' className={p.className}>
            <RevealUI
                content={() => (
                    <div tw='p-2'>
                        <div>ms to wait after a change</div>
                        <InputNumberUI
                            //
                            mode='int'
                            value={draft.st.project.data.autostartDelay}
                            onValueChange={(value) => draft.st.project.update({ autostartDelay: value })}
                            className='cushy-basic-input'
                            placeholder='ms'
                            softMax={5000}
                            hideSlider
                            step={250}
                            min={0}
                        />
                        <div>max ms to wait before running anyway</div>
                        <InputNumberUI
                            //
                            mode='int'
                            value={draft.st.project.data.autostartMaxDelay}
                            onValueChange={(val) => {
                                draft.st.project.update({ autostartMaxDelay: val })
                            }}
                            className='cushy-basic-input'
                            placeholder='ms'
                            softMax={5000}
                            hideSlider
                            step={250}
                            min={0}
                        />
                    </div>
                )}
            >
                <Button size='sm' icon='mdiTimer'>
                    timer
                </Button>
            </RevealUI>
            <Button
                icon='mdiRepeat'
                size='sm'
                loading={draft.shouldAutoStart}
                active={draft.shouldAutoStart}
                onClick={() => draft.setAutostart(!draft.shouldAutoStart)}
            >
                Autorun
            </Button>
            <Button
                base={{ hue: knownOKLCHHues.success }}
                look='primary'
                size='sm'
                expand
                className='self-start'
                icon={icon}
                onClick={() => {
                    draft.st.layout.FOCUS_OR_CREATE('Output', {}, 'RIGHT_PANE_TABSET')
                    draft.setAutostart(false)
                    draft.start({})
                }}
            >
                Run
            </Button>
        </div>
    )
})
