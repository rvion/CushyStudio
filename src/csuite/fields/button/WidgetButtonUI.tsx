import type { Widget_button, Widget_button_context } from './WidgetButton'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

import { Button } from '../../button/Button'

export const WidgetInlineRunUI = observer(function WidgetInlineRunUI_<K extends any>(p: { field: Widget_button<K> }) {
    const extra = p.field.config.useContext?.() as K
    const context: Widget_button_context<K> = { widget: p.field, context: extra }
    // const icon = p.widget.config.icon?.(context)
    return (
        <Button
            look={p.field.config.look}
            className='self-start'
            icon={p.field.icon}
            expand={p.field.config.expand}
            onClick={() => runInAction(() => p.field.config.onClick?.(context))}
        >
            {/* {icon && <span className='material-symbols-outlined'>{icon}</span>} */}
            {p.field.config.text ?? `Run`}
        </Button>
    )
})
