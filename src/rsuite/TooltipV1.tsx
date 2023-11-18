import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useRef, useState } from 'react'

class TooltipState {
    visible = false
    constructor() {
        makeAutoObservable(this)
    }
    show = () => (this.visible = true)
    hide = () => (this.visible = false)
}

export const WithTooltip = observer(function Tooltip_(p: { children: [React.ReactNode, React.ReactNode] }) {
    const tooltipState = useState(() => new TooltipState())[0]
    const ref = useRef<HTMLDivElement>(null)
    return (
        <span
            //
            ref={ref}
            onMouseEnter={() => tooltipState.show()}
            onMouseLeave={() => tooltipState.hide()}
        >
            {p.children[0]}
            {tooltipState.visible && (
                <div
                    tw='bg-base-100'
                    style={{
                        position: 'absolute',
                        // bottom: '100%',
                        // left: '50%',
                        // transform: 'translateX(-50%)',
                        zIndex: 99999999,
                    }}
                >
                    {p.children[1]}
                </div>
            )}
        </span>
    )
})
