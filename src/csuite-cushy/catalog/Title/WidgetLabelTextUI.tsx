import type { Field } from '../../../csuite/model/Field'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../../../csuite/ctx/useCSuite'
import { makeLabelFromPrimitiveValue } from '../../../csuite/utils/makeLabelFromFieldName'

export type WidgetTitleProps = {
    field: Field
    as?: string
    className?: string
    children?: ReactNode
}

export const DefaultWidgetTitleUI = observer(function DefaultWidgetTitle(p: WidgetTitleProps) {
    const csuite = useCSuite()
    const labelText = p.children ?? p.field.config.label ?? makeLabelFromPrimitiveValue(p.field.mountKey)
    const Elem: 'div' = (p.as ?? 'div') as 'div'
    return (
        <Elem
            tw={[
                'UI-WidgetLabel minh-widget lh-widget self-start',
                // 1. indicate we can click on the label
                'COLLAPSE-PASSTHROUGH',
                // p.field.isCollapsed || p.field.isCollapsible ? 'cursor-pointer COLLAPSE-PASSTHROUGH' : null,

                // 3. label wrappign strategy
                // 3.1  alt. 1: disable all wrapping
                // 'whitespace-nowrap',

                // 3.2. alt. 2:
                //  - limit to 2 lines, with ellipsis,
                //  - dense line height to force widget to remain within it's
                //  - original allocated height
                // 'line-clamp-2',

                // 3.3. alt. 3:
                // '[lineHeight:1.3rem] overflow-auto',
                csuite.truncateLabels && 'truncate',

                p.className,
            ]}
        >
            {p.field.isHidden && '🥷 '}
            {labelText}
        </Elem>
    )
})
