import { runInAction } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { ReactNode } from 'react'

export const AnimatedSizeUI = observer(function AnimatedSizeUI_(p: { className?: string; children?: ReactNode }) {
    const size = useLocalObservable(() => ({
        observer: new ResizeObserver((e, obs) => {
            runInAction(() => {
                const width = e[0].contentRect.width
                const height = e[0].contentRect.height
                size.width = width
                size.height = height
            })
        }),
        width: undefined as Maybe<number>,
        height: undefined as Maybe<number>,
    }))
    const ro = size.observer

    return (
        <div className={p.className} tw='animated overflow-hidden' style={{ height: `${size.height}px` }}>
            <div
                ref={(e) => {
                    if (e == null) return ro.disconnect()
                    ro.observe(e)
                }}
            >
                {p.children}
            </div>
        </div>
    )
})
