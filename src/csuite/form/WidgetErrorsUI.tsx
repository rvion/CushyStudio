import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { field: Field }) {
    const field = p.field
    if (field.hasOwnErrors === false) return null
    return (
        <MessageErrorUI>
            {field.ownErrors.map((e, i) => (
                // 🦀 Added `h-input` to make it less ugly, but not sure if it's the right way
                <div key={i} tw='flex items-center gap-1 h-input'>
                    <Ikon.mdiAlert />
                    {e.message}
                </div>
            ))}
        </MessageErrorUI>
    )
})
