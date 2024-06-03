import type { BaseWidget } from '../BaseWidget'
import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

let isDragging = false
let wasEnabled = false

const isDraggingListener = (ev: MouseEvent) => {
    if (ev.button == 0) {
        isDragging = false
        window.removeEventListener('mouseup', isDraggingListener, true)
    }
}

export const WidgetHeaderContainerUI = observer(function WidgetHeaderContainerUI_(p: {
    widget: BaseWidget
    children?: React.ReactNode
}) {
    const widget = p.widget
    return (
        <div
            className='WIDGET-HEADER COLLAPSE-PASSTHROUGH'
            tw={[
                'flex gap-0.5 select-none',
                // 2024-06-03 rvion, changing 'items-center' to 'items-start'
                // as well as adding some `h-input` class to <WidgetLabelContainerUI />
                'items-start',
            ]}
            onMouseDown={(ev) => {
                if (ev.button != 0 || !widget.isCollapsible) return
                const target = ev.target as HTMLElement
                if (!target.classList.contains('COLLAPSE-PASSTHROUGH')) return
                isDragging = true
                window.addEventListener('mouseup', isDraggingListener, true)
                wasEnabled = !widget.serial.collapsed
                widget.setCollapsed(wasEnabled)
            }}
            onMouseMove={(ev) => {
                if (!isDragging || !widget.isCollapsible) return
                widget.setCollapsed(wasEnabled)
            }}
        >
            {p.children}
        </div>
    )
})
