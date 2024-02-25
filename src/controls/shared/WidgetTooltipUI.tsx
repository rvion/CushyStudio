import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { RevealUI } from 'src/rsuite/reveal/RevealUI'
import { Tooltip } from 'src/rsuite/shims'

export const WidgetTooltipUI = observer(function WidgetTooltipUI_(p: { widget: IWidget }) {
    const widget = p.widget
    return (
        <RevealUI>
            <div className='btn btn-sm btn-square btn-ghost'>
                <span className='material-symbols-outlined'>info</span>
            </div>
            <Tooltip>{widget.config.tooltip}</Tooltip>
        </RevealUI>
    )
})
