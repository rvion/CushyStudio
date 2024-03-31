import type { Form } from './Form'
import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../panels/MessageUI'
import { WidgetGroup_BlockUI } from './widgets/group/WidgetGroupUI'

export const FormUI = observer(function FormUI_(p: {
    // form -----------------------------------
    form: Maybe<Form<any, any>>
    // look and feel --------------------------
    /** from your daisy-ui config */
    theme?: string
    className?: string
    style?: CSSProperties
}) {
    const form = p.form
    if (form == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    if (form.error) return <MessageErrorUI markdown={form.error} />
    if (form.root == null) return <MessageErrorUI markdown='form.root is null' />
    return (
        <div
            //
            tw='bg-base-100'
            data-theme={p.theme}
            className={p.className}
            style={p.style}
        >
            <WidgetGroup_BlockUI widget={form.root} />
        </div>
    )
})
