import type { CSSProperties, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { Fragment } from 'react/jsx-runtime'

import { computePlacement } from '../rsuite/reveal/RevealPlacement'
import { type Activity, activityManger } from './Activity'

export const ActivityStackUI = observer(function ActivityStackUI_(p: {}) {
    // useDemoActivity()
    return (
        <Fragment>
            {activityManger._stack.map((activity, ix) => (
                <ActivityContainerUI
                    stop={() => {
                        activity.onStop?.()
                        activityManger.stopCurrentActivity()
                    }}
                    key={activity.uid}
                    activity={activity}
                    ix={ix}
                >
                    <activity.UI //
                        activity={activity}
                        stop={() => activityManger.stopActivity(activity)}
                    />
                </ActivityContainerUI>
            ))}
        </Fragment>
    )
})

export const ActivityContainerUI = observer(function ActivityContainerUI_(p: {
    activity: Activity
    uid?: string
    ix?: number
    children: ReactNode
    stop: () => void
}) {
    const backdropzIndex = 1000 + 100 * (p.ix ?? 1)
    const activityZIndex = backdropzIndex + 1

    let pos: CSSProperties | undefined = undefined
    if (p.activity.event) {
        const target = p.activity.event.target
        if (target instanceof HTMLElement) {
            pos = computePlacement(p.activity.placement ?? 'popup-lg', target.getBoundingClientRect())
        }
    }
    return (
        <div
            tabIndex={-1}
            className='_InputBlockerUI'
            tw='absolute inset-0 h-full w-full pointer-events-auto'
            // onAuxClick={(ev) => ev.stopPropagation()}
            // onClick={(ev) => ev.stopPropagation()}
            // onMouseDown={(ev) => ev.stopPropagation()}
            // onMouseEnter={(ev) => ev.stopPropagation()}
            // onMouseLeave={(ev) => ev.stopPropagation()}
            onKeyUp={(ev) => {
                if (ev.key === 'Escape') {
                    console.log('Escape key pressed')
                    p.stop?.()
                }
            }}
        >
            <div tw='relative w-full h-full'>
                <div // backdrop
                    className='_InputBlockerUI-backdrop'
                    tw='absolute inset-0 bg-[#000000db]'
                    style={{ zIndex: backdropzIndex }}
                    onMouseUp={(ev) => {
                        console.log('backdrop clicked')
                        p.stop?.()
                    }}
                >
                    <div style={{ zIndex: -1 }} tw='absolute inset-0 z'></div>
                </div>

                <div // activity area
                    tw='absolute inset-0'
                    style={{ zIndex: activityZIndex, ...pos }}
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
