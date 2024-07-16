import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { IkonOf } from '../../csuite/icons/iconHelpers'

export const WidgetLabelIconUI = observer(function WidgetLabelIconUI_(p: {
    //
    className?: string
    widget: Field
}) {
    const iconName = p.widget.icon
    if (iconName == null) return null
    return (
        <Frame //
            tw='UI-WidgetLabelIcon self-start minh-widget ABDDE flex items-center'
            className={p.className}
            text={{ chroma: 0.2, contrast: 0.9 }}
        >
            <IkonOf name={iconName} />
        </Frame>
    )
})
