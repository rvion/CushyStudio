import { observer } from 'mobx-react-lite'

import { MessageInfoUI } from '../csuite/messages/MessageInfoUI'
import { MessageWarningUI } from '../csuite/messages/MessageWarningUI'
import { RevealUI } from '../csuite/reveal/RevealUI'
import { SQLITE_false, SQLITE_true } from '../csuite/types/SQLITE_boolean'
import { useSt } from '../state/stateContext'

export const MenuNSFWCheckerUI = observer(function MenuNSFWCheckerUI_(p: {}) {
    const st = useSt()
    const pj = st.project
    const val = pj.filterNSFW
    return (
        <RevealUI trigger='hover' showDelay={0} content={() => <NSFWToggleUI />}>
            <label tw='swap swap-flip'>
                <input
                    type='checkbox'
                    checked={val}
                    onChange={(ev) => {
                        console.log(`[🧐] was`, val)
                        console.log(`[🧐] willbe`, val ? SQLITE_false : SQLITE_true)
                        pj.filterNSFW = !val
                    }}
                />
                <div tw='swap-on'>😇</div>
                <div tw='swap-off'>😈</div>
            </label>
        </RevealUI>
    )
})

export const NSFWToggleUI = observer(function NSFWToggleUI_(p: {}) {
    const val: boolean = cushy.project.filterNSFW
    return (
        <div tw='p-2'>
            {val ? (
                <MessageInfoUI>
                    <div tw='flex whitespace-nowrap gap-1'>
                        NSFW filter is currently
                        <b>ON</b>
                    </div>
                </MessageInfoUI>
            ) : (
                <MessageWarningUI>
                    <div tw='flex whitespace-nowrap gap-1'>
                        NSFW filter is currently
                        <b>OFF</b>
                    </div>
                </MessageWarningUI>
            )}
        </div>
    )
})
