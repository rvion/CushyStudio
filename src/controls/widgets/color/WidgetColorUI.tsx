import type { Widget_color } from './WidgetColor'

import { observer } from 'mobx-react-lite'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { widget: Widget_color }) {
    const widget = p.widget
    return (
        <div>
            <input //
                value={widget.serial.val}
                type='color'
                onChange={(ev) => (widget.serial.val = ev.target.value)}
            />
        </div>
    )
})
