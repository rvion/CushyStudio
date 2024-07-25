import type { RevealState } from './RevealState'

import { observer } from 'mobx-react-lite'
import { type ReactNode } from 'react'

import { global_RevealStack } from './RevealStack'

export const RevealBackdropUI = observer(function RevealBackdropUI_({
    reveal,
    children,
}: {
    reveal: RevealState
    children?: ReactNode
}) {
    return (
        <div
            ref={(e) => {
                // ⁉️ why is this here
                if (e == null) {
                    const ix = global_RevealStack.indexOf(reveal)
                    if (ix >= 0) return global_RevealStack.splice(ix, 1)
                }
                global_RevealStack.push(reveal)
            }}
            onClick={(ev) => {
                reveal.onBackdropClick(ev)
            }}
            style={{ zIndex: 99999999, backgroundColor: '#ff000088' }}
            tw='pointer-events-auto w-full h-full flex items-center justify-center z-50 absolute'
        >
            {children}
        </div>
    )
})
