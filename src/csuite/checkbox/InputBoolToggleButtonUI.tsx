import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { Frame } from '../frame/Frame'

export const InputBoolToggleButtonUI = observer(function InputBoolToggleButtonUI_(p: BoolButtonProps) {
    const isActive = p.value ?? false
    const expand = p.expand
    const label = p.text
    const chroma = isActive ? 0.08 : 0.02
    // const mode = p.mode ?? false
    // const kit = useCushyKit()

    return (
        <Frame
            tw='h-input !select-none cursor-pointer justify-center px-1 py-1 text-sm flex items-center'
            className={p.className}
            triggerOnPress={{ startingState: isActive }}
            look='default'
            base={{ contrast: isActive ? 0.09 : 0.05, chroma: chroma }}
            border={isActive ? 20 : 0}
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
            {/* {kit.showToggleButtonBox && mode && <InputBoolToggleButtonBoxUI isActive={isActive} mode={mode} />} */}
            <p tw='w-full text-center line-clamp-1'>{label}</p>
        </Frame>
    )
})
