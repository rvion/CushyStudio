import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { getInputBoolChroma, getInputBoolContrast } from './_InputBoolChroma'
import { InputBoolToggleButtonBoxUI } from './_InputBoolToggleButtonBoxUI'

export const InputBoolToggleButtonUI = observer(function InputBoolToggleButtonUI_(
    p: BoolButtonProps & { showToggleButtonBox?: boolean },
) {
    const isActive = p.value ?? false
    const expand = p.expand
    const chroma = getInputBoolChroma(isActive)
    const kit = useCSuite()

    return (
        <Frame
            tw='InputBoolToggleButtonUI minh-input !select-none cursor-pointer justify-center px-1 text-sm flex items-center'
            className={p.className}
            triggerOnPress={{ startingState: isActive }}
            look='default'
            base={{ contrast: getInputBoolContrast(isActive), chroma: chroma }}
            border={isActive ? 10 : 5}
            iconSize='1.5em'
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
            {(p.showToggleButtonBox ?? kit.showToggleButtonBox) && p.mode && (
                <InputBoolToggleButtonBoxUI isActive={isActive} mode={p.mode} />
            )}
            {/* 2024-06-07 rvion: make sure long label remain legible even on low width
                - I removed the "line-clamp-1" from the paragraph below
                - I replaced the "h-input" by "minh-input" in the Frame above
            */}

            {p.children ?? <p tw='w-full text-center'>{p.text}</p>}
        </Frame>
    )
})
