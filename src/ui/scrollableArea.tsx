import { observer, useLocalObservable } from 'mobx-react-lite'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

export const ScrollablePaneUI = observer(function ScrollablePaneUI_(p: { children: ReactNode }) {
    const uiVar = useMemo(() => ({ prevScrollTop: 0 }), [])
    const uiSt = useLocalObservable(() => ({ follow: true }))
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (uiSt.follow && ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight
            }
        }, 1000)
        return () => clearTimeout(timeout)
    })
    return (
        <>
            {uiSt.follow ? '🟢' : '🔴'}
            <div
                ref={ref}
                onScroll={(e) => {
                    const isAtBottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight
                    const scrollDirection = e.currentTarget.scrollTop > uiVar.prevScrollTop ? 'down' : 'up'
                    uiVar.prevScrollTop = e.currentTarget.scrollTop
                    if (scrollDirection == 'up') {
                        console.log('stop following')
                        uiSt.follow = false
                    } else if (isAtBottom) {
                        console.log('start following')
                        uiSt.follow = true
                    }
                }}
                className='relative scroll grow'
            >
                <div className='absolute inset-0 col'>
                    {/*  */}
                    {p.children}
                </div>
            </div>
        </>
    )
})
