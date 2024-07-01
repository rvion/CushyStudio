import type { Widget_spacer } from './WidgetSpacer'

import { observer } from 'mobx-react-lite'

import { SpacerUI } from './SpacerUI'

export const WidgetSpacerUI = observer(function WidgetSpacerUI_(p: { field: Widget_spacer }) {
    return <SpacerUI />
})
