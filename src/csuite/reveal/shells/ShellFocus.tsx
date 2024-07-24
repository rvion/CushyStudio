import type { RevealShellProps } from './ShellProps'

import { observer } from 'mobx-react-lite'

import { global_RevealStack } from '../RevealStack'

export const ShellFocus = observer(function ShellFocus_({ reveal, children }: RevealShellProps) {
    return (
        <div // backdrop
            ref={(e) => {
                // ⁉️ why is this here
                if (e == null) {
                    const ix = global_RevealStack.indexOf(reveal)
                    if (ix >= 0) return global_RevealStack.splice(ix, 1)
                }
                global_RevealStack.push(reveal)
            }}
            onClick={reveal.onBackdropClick}
            style={{ zIndex: 99999999, backgroundColor: '#0000003d' }}
            tw='pointer-events-auto w-full h-full flex items-center justify-center z-50'
        >
            {children}
        </div>
    )
})
