import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { getInputBoolChroma, getInputBoolContrast } from './InputBoolChroma'
import { InputBoolToggleButtonBoxUI } from './InputBoolToggleButtonBoxUI'

export const InputBoolToggleButtonUI = observer(function InputBoolToggleButtonUI_(p: BoolButtonProps) {
    const isActive = p.value ?? false
    const expand = p.expand
    const label = p.text
    const chroma = getInputBoolChroma(isActive)
    const kit = useCSuite()

    return (
        <Frame
            tw='h-input !select-none cursor-pointer justify-center px-1 py-1 text-sm flex items-center'
            className={p.className}
            triggerOnPress={{ startingState: isActive }}
            look='default'
            base={{ contrast: getInputBoolContrast(isActive), chroma: chroma }}
            border={isActive ? 10 : 5}
            hover={!p.disabled}
            expand={expand}
            style={p.style}
            icon={p.icon}
            {...p.box}
            onClick={(ev) => {
                // wasEnabled = !isActive
                ev.stopPropagation()
                p.onValueChange?.(!isActive)
            }}
        >
            {kit.showToggleButtonBox && p.mode && <InputBoolToggleButtonBoxUI isActive={isActive} mode={p.mode} />}
            <p tw='w-full text-center line-clamp-1'>{label}</p>
        </Frame>
    )
})
