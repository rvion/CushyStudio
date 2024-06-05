import type { BaseWidget } from '../BaseWidget'

import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'
import { Ikon } from '../../icons/iconHelpers'

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { widget: BaseWidget }) {
    const widget = p.widget
    if (widget.hasErrors === false) return null
    return (
        <MessageErrorUI>
            {widget.errors.map((e, i) => (
                <div key={i} tw='flex items-center gap-1'>
                    <Ikon.mdiAlert />
                    {e.message}
                </div>
            ))}
        </MessageErrorUI>
    )
})
