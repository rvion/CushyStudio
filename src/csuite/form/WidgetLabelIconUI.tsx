import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'

export const WidgetLabelIconUI = observer(function WidgetLabelIconUI_(p: {
    //
    className?: string
    widget: BaseField
}) {
    const iconName = p.widget.icon
    if (iconName == null) return null
    return (
        <Frame //
            className={p.className}
            text={{ chroma: 0.2, contrast: 0.9 }}
        >
            <IkonOf name={iconName} />
        </Frame>
    )
})
