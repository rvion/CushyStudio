import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'
import { getInputBoolChroma, getInputBoolContrast } from './_InputBoolChroma'

export const InputBoolCheckboxUI = observer(function InputBoolCheckboxUI_(p: BoolButtonProps) {
    const isActive = p.value ?? false
    const label = p.text
    const mode = p.mode ?? false // 'checkbox'
    const chroma = getInputBoolChroma(isActive)
    const contrast = getInputBoolContrast(isActive)
    return (
        <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
            style={p.style}
            className={p.className}
            disabled={p.disabled}
            tooltip={p.tooltip}
            tooltipPlacement={p.tooltipPlacement}
            hover
            triggerOnPress={{ startingState: isActive }}
            expand={p.expand}
            tw={['flex flex-row !select-none cursor-pointer']}
            onClick={(ev) => {
                if (!p.onValueChange) return
                ev.stopPropagation()
                p.onValueChange(!isActive)
            }}
        >
            <Frame // Checkbox
                size='input'
                square
                icon={p.icon ?? (isActive ? 'mdiCheckBold' : null)}
                tw={['!select-none', mode === 'radio' ? 'rounded-full' : 'rounded-sm']}
                border={{ contrast: 0.2, chroma }}
                base={{ contrast, chroma }}
                // square
                iconSize='var(--input-icon-height)'
                hover
                {...p.box}
            />
            {p.children ?? (label ? <div tw='ml-1'>{label}</div> : null)}
        </Frame>
    )
})
