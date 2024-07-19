import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

let isDragging: boolean = false
let wasEnabled: boolean = false

const isDraggingListener = (ev: MouseEvent): void => {
    if (ev.button == 0) {
        isDragging = false
        window.removeEventListener('mouseup', isDraggingListener, true)
    }
}

export const WidgetHeaderContainerUI = observer(function WidgetHeaderContainerUI_(p: {
    field: Field
    children?: React.ReactNode
}) {
    const field = p.field
    return (
        <div
            className='UI-WidgetHeaderContainer COLLAPSE-PASSTHROUGH'
            tw={[
                'flex gap-0.5 select-none',
                // 2024-06-03 rvion, changing 'items-center' to 'items-start'
                // as well as adding some `h-input` class to <WidgetLabelContainerUI />
                'items-start',
            ]}
            onMouseDown={(ev) => {
                if (ev.button != 0 || !field.isCollapsible) return
                const target = ev.target as HTMLElement
                if (!target.classList.contains('COLLAPSE-PASSTHROUGH')) return
                isDragging = true
                window.addEventListener('mouseup', isDraggingListener, true)
                wasEnabled = !field.serial.collapsed
                field.setCollapsed(wasEnabled)
            }}
            onMouseMove={(ev) => {
                if (!isDragging || !field.isCollapsible) return
                field.setCollapsed(wasEnabled)
            }}
        >
            {p.children}
        </div>
    )
})
