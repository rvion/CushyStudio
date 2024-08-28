import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { useSizeOf } from './useSizeOf'

/**
 * this widget allow to make size transition smooth
 * there might be better ways to do that;
 * I did that pretty naively, but it seems to be working
 */
export const AnimatedSizeUI = observer(function AnimatedSizeUI_(p: { className?: string; children?: ReactNode }) {
    const { ref: refFn, size } = useSizeOf()

    return (
        <div
            className={p.className}
            tw={[
                //
                'smooth-resize-container animated',
                // 'overflow-hidden',
                'overflow-y-hidden',
            ]}
            style={{ height: `${size.height}px` }}
        >
            <div className='smooth-resize-content' ref={refFn}>
                {p.children}
            </div>
        </div>
    )
})
