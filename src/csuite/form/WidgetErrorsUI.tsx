import type { Field } from '../model/Field'

import { observer } from 'mobx-react-lite'

import { Ikon } from '../../csuite/icons/iconHelpers'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'

/** default error block */
export const WidgetErrorsUI = observer(function WidgerErrorsUI_(p: { field: Field }) {
    const field = p.field
    if (field.hasErrors === false) return null
    return (
        <MessageErrorUI>
            {field.errors.map((e, i) => (
                <div key={i} tw='flex items-center gap-1'>
                    <Ikon.mdiAlert />
                    {e.message}
                </div>
            ))}
        </MessageErrorUI>
    )
})
