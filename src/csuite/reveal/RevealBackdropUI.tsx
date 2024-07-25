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
        <div
            onClick={(ev) => {
                reveal.onBackdropClick(ev)
            }}
            style={{
                zIndex: 99999999,
                backgroundColor: '#00000022',
            }}
            tw={[
                //
                'animate-in fade-in',
                'pointer-events-auto w-full h-full flex items-center justify-center z-50 absolute',
            ]}
        >
            {children}
        </div>
    )
})
