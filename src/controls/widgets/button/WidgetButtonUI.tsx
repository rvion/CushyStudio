import type { Widget_button, Widget_button_context } from './WidgetButton'

import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'

export const WidgetInlineRunUI = observer(function WidgetInlineRunUI_<K extends any>(p: { widget: Widget_button<K> }) {
    const extra = p.widget.config.useContext?.() as K
    const context: Widget_button_context<K> = { widget: p.widget, context: extra }
    // const icon = p.widget.config.icon?.(context)
    return (
        <div
            tw={[
                'btn btn-sm join-item',
                p.widget.config.kind === `special`
                    ? `btn-secondary`
                    : p.widget.config.kind === `warning`
                      ? `btn-warning`
                      : `btn-primary`,
            ]}
            className='self-start'
            onClick={() => runInAction(() => p.widget.config.onClick?.(context))}
        >
            {/* {icon && <span className='material-symbols-outlined'>{icon}</span>} */}
            {p.widget.config.text ?? `Run`}
        </div>
    )
})
