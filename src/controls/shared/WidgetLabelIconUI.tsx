import type { BaseWidget } from '../BaseWidget'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'

export const WidgetLabelIconUI = observer(function WidgetLabelIconUI_(p: { widget: BaseWidget }) {
    const iconName = p.widget.icon
    if (iconName == null) return null
    return (
        <Frame tw='mr-1' text={{ chroma: 0.2, contrast: 0.9 }}>
            <IkonOf name={iconName} />
        </Frame>
    )
})
