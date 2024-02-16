import type { Form } from './Form'

import { observer } from 'mobx-react-lite'
import { MessageErrorUI } from 'src/panels/MessageUI'
import { WidgetGroup_BlockUI } from './widgets/group/WidgetGroupUI'
// import { useEffect } from 'react'

export const FormUI = observer(function FormUI_(p: { form: Maybe<Form<any>> }) {
    const form = p.form
    // useEffect(() => void form?.init(), [form])
    if (form == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    if (form.error) return <MessageErrorUI markdown={form.error} />
    if (form.root == null) return <MessageErrorUI markdown='form.root is null' />
    return <WidgetGroup_BlockUI widget={form.root} />
})
