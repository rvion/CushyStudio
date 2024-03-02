import type { Widget_button, Widget_button_context } from './WidgetButton'

import { observer } from 'mobx-react-lite'

import { Button } from 'src/rsuite/shims'
import { useDraft } from 'src/widgets/misc/useDraft'

export const WidgetInlineRunUI = observer(function WidgetInlineRunUI_(p: { widget: Widget_button }) {
    const draft = useDraft()
    const context: Widget_button_context = { draft, widget: p.widget }
    const icon = p.widget.config.icon?.(context)
    return (
        <Button
            tw={[
                'btn-sm join-item',
                p.widget.config.kind === `special`
                    ? `btn-secondary`
                    : p.widget.config.kind === `warning`
                    ? `btn-warning`
                    : `btn-primary`,
            ]}
            className='self-start'
            icon={icon && <span className='material-symbols-outlined'>{icon}</span>}
            onClick={() => p.widget.config.onClick?.(context)}
        >
            {p.widget.config.text ?? `Run`}
        </Button>
    )
})
