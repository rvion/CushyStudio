import type { PresenterFn } from './FieldPresenterProps'

import { observer } from 'mobx-react-lite'

// SHELL SIMPLE
export const ShellSimpleUI = observer(function ShellSimple(p: PresenterFn) {
    const field = p.field
    return (
        <div>
            <div tw='row'>
                {p.LabelText && <p.LabelText field={field} />}
                {p.Header && <p.Header field={field} />}
            </div>
            {p.Body && <p.Body field={field} />}
        </div>
    )
})
