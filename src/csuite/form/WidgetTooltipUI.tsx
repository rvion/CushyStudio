import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../csuite/frame/Frame'
import { RevealUI } from '../../csuite/reveal/RevealUI'

export const WidgetTooltipUI = observer(function WidgetTooltipUI_(p: { field: Field }) {
    const widget = p.field
    return (
        <RevealUI content={() => <div>{widget.config.tooltip}</div>}>
            <Frame square icon={'mdiInformationOutline'}></Frame>
        </RevealUI>
    )
})
