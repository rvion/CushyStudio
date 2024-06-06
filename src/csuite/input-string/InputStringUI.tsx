import type { Widget_string_config } from '../../controls/widgets/string/WidgetString'
import type { IconName } from '../icons/icons'

import { observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { type CSSProperties, ReactElement, useState } from 'react'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'
import { getLCHFromStringAsString } from '../kolor/getLCHFromStringAsString'
import { useTheme } from '../theme/useTheme'

type ClassLike = string | { [cls: string]: any } | null | undefined | boolean

export const sampleInputStringUIProps = observable({
    // get / set value
    value: '',
    getValue: () => sampleInputStringUIProps.value,
    setValue: (value: string) => {
        sampleInputStringUIProps.value = value
    },
    // get / set buffered value
    temporaryValue: null as string | null,
    buffered: {
        getTemporaryValue: (): string | null => sampleInputStringUIProps.temporaryValue,
        setTemporaryValue: (value: string | null) => {
            sampleInputStringUIProps.temporaryValue = value
        },
    },
})

export const InputStringUI = observer(function WidgetStringUI_(p: {
    /** when true => 'mdiText' */
    icon?: IconName | boolean

    // get / set value
    getValue: () => string
    setValue: (value: string) => void

    // get / set buffered value
    buffered?: Maybe<{
        getTemporaryValue: () => string | null
        setTemporaryValue: (value: string | null) => void
    }>

    /** default to text */
    inputType?: Widget_string_config['inputType']

    /** text pattern */
    pattern?: Widget_string_config['pattern']

    /** input placeholder */
    placeHolder?: string

    // styling -------------------
    className?: string
    style?: CSSProperties
}) {
    const widget = p

    const value = widget.getValue()
    const temporaryValue = widget.buffered?.getTemporaryValue?.()

    const [reveal, setReveal] = useState(false)
    let inputTailwind: string | ClassLike[] | undefined
    let visualHelper: ReactElement<any, any> | undefined

    switch (widget.inputType) {
        case 'color':
            inputTailwind = 'absolute w-full h-full !bg-transparent opacity-0 !p-0'
            visualHelper = (
                <Frame //
                    tw='w-full h-full flex items-center font-mono whitespace-nowrap text-[0.6rem]'
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

    return (
        <Frame
            base={5}
            text={{ contrast: 1, chromaBlend: 1 }}
            border={{ contrast: useTheme().value.inputBorder }}
            tw={['h-input w-full flex flex-1 items-center relative text-sm']}
            onMouseDown={(ev) => {
                if (ev.button == 1) {
                    const textInput = ev.currentTarget.querySelector('input[type="text"') as HTMLInputElement
                    textInput.focus()
                }
            }}
        >
            {visualHelper}
            {p.icon && (
                <IkonOf //
                    tw='mx-1'
                    size='1.2rem'
                    name={typeof p.icon === 'string' ? p.icon : 'mdiText'}
                />
            )}
            <input
                tw={['px-2', inputTailwind]}
                type={reveal ? 'text' : widget.inputType}
                pattern={widget.pattern}
                placeholder={widget.placeHolder}
                value={temporaryValue ?? value}
                onChange={(ev) => {
                    if (widget.buffered) widget.buffered.setTemporaryValue(ev.target.value)
                    else widget.setValue(ev.currentTarget.value)
                }}
                /* Prevents drag n drop of selected text, so selecting is easier. */
                onDragStart={(ev) => ev.preventDefault()}
                onFocus={(ev) => {
                    widget.buffered?.setTemporaryValue(widget.getValue() ?? '')
                    ev.currentTarget.select()
                }}
                onBlur={() => {
                    if (temporaryValue != null) {
                        widget.setValue(temporaryValue)
                    }
                }}
                onKeyDown={(ev) => {
                    if (ev.key === 'Enter') {
                        ev.currentTarget.blur()
                    } else if (ev.key === 'Escape') {
                        if (!widget.buffered && temporaryValue) widget.setValue(temporaryValue)
                        widget.buffered?.setTemporaryValue(null)
                        ev.currentTarget.blur()
                    }
                }}
            />
            {p.inputType === 'password' && (
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
})

// 1-a 2-a
// 1-b 2-a

// behaviours
// 1. updateValueOn:
//      - a keystroke
//      - b enter
// 2. onEscape or tab or click away:
//      - a revert to last committed value
//      - b do nothing
