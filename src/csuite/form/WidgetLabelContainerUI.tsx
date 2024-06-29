import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { Frame } from '../../csuite/frame/Frame'

export type WidgetLabelContainerProps = {
    //
    justify: boolean
    className?: string
    children: React.ReactNode
    tooltip?: string
}

export const WidgetLabelContainerUI = observer(function WidgetLabelContainerUI_(p: WidgetLabelContainerProps) {
    const csuite = useCSuite()
    return (
        <Frame
            tooltip={p.tooltip}
            tooltipPlacement='right'
            className={p.className}
            hover
            tw={[
                'COLLAPSE-PASSTHROUGH',
                'minh-input',
                // 'self-stretch',
                'flex', // gap-0.5
                'flex-none shrink-0',
                'items-center',
            ]}
            style={p.justify ? justifiedStyle : undefined}
            text={csuite.labelText}
        >
            {p.children}
        </Frame>
    )
})

const justifiedStyle: CSSProperties = {
    minWidth: '8rem', // 🔴 move to theme options
    maxWidth: '20rem', // 🔴 move to theme options
    width: '35%', // 🔴 move to theme options
    justifyContent: 'flex-start',
}
