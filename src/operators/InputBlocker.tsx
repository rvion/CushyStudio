import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const InputBlockerUI = observer(function InputBlockerUI_(p: {
    uid?: string
    ix?: number
    children: ReactNode
    stop: () => void
}) {
    const backdropzIndex = 1000 + 100 * (p.ix ?? 1)
    const activityZIndex = backdropzIndex + 1
    return (
        <div
            tabIndex={-1}
            className='_InputBlockerUI'
            tw='absolute inset-0 h-full w-full pointer-events-auto'
            onKeyUp={(ev) => {
                if (ev.key === 'Escape') {
                    console.log('Escape key pressed')
                    p.stop?.()
                }
            }}
        >
            {/*
            <div // debug
            >
                {p.uid}
            </div>
             */}

            <div tw='relative w-full h-full'>
                <div // backdrop
                    className='_InputBlockerUI-backdrop'
                    tw='absolute inset-0 pointer-events-none bg-[#000000db]'
                    style={{ zIndex: backdropzIndex }}
                >
                    <div style={{ zIndex: -1 }} tw='absolute inset-0 z'></div>
                </div>
                <div // activity
                    tw='absolute inset-0'
                    style={{ zIndex: activityZIndex }}
                    className='_InputBlockerUI-activity-container'
                    onClick={(ev) => {
                        console.log('activity backref clicked')
                        if (ev.target === ev.currentTarget) p.stop?.()
                    }}
                >
                    {p.children}
                </div>
            </div>
        </div>
    )
})
