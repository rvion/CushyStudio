import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { type FC, type ReactNode, useEffect, useMemo } from 'react'

import { Frame, type FrameProps } from '../frame/Frame'
import { ShelfState } from './ShelfState'
import { ToolShelfState } from './ToolShelfState'
import { Button } from '../button/Button'
import { InputBoolToggleButtonUI } from '../checkbox/InputBoolToggleButtonUI'

//TODO(bird_d): Use the activity system for resizing? Request a way to change the cursor on the fly for activities.

export type ToolShelfPanelState = {
    size: number
    collapsed: boolean
}

export type ToolShelfProps = {
    anchor: 'left' | 'right' | 'top' | 'bottom'
    children?: ReactNode
    className?: string
    defaultSize?: number
    floating?: boolean
    panelState: ToolShelfPanelState
}

export const ToolShelfUI = observer(function ToolShelfUI_(p: ToolShelfProps) {
    const uist = useMemo(() => new ToolShelfState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.end, [])

    const isHorizontal = uist.isHorizontal()
    const isFloating = p.floating ?? false
    const iconSize = cushy.preferences.interface.value.toolBarIconSize

    return (
        <Frame
            className={p.className}
            tw={[
                // Feels hacky, makes sure the resize handle takes up the whole screen when dragging to not cause cursor flickering.
                !uist.dragging && 'relative',
                'flex-none',
                isFloating && '!absolute !bg-transparent',
                `${p.anchor}-0 ${isHorizontal ? 'top-0' : 'left-0'}`,
                uist.dragging ? '!bg-red-500' : '!bg-purple-500',
            ]}
            // base={{ contrast: 0.1 }}
            style={{
                width: isHorizontal ? uist.props.panelState.size + Math.round(p.panelState.size / iconSize) * 16 : 'unset',
                height: !isHorizontal ? uist.props.panelState.size + 16 : 'unset',
            }}
        >
            <div //Resize Handle Area
                tw={[
                    'absolute select-none',
                    uist.dragging && '!top-0 !left-0',
                    isHorizontal ? 'hover:cursor-ew-resize' : 'hover:cursor-ns-resize',
                ]}
                style={{
                    width: uist.dragging ? '100%' : isHorizontal ? 6 : '100%',
                    height: uist.dragging ? '100%' : !isHorizontal && !uist.dragging ? 6 : '100%',
                    [uist.computeResizeAnchor()]: '-3px',
                }}
                onMouseDown={(ev) => {
                    if (ev.button != 0) {
                        return
                    }

                    uist.begin()
                }}
            />
            {p.children}
        </Frame>
    )
})

function getFlex(pState: ToolShelfPanelState) {
    const size = cushy.preferences.interface.value.toolBarIconSize
    if (pState.size < size * 2 && pState.size > size) {
        return 'flex-row'
    }
    return 'flex-col'
}

export const ToolShelfGroupUI = observer(function ToolShelfGroupUI_(p: { panelState: ToolShelfPanelState; children: ReactNode }) {
    return (
        <div
            tw={[
                //
                'flex gap-1',
                getFlex(p.panelState),
            ]}
        >
            {p.children}
        </div>
    )
})

export const ToolShelfButtonUI = observer(function ToolShelfButtonUI_(
    p: { panelState: ToolShelfPanelState; text?: string; value?: boolean } & FrameProps,
) {
    const iconSize = cushy.preferences.interface.value.toolBarIconSize
    const expand = p.panelState.size > iconSize * 2
    return (
        <InputBoolToggleButtonUI //
            style={{
                //
                width: `${!expand ? iconSize : p.panelState.size}px`,
                height: `${iconSize}px`,
            }}
            value={p.value}
            icon={p.icon}
            text={expand ? p.text : undefined}
        />
    )
})
