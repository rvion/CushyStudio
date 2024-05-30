import type { BaseWidget } from '../BaseWidget'

import { observer } from 'mobx-react-lite'

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { widget: BaseWidget }) {
    const widget = p.widget
    if (widget.hasErrors === false) return null
    return (
        <div tw='widget-error-ui'>
            {widget.errors.map((e, i) => (
                <div key={i} tw='flex items-center gap-1'>
                    <span className='material-symbols-outlined'>error</span>
                    {e.message}
                </div>
            ))}
        </div>
    )
})
