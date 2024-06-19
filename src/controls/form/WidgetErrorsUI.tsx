import type { BaseField } from '../model/BaseField'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { widget: BaseField }) {
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
