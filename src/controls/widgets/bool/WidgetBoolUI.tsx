import { runInAction } from 'mobx'
import type { Widget_bool } from './WidgetBool'

import { observer } from 'mobx-react-lite'

// UI

export const WidgetBoolUI = observer(function WidgetBoolUI_(p: { widget: Widget_bool }) {
    const widget = p.widget
    const isActive = widget.serial.active
    const toggle = () => runInAction(widget.toggle)
    return (
        <div
            style={{ width: '1.3rem', height: '1.3rem' }}
            tw={[isActive ? 'bg-primary' : null, 'virtualBorder', 'rounded mr-1', 'cursor-pointer']}
            tabIndex={-1}
            onClick={(ev) => {
                ev.stopPropagation()
                toggle()
            }}
        >
            {isActive ? <span className='material-symbols-outlined text-primary-content'>check</span> : null}
        </div>
    )
})
