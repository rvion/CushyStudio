import type { Field_string_config } from '../fields/string/FieldString'
import type { IconName } from '../icons/icons'
import type { CSSSizeString } from './CSSSizeString'
import type { CSSProperties, ForwardedRef, ReactElement, ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { forwardRef, useState } from 'react'

import { Button } from '../button/Button'
import { useCSuite } from '../ctx/useCSuite'
import { Frame, type FrameProps } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { getLCHFromStringAsString } from '../kolor/getLCHFromStringAsString'
import { knownOKLCHHues } from '../tinyCSS/knownHues'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

export type InputStringProps = {
    /** when true => 'mdiText' */
    icon?: IconName // | boolean | null | undefined

    /** When there is text it will show a button at the end that when clicked will remove the text */
    clearable?: boolean

    disabled?: boolean

    /** when true, input will match the size of its content */
    autoResize?: boolean
    /** only taken into account when autoResize is true */
    autoResizeMaxWidth?: CSSSizeString

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
    // styling > frame:

    /** className added on the Frame enclosing the input */
    className?: string
    /** style added on the frame enclosing the input */
    style?: CSSProperties

    // styling > input
    /** className added on the input itself */
    inputClassName?: string
    /** style added on the input itself */
    inputStyle?: CSSProperties

    onBlur?: (ev: React.FocusEvent<HTMLInputElement, Element>) => void
    onFocus?: (ev: React.FocusEvent<HTMLInputElement, Element>) => void
    onKeyDown?: (ev: React.KeyboardEvent<HTMLInputElement>) => void
    noColorStuff?: boolean
} & {
    // 💬 2024-09-30 rvion:
    // Temporarilly, let's just accept the two we use manually,
    // and improve that later.
    //
    //> & FrameProps 🔴 will hhave to take all those props properly into account if we want to add taht here
    roundness?: FrameProps['roundness']
    dropShadow?: FrameProps['dropShadow']
}
export const InputStringUI = observer(
    forwardRef(function WidgetStringUI_(p: InputStringProps, ref: ForwardedRef<HTMLInputElement>) {
        // getValue is mandatory, but it may avoid crash to be permissive about it's absense
        // let's rely on typescript to catch this
        const value = p.getValue?.() ?? ''

        const isBuffered = Boolean(p.buffered)
        const temporaryValue = p.buffered?.getTemporaryValue?.()
        const isDirty = isBuffered && temporaryValue != null && temporaryValue !== value
        const autoResize = p.autoResize
        const inptClassNameWhenAutosize = autoResize ? 'absolute top-0 left-0 right-0 opacity-10 focus:opacity-100 z-50' : null
        const [reveal, setReveal] = useState(false)
        let inputTailwind: string | ClassLike[] | undefined
        let visualHelper: ReactElement<any, any> | undefined

        const theme = cushy.theme.value

        switch (p.type) {
            case 'color':
                inputTailwind = 'w-full h-full !bg-transparent opacity-0 !p-0'
                visualHelper = (
                    <Frame //
                        tw='UI-Color left-0 absolute w-full h-full flex items-center font-mono whitespace-nowrap text-[0.6rem] pl-2'
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
        const input = (
            <input
                ref={ref}
                size={autoResize ? 1 : undefined}
                className={p.inputClassName}
                style={p.inputStyle}
                tw={[inptClassNameWhenAutosize, inputTailwind]}
                type={reveal ? 'text' : p.type}
                pattern={p.pattern}
                placeholder={p.placeholder}
                autoFocus={p.autoFocus}
                disabled={p.disabled}
                value={p.buffered ? (temporaryValue ?? value) : value}
                onChange={(ev) => {
                    if (p.buffered) p.buffered.setTemporaryValue(ev.target.value)
                    else p.setValue(ev.currentTarget.value)
                }}
                /* Prevents drag n drop of selected text, so selecting is easier. */
                onDragStart={(ev) => ev.preventDefault()}
                onFocus={(ev) => {
                    p.buffered?.setTemporaryValue(p.getValue() ?? '')
                    // ev.currentTarget.select()
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
        )
        const dropShadow = p.dropShadow ?? theme.inputShadow
        return (
            <Frame
                noColorStuff={p.noColorStuff}
                className={p.className}
                style={p.style}
                base={csuite.inputContrast}
                text={{ contrast: 1, chromaBlend: 1 }}
                hover={3}
                dropShadow={dropShadow}
                roundness={csuite.inputRoundness}
                border={
                    isDirty //
                        ? { contrast: 0.3, hue: knownOKLCHHues.warning, chroma: 0.2 }
                        : csuite.inputBorder
                }
                tw={[
                    //
                    p.icon && !p.clearable ? 'pr-1' : 'px-0',
                    'UI-InputString h-input flex items-center relative text-sm overflow-clip',
                ]}
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
                {autoResize ? (
                    <div className='minh-input relative'>
                        {input}
                        <span
                            style={{ maxWidth: p.autoResizeMaxWidth }}
                            tw='whitespace-nowrap minh-input lh-input whitespace-pre select-none'
                        >
                            {p.getValue() ? p.getValue() : <span tw='opacity-30'>{p.placeholder || ' '}</span>}
                        </span>
                    </div>
                ) : (
                    input
                )}
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
                {value != '' && p.clearable && (
                    <Button //
                        roundness={0}
                        subtle
                        borderless
                        icon={'_clear'}
                        onClick={() => p.setValue('')}
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
