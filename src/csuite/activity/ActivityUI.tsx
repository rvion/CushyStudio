import type { Activity } from './Activity'

import { observer } from 'mobx-react-lite'
import { type CSSProperties, type ReactNode } from 'react'
import { Fragment } from 'react/jsx-runtime'

import { ModalShellUI } from '../../csuite/modal/ModalShell'
import { computePlacement } from '../../csuite/reveal/RevealPlacement'
import { themeConf } from '../../state/conf/themeConf'
import { tooltipStuff } from '../frame/tooltip'
import { activityManager } from './ActivityManager'
import { useDelay } from './useDelay'

export const TooltipUI = observer(function TooltipUI_(p: {}) {
    const conf = themeConf.value.tooltipDelay

    const isDelayed = useDelay(conf, [tooltipStuff.tooltip, conf])
    const tooltip = tooltipStuff.tooltip

    if (isDelayed && conf != null) return null
    if (tooltip == null) return null
    const domRect = tooltip.ref.getBoundingClientRect()
    const pos = computePlacement('bottom', domRect)
    const txt = tooltip.text

    return (
        <div style={pos} tw='absolute rounded top-0 left-0 [z-index:99999]'>
            <div tw='bg-black mt-2 p-2'>
                {/* {isDelayed ? '🟢' : '❌'} */}
                <div>{txt}</div>
            </div>
            {/* {JSON.stringify(pos)} */}
        </div>
    )
})

export const ActivityStackUI = observer(function ActivityStackUI_(p: {}) {
    return (
        <Fragment>
            <TooltipUI />
            {activityManager._stack.map((activity, ix) => (
                <ActivityContainerUI
                    stop={() => {
                        activity.onStop?.()
                        activityManager.stopCurrentActivity()
                    }}
                    key={activity.uid}
                    activity={activity}
                    ix={ix}
                >
                    <activity.UI //
                        activity={activity}
                        stop={() => activityManager.stopActivity(activity)}
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
                >
                    <div style={{ zIndex: -1 }} tw='absolute inset-0 z'></div>
                </div>

                <div // activity area
                    tw='absolute inset-0'
                    style={{ zIndex: activityZIndex, ...pos }}
                    className='_InputBlockerUI-activity-container flex justify-center'
                    onMouseDown={(ev) => {
                        console.log('activity backref clicked')
                        if (ev.target === ev.currentTarget) p.stop?.()
                    }}
                >
                    {p.activity.shell === 'popup-lg' ? (
                        <ModalShellUI tw='max-w-lg w-fit h-fit m-8' close={() => p.stop()} title={p.activity.title}>
                            {p.children}
                        </ModalShellUI>
                    ) : p.activity.shell === 'popup-sm' ? (
                        <ModalShellUI tw='max-w-sm w-fit h-fit m-8' close={() => p.stop()} title={p.activity.title}>
                            {p.children}
                        </ModalShellUI>
                    ) : p.activity.shell === 'popup-full' ? (
                        <ModalShellUI tw='m-8' close={() => p.stop()} title={p.activity.title}>
                            {p.children}
                        </ModalShellUI>
                    ) : (
                        p.children
                    )}
                </div>
            </div>
        </div>
    )
})
