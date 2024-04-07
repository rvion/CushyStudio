import { observer } from 'mobx-react-lite'
import { type ReactNode } from 'react'

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
            tw='absolute inset-0 h-full w-full pointer-events-auto'
            onClick={() => {
                console.log('activity backref clicked')
                p.stop?.()
            }}
            onKeyUp={(ev) => {
                if (ev.key === 'Escape') {
                    console.log('Escape key pressed')
                    p.stop?.()
                }
            }}
        >
            <div // debug
            >
                {p.uid}
            </div>

            <div tw='relative w-full h-full'>
                <div // backdrop
                    tw='absolute inset-0 pointer-events-none'
                    style={{ background: '#000000db', zIndex: backdropzIndex }}
                >
                    <div style={{ zIndex: -1 }} tw='absolute inset-0 z'></div>
                </div>
                <div // activity
                    tw='absolute inset-0'
                    style={{ zIndex: activityZIndex }}
                >
                    {p.children}
                </div>
            </div>
        </div>
    )
})
