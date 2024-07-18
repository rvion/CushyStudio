import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

export const WidgetCollapseBtnUI = observer(function WidgetCollapseBtnUI_(p: { field: Field }) {
    const field = p.field
    return (
        <span
            tw={'opacity-30 hover:opacity-100 cursor-pointer'}
            className='material-symbols-outlined'
            style={{ lineHeight: '1em' }}
            onClick={(ev) => {
                ev.stopPropagation()
                ev.preventDefault()
                if (field.serial.collapsed) field.setCollapsed(false)
                else field.setCollapsed(true)
            }}
        >
            {field.serial.collapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        </span>
    )
})
