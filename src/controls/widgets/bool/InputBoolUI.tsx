import type { IconName } from '../../../icons/icons'

import { observer } from 'mobx-react-lite'
import { type CSSProperties } from 'react'

import { Frame } from '../../../rsuite/button/Frame'
import { Box } from '../../../theme/colorEngine/Box'

let wasEnabled = false

class BoolButtonProps {
    active?: Maybe<boolean>
    display?: 'check' | 'button'
    expand?: boolean
    icon?: Maybe<IconName>
    text?: string
    className?: string
    style?: CSSProperties
    onValueChange?: (next: boolean) => void
}

export const InputBoolUI = observer(function InputBoolUI_(p: BoolButtonProps) {
    const isActive = p.active ?? false
    const display = p.display ?? 'check'
    const expand = p.expand
    const label = p.text

    if (display === 'check') {
        return (
            <Frame //Container (Makes it so we follow Fitt's law and neatly contains everything)
                style={p.style}
                headless
                hover
                triggerOnPress
                tw={[
                    //
                    'flex flex-row !select-none ',
                    p.expand && 'flex-grow',
                ]}
                onClick={(ev) => {
                    wasEnabled = !isActive
                    ev.stopPropagation()
                    if (!p.onValueChange) return
                    p.onValueChange(!isActive)
                }}
            >
                <Frame // Checkbox
                    // appearance='default'
                    active={isActive}
                    icon={isActive ? 'mdiCheckBold' : null}
                    square
                    size={'xs'}
                    tw='!select-none justify-center'
                />
                {/* <Frame // Container
                    className={p.className}
                    // active={isActive}
                    icon={p.icon}
                    expand={p.expand}
                    // style={p.style}
                    tw={['WIDGET-FIELD select-none cursor-pointer']}
                > */}
                {/* <input type='checkbox' tw='checkbox checkbox-primary' checked={isActive} tabIndex={-1} readOnly /> */}
                {label ? label : null}
                {/* </Frame> */}
            </Frame>
        )
    }

    return (
        <Frame // Container
            className={p.className}
            triggerOnPress
            active={isActive}
            style={p.style}
            icon={p.icon}
            expand={expand}
            tw='WIDGET-FIELD !select-none'
            onClick={(ev) => {
                wasEnabled = !isActive
                ev.stopPropagation()
                p.onValueChange?.(!isActive)
            }}
        >
            <p tw='w-full text-center line-clamp-1'>{label}</p>
        </Frame>
    )
})
