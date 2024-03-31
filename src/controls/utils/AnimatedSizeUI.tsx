import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { useSizeOf } from './useSizeOf'

export const AnimatedSizeUI = observer(function AnimatedSizeUI_(p: { className?: string; children?: ReactNode }) {
    const { ref: refFn, size } = useSizeOf()

    return (
        <div className={p.className} tw='animated overflow-hidden' style={{ height: `${size.height}px` }}>
            <div ref={refFn}>{p.children}</div>
        </div>
    )
})
