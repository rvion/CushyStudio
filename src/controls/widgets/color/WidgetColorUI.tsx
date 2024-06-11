import type { Widget_color } from './WidgetColor'

import { observer } from 'mobx-react-lite'

export const WidgetColorUI = observer(function WidgetColorUI_(p: { widget: Widget_color }) {
    const widget = p.widget
    return (
        <input //
            value={widget.serial.value}
            type='color'
            onChange={(ev) => (widget.value = ev.target.value)}
        />
    )
})
