import type { IWidget } from '../IWidget'
import type { Widget_optional } from '../widgets/optional/WidgetOptional'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { isWidgetOptional } from '../widgets/WidgetUI.DI'

let isDragging = false
let wasEnabled = false

export const Widget_ToggleUI = observer(function Widget_ToggleUI_(p: { widget: IWidget }) {
    if (!isWidgetOptional(p.widget)) return null
    const widget = p.widget as Widget_optional

    const isActive = widget.serial.active
    const isDraggingListener = (ev: MouseEvent) => {
        if (ev.button == 0) {
            isDragging = false
            window.removeEventListener('mouseup', isDraggingListener, true)
        }
    }

    return (
        <input
            type='checkbox'
            checked={isActive}
            tw='checkbox checkbox-primary'
            tabIndex={-1}
            onMouseDown={(ev) => {
                if (ev.button == 0) {
                    runInAction(() => {
                        ev.stopPropagation()
                        widget.toggleAndUpdateChildCollapsedState()
                    })
                    isDragging = true
                    wasEnabled = !isActive
                    window.addEventListener('mouseup', isDraggingListener, true)
                }
            }}
            onMouseEnter={(ev) => {
                if (isDragging) {
                    wasEnabled ? widget.setOn() : widget.setOff()
                }
            }}
        />
    )
})
