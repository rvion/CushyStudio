import type { Widget_spacer } from './WidgetSpacer'

import { observer } from 'mobx-react-lite'
import { SpacerUI } from './SpacerUI'

export const WidgetSpacerUI = observer(function WidgetSpacerUI_(p: { widget: Widget_spacer }) {
    return <SpacerUI />
})
