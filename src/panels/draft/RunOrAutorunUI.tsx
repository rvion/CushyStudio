import type { DraftL } from 'src/models/Draft'

import { observer } from 'mobx-react-lite'
import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Button } from 'src/rsuite/shims'

export const RunOrAutorunUI = observer(function RunOrAutorunUI_(p: { className?: string; draft: DraftL }) {
    const draft = p.draft
    const icon = draft.shouldAutoStart ? 'pause' : 'play_arrow'
    return (
        <div tw='flex join virtualBorder' className={p.className}>
            <RevealUI disableHover>
                <div tw='btn btn-sm btn-square'>
                    <span className='material-symbols-outlined'>timer</span>
                </div>

                <div tw='p-2'>
                    <div>ms to wait after a change</div>
                    <input
                        //
                        value={draft.st.project.data.autostartDelay}
                        onChange={(ev) => {
                            const val = parseInt(ev.target.value)
                            if (Number.isNaN(val)) return
                            draft.st.project.update({ autostartDelay: val })
                        }}
                        tw='input input-bordered input-sm'
                        type='number'
                        placeholder='ms'
                    />
                    <div>max ms to wait before running anyway</div>
                    <input
                        //
                        value={draft.st.project.data.autostartMaxDelay}
                        onChange={(ev) => {
                            const val = parseInt(ev.target.value)
                            if (Number.isNaN(val)) return
                            draft.st.project.update({ autostartMaxDelay: val })
                        }}
                        tw='input input-bordered input-sm'
                        type='number'
                        placeholder='ms'
                    />
                </div>
            </RevealUI>
            <div
                tw={['btn btn-square btn-sm self-start join-item btn-neutral', draft.shouldAutoStart ? 'btn-active' : null]}
                // color={draft.shouldAutoStart ? 'green' : undefined}
                onClick={() => draft.setAutostart(!draft.shouldAutoStart)}
            >
                {draft.shouldAutoStart ? (
                    <div className='loading loading-spinner loading-sm' />
                ) : (
                    <span className='material-symbols-outlined'>repeat</span>
                )}
                {/* Auto */}
            </div>
            <Button
                tw='btn-sm join-item btn-primary'
                className='self-start'
                icon={<span className='material-symbols-outlined'>{icon}</span>}
                onClick={() => {
                    draft.st.layout.FOCUS_OR_CREATE('Output', {}, 'RIGHT_PANE_TABSET')
                    draft.setAutostart(false)
                    draft.start()
                }}
            >
                Run
            </Button>
        </div>
    )
})
