import type { RevealState } from './RevealState'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const RevealBackdropUI = observer(function RevealBackdropUI_({
    reveal,
    children,
}: {
    reveal: RevealState
    children?: ReactNode
}) {
    return (
        <div // backdrop (full-screen)
            onClick={(ev) => reveal.onBackdropClick(ev)}
            style={{ zIndex: 99999999 }}
            tw={[
                //
                'absolute inset-0',
                'pointer-events-auto justify-center z-50',
                'flex items-center',
            ]}
        >
            <div // backdrop shadow (child div to avoid animation interference)
                style={{ backgroundColor: reveal.backdropColor }}
                tw='absolute inset-0 animate-in fade-in'
            />
            {children}
        </div>
    )
})
