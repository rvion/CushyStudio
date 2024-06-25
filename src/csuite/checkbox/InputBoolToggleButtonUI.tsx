import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { getInputBoolChroma, getInputBoolContrast } from './_InputBoolChroma'
import { InputBoolToggleButtonBoxUI } from './_InputBoolToggleButtonBoxUI'

export const InputBoolToggleButtonUI = observer(function InputBoolToggleButtonUI_(
    p: BoolButtonProps & {
        preventDefault?: boolean
        showToggleButtonBox?: boolean
        /** emulate beeing hovered, passed down to frame as-is */
        hovered?: (reallyHovered: boolean) => boolean | undefined
        iconSize?: string
    },
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
            tooltip={p.tooltip}
            tooltipPlacement={p.tooltipPlacement}
            look='default'
            base={{ contrast: getInputBoolContrast(isActive), chroma: chroma }}
            border={10 /* isActive ? 10 : 20 */}
            iconSize={p.iconSize ?? '1.5em'}
            hover={!p.disabled}
            expand={expand}
            style={p.style}
            hovered={p.hovered}
            icon={p.icon}
            {...p.box}
            onClick={(ev) => {
                // wasEnabled = !isActive
                ev.stopPropagation()
                p.onValueChange?.(!isActive)
                if (p.preventDefault) ev.preventDefault()
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
