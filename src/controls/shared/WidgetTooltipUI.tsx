import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

import { RevealUI } from '../../rsuite/reveal/RevealUI'
import { Tooltip } from '../../rsuite/shims'

export const WidgetTooltipUI = observer(function WidgetTooltipUI_(p: { widget: IWidget }) {
    const widget = p.widget
    return (
        <RevealUI content={() => <Tooltip>{widget.config.tooltip}</Tooltip>}>
            <div className='btn btn-sm btn-square btn-ghost'>
                <span className='material-symbols-outlined'>info</span>
            </div>
        </RevealUI>
    )
})
