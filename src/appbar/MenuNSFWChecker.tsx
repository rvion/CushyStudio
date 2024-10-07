import { observer } from 'mobx-react-lite'

import { MessageInfoUI } from '../csuite/messages/MessageInfoUI'
import { MessageWarningUI } from '../csuite/messages/MessageWarningUI'
import { useSt } from '../state/stateContext'
import { Button } from '../csuite/button/Button'

export const MenuNSFWCheckerUI = observer(function MenuNSFWCheckerUI_(p: {}) {
    const pj = useSt().project
    return (
        <Button //
            tooltip={pj.filterNSFW ? 'NSFW Filter Enabled' : 'NSFW Filter Disabled'}
            borderless
            subtle
            square
            onClick={() => (pj.filterNSFW = !pj.filterNSFW)}
        >
            {pj.filterNSFW ? '😇' : '😈'}
        </Button>
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
