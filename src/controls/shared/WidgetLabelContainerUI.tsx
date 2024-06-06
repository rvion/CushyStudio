import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../csuite/ctx/useCSuite'
import { Frame } from '../../csuite/frame/Frame'

export type WidgetLabelContainerProps = {
    //
    justify: boolean
    className?: string
    children: React.ReactNode
}

export const WidgetLabelContainerUI = observer(function WidgetLabelContainerUI_(p: WidgetLabelContainerProps) {
    const csuite = useCSuite()
    return (
        <Frame
            hover
            tw='COLLAPSE-PASSTHROUGH h-input flex justify-end gap-0.5 flex-none items-center shrink-0 flex-1 items-center'
            style={p.justify ? justifyStyle : undefined}
            text={csuite.labelText}
        >
            {p.children}
        </Frame>
    )
})

const justifyStyle: CSSProperties = {
    textAlign: 'right',
    minWidth: '8rem',
    width: /* alignLabel && HeaderUI ? */ '35%' /* : undefined */,
    marginRight: /* alignLabel && HeaderUI ? */ '0.25rem' /* : undefined */,
}
