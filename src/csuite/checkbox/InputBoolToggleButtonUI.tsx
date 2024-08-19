import type { BoolButtonProps } from './InputBoolUI'

import { observer } from 'mobx-react-lite'
import { twMerge } from 'tailwind-merge'

import { useCSuite } from '../ctx/useCSuite'
import { Frame } from '../frame/Frame'
import { getInputBoolChroma, getInputBoolContrast } from './_InputBoolChroma'
import { CheckboxAndRadioIcon } from './_InputBoolToggleButtonBoxUI'

// 🔴 2024-07-31: domi: this should actually look like a button?
// => then let's use a Button propably
// => or only have one component with some props?
export const InputBoolToggleButtonUI = observer(function InputBoolToggleButtonUI_(
    p: BoolButtonProps & {
        preventDefault?: boolean
        showToggleButtonBox?: boolean
        /** emulate beeing hovered, passed down to frame as-is */
        hovered?: (reallyHovered: boolean) => boolean | undefined
        // iconSize?: string
    },
) {
    const isActive = p.value ?? false
    // const chroma = getInputBoolChroma(isActive)
    const kit = useCSuite()
    // const border = p.border ?? 10
    return (
        <Row
            tw={twMerge([
                'minh-input select-none cursor-pointer px-1',
                p.showToggleButtonBox ? undefined : 'justify-center',
                p.className,
            ])}
            onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                    p.onValueChange?.(!isActive)
                    ev.preventDefault()
                } else if (ev.key === ' ') {
                    p.onValueChange?.(!isActive)
                    ev.preventDefault()
                }
            }}
            // boxShadow={
            //     !Boolean(border) //
            //         ? undefined
            //         : { inset: true, y: -3, blur: 5, spread: 0, color: 5 }
            // }
            tabIndex={0}
            className={p.className}
            triggerOnPress={{ startingState: isActive }}
            tooltip={p.tooltip}
            tooltipPlacement={p.tooltipPlacement}
            look={isActive ? 'primary' : undefined} // 🔴🦀 temp solution to visually broken active options
            // border={border}
            // iconSize={p.iconSize ?? '2.5em'}
            hoverable={!p.disabled}
            disabled={p.disabled}
            expand={p.expand}
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
            {(p.showToggleButtonBox ?? kit.showToggleButtonBox) && p.mode != null && (
                <CheckboxAndRadioIcon isActive={isActive} mode={p.mode} />
            )}
            {/* 2024-06-07 rvion: make sure long label remain legible even on low width
                - I removed the "line-clamp-1" from the paragraph below
                - I replaced the "h-input" by "minh-input" in the Frame above
            */}
            {p.children ?? <p tw='w-full text-center'>{p.text}</p>}
        </Row>
    )
})
