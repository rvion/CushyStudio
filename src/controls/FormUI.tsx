import type { Form } from './Form'

import { observer } from 'mobx-react-lite'
import { MessageErrorUI } from 'src/panels/MessageUI'
import { WidgetGroup_BlockUI } from './widgets/group/WidgetGroupUI'

export const FormUI = observer(function FormUI_(p: {
    //
    className?: string
    form: Maybe<Form<any>>
}) {
    const form = p.form
    if (form == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    if (form.error) return <MessageErrorUI markdown={form.error} />
    if (form.root == null) return <MessageErrorUI markdown='form.root is null' />
    return <WidgetGroup_BlockUI className={p.className} widget={form.root} />
})
