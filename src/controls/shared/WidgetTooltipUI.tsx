import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { Frame } from '../../rsuite/frame/Frame'
import { RevealUI } from '../../rsuite/reveal/RevealUI'

export const WidgetTooltipUI = observer(function WidgetTooltipUI_(p: { widget: IWidget }) {
    const widget = p.widget
    return (
        <RevealUI content={() => <div>{widget.config.tooltip}</div>}>
            <Frame square icon={'mdiInformationOutline'}></Frame>
        </RevealUI>
    )
})
