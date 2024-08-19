import type { Box } from '../../csuite/box/Box'
import type { FrameAppearance } from '../frame/FrameTemplates'
import type { Field } from '../model/Field'
import type { NO_PROPS } from '../types/NO_PROPS'
import type { RSSize } from '../types/RsuiteTypes'
import type { CSSProperties, FC } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../../csuite/button/Button'
import { Frame } from '../../csuite/frame/Frame'
import { MessageErrorUI } from '../../csuite/messages/MessageErrorUI'

export type FormUIProps = {
    // form ---------------------------------------------------------
    field: Maybe<Field>
    // ⏸️ skin?: 'default' | 'cell' | 'text' | 'whatev'

    Header?: FC<NO_PROPS>
    Content?: FC<NO_PROPS> //
    // layout?: SimplifiedFormDef

    // root wrapper
    label?: string | false
    justifyLabel?: boolean

    // look and feel ------------------------------------------------
    theme?: Box
    className?: string
    style?: CSSProperties

    // submit -------------------------------------------------------
    /** @default false */
    allowSubmitWhenErrors?: boolean

    // --------------------------------------------------------------
    // 🔴 TODO: do the same thing as tong and only provide a single submit prop instead

    /**
     * override default label.
     * @default 'Submit'
     * only used when
     *  - submitAction is provided (no submitAction => no button => no label needed)
     * Use `Footer` instead if you want to provide multiple actions, custom submit button, etc.
     */
    submitLabel?: string
    submitLook?: FrameAppearance
    submitSize?: RSSize
    /** * override default action */
    submitAction?: ((field: Field) => void) | 'confetti'
    /** for custom submit button and more actions */
    Footer?: FC<{ field: Field; canSubmit: boolean }>
}

/**
 * Mostly a central component doing the heavy lifting
 * (likely coming from field.someRender(), field likely being a group)
 * with additionally:
 * - some custom header to include in the main div
 * - some action buttons (submit...)
 */
export const FormUI = observer(function FormUI_(p: FormUIProps) {
    const field = p.field
    if (field == null) return <MessageErrorUI markdown={`form is not yet initialized`} />
    // if (form.error) return <MessageErrorUI markdown={form.error} />
    const submitAction = p.submitAction
    // const Component = useMemo(() => p.Component ?? ((): JSX.Element => form.renderWithLabel()), [])
    const Content = p.Content ?? ((): JSX.Element => field.renderWithLabel({ noHeader: true }))

    const canSubmit: boolean =
        p.allowSubmitWhenErrors ||
        p.field == null ||
        // 💬 2024-07-21 rvion:
        // | spent one hour troubleshooting this crap:
        // | components re-evaluated at every single rendering will not be properly cached.
        // | this was making every sub components re-render everytime => int were not working properly
        // | also...... now that I'm writing that, why the hell was this component re-rendering everytime the value was changing ?
        p.field.allErrorsIncludingChildrenErros.length === 0

    return (
        <Frame
            //
            tw='UI-Form'
            col
            {...p.theme}
            className={p.className}
            style={p.style}
        >
            {p.Header && <p.Header />}
            <Content /> {/* FORM */}
            {submitAction != null && (
                <div tw='flex'>
                    <Button
                        look={p.submitLook ?? 'primary'}
                        size={p.submitSize ?? 'input'}
                        tw='ml-auto'
                        disabled={!canSubmit}
                        onClick={async () => {
                            if (!canSubmit) return

                            if (submitAction === 'confetti') {
                                // @ts-ignore
                                const fire = (await import('https://cdn.skypack.dev/canvas-confetti')).default as (p: any) => void
                                fire({ zIndex: 100000, particleCount: 100, spread: 70 })
                            } else {
                                submitAction(field)
                            }
                        }}
                    >
                        {p.submitLabel ?? 'Submit'}
                    </Button>
                </div>
            )}
            {p.Footer != null && <p.Footer field={field} canSubmit={canSubmit} />}
        </Frame>
    )
})
