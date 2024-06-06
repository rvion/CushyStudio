import type { IWidget } from '../IWidget'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

export const WidgetLabelUI = observer(function WidgetLabelUI_(p: {
    //
    widget: IWidget
    className?: string
    children: ReactNode
}) {
    return (
        <span
            tw={[
                // 1. indicate we can click on the label
                p.widget.isCollapsed || p.widget.isCollapsible ? 'cursor-pointer COLLAPSE-PASSTHROUGH' : null,

                // 3. label wrappign strategy
                // 3.1  alt. 1: disable all wrapping
                // 'whitespace-nowrap',
                // 3.2. alt. 2:
                //  - limit to 2 lines, with ellipsis,
                //  - dense line height to force widget to remain within it's
                //  - original allocated height
                'line-clamp-2 [lineHeight:1rem] [overflow:unset]',

                p.className,
            ]}
        >
            {p.children}
        </span>
    )
})
