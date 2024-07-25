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
            }}
            tw={[
                //
                'w-full h-full',
                'pointer-events-auto justify-center z-50 absolute',
                'flex items-center',
            ]}
        >
            <div //
                style={{ backgroundColor: '#00000022' }}
                tw='absolute inset-0 animate-in fade-in'
            ></div>
            {children}
        </div>
    )
})
