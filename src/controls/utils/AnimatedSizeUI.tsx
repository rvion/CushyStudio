import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { useSizeOf } from './useSizeOf'

export const AnimatedSizeUI = observer(function AnimatedSizeUI_(p: { className?: string; children?: ReactNode }) {
    const { ref: refFn, size } = useSizeOf()

    return (
        <div className={p.className} tw='smooth-resize-container animated overflow-hidden' style={{ height: `${size.height}px` }}>
            <div className='smooth-resize-content' ref={refFn}>
                {p.children}
            </div>
        </div>
    )
})
