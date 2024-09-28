import { observer } from 'mobx-react-lite'
import { ReactNode, useLayoutEffect, useRef, useState } from 'react'

import { Frame, type FrameProps } from '../../csuite/frame/Frame'
import { RevealUI } from '../../csuite/reveal/RevealUI'
import { useObservableRef } from '../../csuite/utils/useObservableRef'

type TabContent = ReactNode

export type TabBarProps = {
    children: TabContent[]
    className?: string
} & FrameProps

export const OverflowingRowUI = observer(function OverflowingRow({
    //
    children,
    className,
    ...rest
}: TabBarProps): ReactNode {
    const containerRef = useRef<HTMLDivElement>(null)
    const [extraIndex, setExtraIndex] = useState(0)
    const tabRefs = useRef<(HTMLDivElement | null)[]>([])
    const caretRef = useObservableRef<HTMLDivElement>(null)

    const handleReveal = (): void => {
        if (!containerRef.current) return console.log(`[🤠] ❌ no containerRef`)
        if (!caretRef.current) return console.log(`[🤠] ❌ no caretRef`)
        const containerRect = containerRef.current.getBoundingClientRect()
        const caretRect = caretRef.current.getBoundingClientRect()
        const adjustedContainerRight = containerRect.right - caretRect.width
        let index = -1
        for (const tabRef of tabRefs.current) {
            index++
            if (tabRef) {
                const tabRect = tabRef.getBoundingClientRect()
                if (tabRect.right > adjustedContainerRight) {
                    setExtraIndex(index)
                    break
                }
            }
            setExtraIndex(children.length)
        }
    }

    // ensure computation once caretRef is available
    useLayoutEffect(() => {
        if (caretRef.current == null) return
        handleReveal()
    }, [caretRef.current])

    const hiddenCount = children.length - extraIndex
    return (
        <Frame //
            ref={containerRef}
            tw='flex relative'
            className={className}
            {...rest}
            style={{ overflow: 'hidden', position: 'relative' }}
        >
            {children.map((tab, index) => (
                <div key={index} ref={(el) => void (tabRefs.current[index] = el)} style={{ flexShrink: 0 }}>
                    {tab}
                </div>
            ))}
            <RevealUI
                sharedAnchorRef={caretRef}
                content={() => (
                    <div>
                        <div>
                            {extraIndex}...{children.length}
                        </div>
                        {children.slice(extraIndex).map((tab, index) => (
                            <div key={index}>{tab}</div>
                        ))}
                    </div>
                )}
            >
                <Frame
                    tw={[
                        //
                        'absolute right-0 px-2',
                        // hiddenCount === 0 ? 'hidden' : 'visible',
                    ]}
                    className='caret'
                    ref={caretRef}
                    style={{ cursor: 'pointer', flexShrink: 0 }}
                    onClick={handleReveal}
                >
                    ▼ {hiddenCount > 0 ? `+${hiddenCount}` : null}
                </Frame>
            </RevealUI>
        </Frame>
    )
})

export default OverflowingRowUI
