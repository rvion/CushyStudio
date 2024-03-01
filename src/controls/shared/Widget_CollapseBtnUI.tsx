import type { IWidget } from '../IWidget'

import { observer } from 'mobx-react-lite'

export const Widget_CollapseBtnUI = observer(function Widget_CollapseBtnUI_(p: { widget: IWidget }) {
    const widget = p.widget
    return (
        <span
            tw={'opacity-30 hover:opacity-100 cursor-pointer'}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                if (widget.serial.collapsed) widget.serial.collapsed = false
                else widget.serial.collapsed = true
            }}
            //
            className='material-symbols-outlined'
            style={{ lineHeight: '1em' }}
        >
            {widget.serial.collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        </span>
    )
})
