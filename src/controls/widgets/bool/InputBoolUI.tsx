import type { IconName } from '../../../icons/icons'
import { useEffect, type CSSProperties, useMemo } from 'react'

import { observer } from 'mobx-react-lite'

import { ButtonProps, Frame } from '../../../rsuite/button/Frame'
import { CushyKit } from '../../shared/CushyKit'
import { makeAutoObservable, runInAction } from 'mobx'
import { useCushyKitOrNull } from '../../shared/CushyKitCtx'
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

class BoolButtonState {
    constructor(
        //
        public props: BoolButtonProps,
        public kit: Maybe<CushyKit>, // Not sure how to implement this
    ) {
        makeAutoObservable(this)
    }

    onPointerDownListener = () => {}

    onPointerUpListener = (/* e: MouseEvent */) => {
        this.props.onValueChange?.(!this.props.active)
        window.removeEventListener('pointerup', this.onPointerUpListener, true)
        window.removeEventListener('pointerdown', this.onPointerDownListener, true)
    }
}

export const InputBoolUI = observer(function InputBoolUI_(p: BoolButtonProps) {
    // create stable state, that we can programmatically mutate witout caring about stale references
    const kit = useCushyKitOrNull()
    // const uist = useMemo(() => new BoolButtonState(p, kit), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    // runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    // useEffect(() => uist.onPointerUpListener, [])

    const isActive = p.active ?? false
    const display = p.display ?? 'check'
    const expand = p.expand
    const label = p.text

    if (display === 'check') {
        return (
            <Box //Container (Makes it so we follow Fitt's law and neatly contains everything)
                style={p.style}
                tw={[
                    //
                    'flex flex-row !select-none',
                    p.expand && 'flex-grow',
                ]}
                onMouseDown={(ev) => {
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
                    tw='!select-none'
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
            </Box>
        )
    }

    return (
        <Frame // Container
            className={p.className}
            active={isActive}
            style={p.style}
            icon={p.icon}
            expand={expand}
            tw='WIDGET-FIELD !select-none'
            onMouseDown={(ev) => {
                wasEnabled = !isActive
                ev.stopPropagation()
                p.onValueChange?.(!isActive)
            }}
            onClick={(ev) => {
                // if (!p.onValueChange) return
            }}
        >
            <p tw='w-full text-center line-clamp-1'>{label}</p>
        </Frame>
    )
})
