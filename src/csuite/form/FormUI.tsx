import type { Box } from '../../csuite/box/Box'
import type { Field } from '../model/Field'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { CSSProperties, FC, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'

export type FormUIProps = {
    // form ---------------------------------------------------------
    field: Maybe<Field>

    Header?: FC<NO_PROPS>
    Component?: FC<NO_PROPS>
    // layout?: SimplifiedFormDef

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
    /** @default false */
    allowSubmitWhenErrors?: boolean

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
    submitAction?: ((field: Field) => void) | 'confetti'

    /** if provided, submitLabel and submitActinod will not be used */
    SubmitButton?: FC<{ form: Field; canSubmit: boolean }>
}

export const FormUI = observer(function FormUI_(p: FormUIProps) {
    const form = p.field
    if (form == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    // if (form.error) return <MessageErrorUI markdown={form.error} />
    const submitAction = p.submitAction
    const Component = p.Component ?? ((): JSX.Element => form.renderWithLabel()) /* FORM */
    const canSubmit =
        p.allowSubmitWhenErrors || //
        p.field == null || //
        p.field.allErrorsIncludingChildrenErros.length === 0

    return (
        <Frame
            //
            tw='UI-Form'
            {...p.theme}
            className={p.className}
            style={p.style}
        >
            {p.Header && <p.Header />}
            <Component /> {/* FORM */}
            {p.SubmitButton != null ? (
                <p.SubmitButton form={form} canSubmit={canSubmit} />
            ) : submitAction == null ? null : submitAction === 'confetti' ? (
                <div tw='flex'>
                    <Button
                        look='primary'
                        tw='ml-auto'
                        disabled={!canSubmit}
                        onClick={async () => {
                            if (!canSubmit) return
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
                    <Button look='primary' tw='ml-auto' disabled={!canSubmit} onClick={() => submitAction(form)}>
                        {p.submitLabel ?? 'Submit'}
                    </Button>
                </div>
            )}
        </Frame>
    )
})
