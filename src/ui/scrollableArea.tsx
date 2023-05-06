import { observer, useLocalObservable } from 'mobx-react-lite'
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'

export const ScrollablePaneUI = observer(function ScrollablePaneUI_(p: { children: ReactNode; items: any[] }) {
    const uiVar = useMemo(() => ({ prevScrollTop: 0 }), [])
    const uiSt = useLocalObservable(() => ({ follow: true }))
    const ref = useRef<HTMLDivElement>(null)

    // scroll on new items
    useEffect(() => {
        if (!uiSt.follow) return
        if (ref.current == null) return
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' })
    }, [p.items.length])

    const onScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
            const tgt = ref.current
            if (tgt == null) return
            const isAtBottom = tgt.scrollHeight - tgt.scrollTop - tgt.clientHeight < 100
            if (tgt.scrollTop === uiVar.prevScrollTop) return
            const scrollDirection = tgt.scrollTop > uiVar.prevScrollTop ? 'down' : 'up'
            uiVar.prevScrollTop = tgt.scrollTop
            if (scrollDirection == 'up') {
                console.log('🔴 stop following')
                uiSt.follow = false
            } else if (isAtBottom) {
                console.log('🟢 start following')
                uiSt.follow = true
            }
        },
        [ref],
    )
    // useResizeObserver(ref, (entry) => onResize())
    // useEffect(() => {
    //     const timeout = setTimeout(() => {}, 1000)
    //     return () => clearTimeout(timeout)
    // })
    // const target = useRef(null)
    return (
        <>
            {/* {uiSt.follow ? '🟢' : '🔴'} */}
            <div className='relative scroll grow' ref={ref} onScrollCapture={onScroll}>
                <div className='absolute inset-0 col'>
                    {/*  */}
                    {p.children}
                </div>
            </div>
        </>
    )
})
