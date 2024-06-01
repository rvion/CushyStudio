import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../rsuite/frame/Frame'
import { useTheme } from '../../rsuite/theme/useTheme'

export type WidgetLabelContainerProps = {
    //
    justify: boolean
    className?: string
    children: React.ReactNode
}

export const WidgetLabelContainerUI = observer(function WidgetLabelContainerUI_(p: WidgetLabelContainerProps) {
    const theme = useTheme()
    return (
        <Frame
            tw='COLLAPSE-PASSTHROUGH flex justify-end gap-0.5 flex-none items-center shrink-0 flex-1 items-center py-1'
            style={p.justify ? justifyStyle : undefined}
            text={theme.value.labelText}
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
