import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { CheckboxAndRadioIcon } from './_InputBoolToggleButtonBoxUI'

// 2024-07-31: domi: not 100% sure what the difference is supposed to be with InputBoolToggleButtonUI
// => ok the the other one is probably a togglable button. it was just unclear in SelectOptionUI
// => can probably merge the two of them, except "input" like style may not make sense for buttons... let's see later
export const InputBoolCheckboxUI = observer(function InputBoolCheckboxUI_(p: BoolButtonProps) {
    const { onValueChange, iconOff, toggleGroup, ...rest } = p
    const isActive = p.value ?? false
    const label = p.text
    const mode = p.mode ?? 'checkbox' // 'checkbox'
    // const chroma = getInputBoolChroma(isActive)
    // const contrast = getInputBoolContrast(isActive)
    return (
        <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
            // hoverable
            line
            hover
            size='input'
            triggerOnPress={{ startingState: isActive, toggleGroup }}
            tw={['cursor-pointer select-none px-0.5']}
            onClick={(ev) => {
                if (!p.onValueChange) return
                ev.stopPropagation()
                p.onValueChange(!isActive)
            }}
            {...rest}
        >
            {p.iconOff !== true && (
                <CheckboxAndRadioIcon
                    isActive={isActive}
                    mode={mode}
                    iconSize='1.2rem' // 🔴 should be var(--inside-height), but for now we lose the csuite context in old modals. (cf fiche client in ticket modal)
                />
            )}
            {p.children ?? (label ? <div tw='ml-1'>{label}</div> : null)}
        </Frame>
    )
})
