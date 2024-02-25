import type { IWidget } from '../IWidget'
import type { Widget_optional } from '../widgets/optional/WidgetOptional'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { KLS } from './WidgetWithLabelUI'

export const Widget_ToggleUI = observer(function Widget_ToggleUI_(p: { widget: IWidget }) {
    if (!(p.widget instanceof KLS.Widget_optional)) return null
    const widget = p.widget as Widget_optional

    const isActive = widget.serial.active
    return (
        <div
            style={{ width: '1.3rem', height: '1.3rem' }}
            tw={[isActive ? 'bg-primary' : null, 'virtualBorder', 'rounded mr-1', 'cursor-pointer']}
            tabIndex={-1}
            onClick={(ev) => {
                ev.stopPropagation()
                runInAction(() => {
                    widget.toggle()
                    if (widget.child) {
                        if (widget.serial.active) widget.child.serial.collapsed = false
                        else widget.child.serial.collapsed = true
                    }
                })
            }}
        >
            {isActive ? <span className='material-symbols-outlined text-primary-content'>check</span> : null}
        </div>
    )
})
