import type { RevealPlacement } from '../reveal/RevealPlacement'
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
    tooltipPlacement?: RevealPlacement
}

export const WidgetLabelContainerUI = observer(function WidgetLabelContainerUI_(p: WidgetLabelContainerProps) {
    const csuite = useCSuite()
    return (
        <Frame
            base={csuite.labelBackground}
            tooltip={p.tooltip}
            tooltipPlacement={p.tooltipPlacement ?? 'topStart'}
            className={p.className}
            hover
            expand
            tw={[
                'UI-WidgetLabelContainer', //
                'COLLAPSE-PASSTHROUGH',
                'flex items-center self-stretch',
                'flex-none shrink-0',
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
    // maxWidth: '20rem', // 🔴 move to theme options
    maxWidth: '15rem', // 🔴 move to theme options
    width: '35%', // 🔴 move to theme options
    justifyContent: 'flex-start',
}
