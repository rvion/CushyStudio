import type { Box } from '../../csuite/box/Box'
import type { CovariantFn1 } from '../../csuite/variance/BivariantHack'
import type { CovariantFC } from '../../csuite/variance/CovariantFC'
import type { BaseSchema } from '../model/BaseSchema'
import type { Field } from '../model/Field'
import type { CSSProperties, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'

/** free structure */
export class Form {
    constructor(public props: FormUIProps) {}
}

type SimplifiedFormDef = any // <---------- TODO

export type FormUIProps = {
    // form ---------------------------------------------------------
    field: Maybe<Field>
    layout?: SimplifiedFormDef

    // root wrapper
    label?: string | false
    justifyLabel?: boolean

    // look and feel ------------------------------------------------
    theme?: Box
    className?: string
    style?: CSSProperties

    // extra --------------------------------------------------------
    /** any react children passed to this widget will be displayed at the end of the form */
    children?: ReactNode

    // submit -------------------------------------------------------
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
    submitAction?: CovariantFn1<Field, void> | 'confetti'
    /** if provided, submitLabel and submitActinod will not be used */
    submitButton?: CovariantFC<{ form: Field }>
}

export const FormUI = observer(function FormUI_(p: FormUIProps) {
    const form = p.field
    if (form == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    // if (form.error) return <MessageErrorUI markdown={form.error} />
    const submitAction = p.submitAction
    return (
        <Frame tw='UI-Form' {...p.theme} className={p.className} style={p.style}>
            {form.renderWithLabel() /* FORM */}

            {p.submitButton ??
                (submitAction == null ? null : submitAction === 'confetti' ? (
                    <div tw='flex'>
                        <Button
                            look='primary'
                            tw='ml-auto'
                            onClick={async () => {
                                // @ts-ignore
                                const fire = (await import('https://cdn.skypack.dev/canvas-confetti')).default as (p: any) => void
                                fire({ zIndex: 100000, particleCount: 100, spread: 70 })
                            }}
                        >
                            {p.submitLabel ?? 'Submit'}
                        </Button>
                    </div>
                ) : (
                    <div tw='flex'>
                        <Button look='primary' tw='ml-auto' onClick={() => submitAction(form)}>
                            {p.submitLabel ?? 'Submit'}
                        </Button>
                    </div>
                ))}
        </Frame>
    )
})
