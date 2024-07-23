import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

import { global_RevealStack } from '../RevealStack'

export const ShellPortal = observer(function ShellPortal_(p: RevealShellProps) {
    const uist = p.reveal
    return (
        <div // backdrop
            ref={(e) => {
                // ⁉️ why is this here
                if (e == null) {
                    const ix = global_RevealStack.indexOf(uist)
                    if (ix >= 0) return global_RevealStack.splice(ix, 1)
                }
                global_RevealStack.push(uist)
            }}
            onKeyUp={(ev) => {
                if (ev.key === 'Escape') {
                    uist.close()
                    ev.stopPropagation()
                    ev.preventDefault()
                }
            }}
            onClick={(ev) => {
                uist.p.onClick?.(ev)
                uist.close()
                ev.stopPropagation()
                ev.preventDefault()
            }}
            style={{ zIndex: 99999999, backgroundColor: '#0000003d' }}
            tw='pointer-events-auto w-full h-full flex items-center justify-center z-50'
        >
            {p.children}
        </div>
    )
})
