import type { CovariantFn } from './BivariantHack'
import type { CovariantFC } from './CovariantFC'
import type { Form } from './Form'
import type { CSSProperties, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { MessageErrorUI } from '../panels/MessageUI'

export const FormUI = observer(function FormUI_(p: {
    // form -----------------------------------
    form: Maybe<Form>
    // look and feel --------------------------
    /** from your daisy-ui config */
    theme?: string
    className?: string
    style?: CSSProperties
    /** any react children passed to this widget will be displayed at the end of the form */
    children?: ReactNode
    /**
     * override default label.
     * @default 'Submit'
     * only used when
     *  - submitButton is not provided
     *  - submitAction is provided (no submitAction => no button => no label needed)
     */
    submitLabel?: string
    /**
     * override default ac
     */
    submitAction?: CovariantFn<Form, void> | 'confetti'
    /** if provided, submitLabel and submitActinod will not be used */
    submitButton?: CovariantFC<{ form: Form }>
}) {
    const form = p.form
    if (form == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    if (form.error) return <MessageErrorUI markdown={form.error} />
    if (form.root == null) return <MessageErrorUI markdown='form.root is null' />
    const submitAction = p.submitAction
    return (
        <div
            //
            tw='bg-base-100'
            data-theme={p.theme}
            className={p.className}
            style={p.style}
        >
            {form.root.ui() /* FORM */}

            {p.submitButton ??
                (submitAction == null ? null : submitAction === 'confetti' ? (
                    <div tw='flex'>
                        <div
                            tw='btn btn-primary ml-auto'
                            onClick={async () => {
                                // @ts-ignore
                                const fire = (await import('https://cdn.skypack.dev/canvas-confetti')).default as (p: any) => void
                                fire({ zIndex: 100000, particleCount: 100, spread: 70 })
                            }}
                        >
                            {p.submitLabel ?? 'Submit'}
                        </div>
                    </div>
                ) : (
                    <div tw='flex'>
                        <div tw='btn btn-primary ml-auto' onClick={() => submitAction(form)}>
                            {p.submitLabel ?? 'Submit'}
                        </div>
                    </div>
                ))}
        </div>
    )
})
