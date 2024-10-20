import type { Field_string_config } from '../fields/string/FieldString'
import type { IconName } from '../icons/icons'
import type { CSSProperties, ForwardedRef, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { forwardRef, ReactElement, useState } from 'react'

import { Button } from '../button/Button'
import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { getLCHFromStringAsString } from '../kolor/getLCHFromStringAsString'
import { knownOKLCHHues } from '../tinyCSS/knownHues'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

export type InputStringProps = {
    /** when true => 'mdiText' */
    icon?: IconName // | boolean | null | undefined

    disabled?: boolean

    // get / set value
    getValue: () => string
    setValue: (value: string) => void

    // get / set buffered value
    buffered?: Maybe<{
        getTemporaryValue: () => string | null
        setTemporaryValue: (value: string | null) => void
    }>

    /** default to text */
    type?: Field_string_config['inputType']

    /** text pattern */
    pattern?: Field_string_config['pattern']

    autoFocus?: boolean

    /** input placeholder */
    placeholder?: string

    // slots ---------------------
    slotBeforeInput?: ReactNode

    // styling -------------------
    className?: string
    style?: CSSProperties

    onBlur?: (ev: React.FocusEvent<HTMLInputElement, Element>) => void
    onFocus?: (ev: React.FocusEvent<HTMLInputElement, Element>) => void
    onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement>) => void
}

export const InputStringUI = observer(
    forwardRef(function WidgetStringUI_(p: InputStringProps, ref: ForwardedRef<HTMLInputElement>) {
        // getValue is mandatory, but it may avoid crash to be permissive about it's absense
        // let's rely on typescript to catch this
        const value = p.getValue?.() ?? ''

        const isBuffered = Boolean(p.buffered)
        const temporaryValue = p.buffered?.getTemporaryValue?.()
        const isDirty = isBuffered && temporaryValue != null && temporaryValue !== value

        const [reveal, setReveal] = useState(false)
        let inputTailwind: string | ClassLike[] | undefined
        let visualHelper: ReactElement<any, any> | undefined

        switch (p.type) {
            case 'color':
                inputTailwind = 'absolute w-full h-full !bg-transparent opacity-0 !p-0'
                visualHelper = (
                    <Frame //
                        tw='UI-Color w-full h-full flex items-center font-mono whitespace-nowrap text-[0.6rem] pl-2'
                        base={value ? value : undefined}
                        text={{ contrast: 1 }}
                    >
                        {getLCHFromStringAsString(value)}
                    </Frame>
                )
                break
            default:
                inputTailwind = 'w-full h-full !outline-none bg-transparent'
                break
        }
        const csuite = useCSuite()
        return (
            <Frame
                className={p.className}
                base={csuite.inputContrast}
                text={{ contrast: 1, chromaBlend: 1 }}
                hover={3}
                border={
                    isDirty //
                        ? { contrast: 0.3, hue: knownOKLCHHues.warning, chroma: 0.2 }
                        : csuite.inputBorder
                }
                tw={['UI-InputString h-input flex items-center relative text-sm rounded-sm']}
                onMouseDown={(ev) => {
                    if (ev.button == 1) {
                        const textInput = ev.currentTarget.querySelector('input[type="text"') as HTMLInputElement
                        textInput.focus()
                    }
                }}
            >
                {visualHelper}
                {p.icon != null && (
                    <IkonOf //
                        tw='mx-1 flex-none'
                        size='1.2rem'
                        name={typeof p.icon === 'string' ? p.icon : 'mdiText'}
                    />
                )}
                {p.slotBeforeInput}
                <input
                    ref={ref}
                    tw={[p.icon ? 'pr-2' : 'px-2', inputTailwind]}
                    type={reveal ? 'text' : p.type}
                    pattern={p.pattern}
                    placeholder={p.placeholder}
                    autoFocus={p.autoFocus}
                    disabled={p.disabled}
                    value={p.buffered ? temporaryValue ?? value : value}
                    onChange={(ev) => {
                        if (p.buffered) p.buffered.setTemporaryValue(ev.target.value)
                        else p.setValue(ev.currentTarget.value)
                    }}
                    /* Prevents drag n drop of selected text, so selecting is easier. */
                    onDragStart={(ev) => ev.preventDefault()}
                    onFocus={(ev) => {
                        p.buffered?.setTemporaryValue(p.getValue() ?? '')
                        ev.currentTarget.select()
                        p.onFocus?.(ev)
                    }}
                    onBlur={(ev) => {
                        // need to be deferenced here because of how it's called in
                        // the onKeyDown handler a few lines below
                        const tempValue = p.buffered?.getTemporaryValue?.()
                        if (tempValue != null) p.setValue(tempValue)
                        p.onBlur?.(ev)
                    }}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            ev.currentTarget.blur()
                        } else if (ev.key === 'Escape') {
                            if (!p.buffered && temporaryValue) p.setValue(temporaryValue)
                            p.buffered?.setTemporaryValue(null)
                            ev.currentTarget.blur()
                        }
                        p.onKeyDown?.(ev)
                    }}
                />
                {p.type === 'password' && (
                    <Button
                        subtle
                        borderless
                        icon={reveal ? 'mdiEyeOff' : 'mdiEye'}
                        onClick={() => setReveal(!reveal)}
                        tw='mx-1 cursor-pointer'
                        square
                    />
                )}
            </Frame>
        )
    }),
)

// 1-a 2-a
// 1-b 2-a

// behaviours
// 1. updateValueOn:
//      - a keystroke
//      - b enter
// 2. onEscape or tab or click away:
//      - a revert to last committed value
//      - b do nothing
