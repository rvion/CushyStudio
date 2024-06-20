import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

export const Widget_CollapseBtnUI = observer(function Widget_CollapseBtnUI_(p: { widget: BaseField }) {
    const widget = p.widget
    return (
        <span
            tw={'opacity-30 hover:opacity-100 cursor-pointer'}
            className='material-symbols-outlined'
            style={{ lineHeight: '1em' }}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                if (widget.serial.collapsed) widget.setCollapsed(false)
                else widget.setCollapsed(true)
            }}
        >
            {widget.serial.collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        </span>
    )
})
