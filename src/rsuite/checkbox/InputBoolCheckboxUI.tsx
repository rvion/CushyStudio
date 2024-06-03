import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const InputBoolCheckboxUI = observer(function InputBoolCheckboxUI_(p: BoolButtonProps) {
    const isActive = p.value ?? false
    const label = p.text
    const mode = p.mode ?? false // 'checkbox'
    const chroma = isActive ? 0.08 : 0.01
    return (
        <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
            style={p.style}
            className={p.className}
            disabled={p.disabled}
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
                icon={p.icon ?? (isActive ? 'mdiCheckBold' : null)}
                tw={['!select-none object-contain WIDGET-FIELD', mode === 'radio' ? 'rounded-full' : 'rounded-sm']}
                border={{ contrast: 0.2, chroma }}
                style={{ width: 'var(--input-height)' /* hacky */ }}
                base={{ contrast: isActive ? 0.09 : 0, chroma }}
                size='sm'
                hover
                {...p.box}
            />
            {label ? label : null}
        </Frame>
    )
})
