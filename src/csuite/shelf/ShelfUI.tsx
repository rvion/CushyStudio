import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { type FC, type ReactNode, useEffect, useMemo } from 'react'

import { Frame } from '../frame/Frame'
import { ShelfState } from './ShelfState'

//TODO(bird_d): Use the activity system for resizing, request a way to change the cursor on the fly for activities.

export type ShelfProps = {
    anchor: 'left' | 'right' | 'top' | 'bottom'
    children?: ReactNode
    className?: string
    defaultSize?: number
    floating?: boolean
}

export const BasicShelfUI = observer(function BasicShelfUI_(p: ShelfProps) {
    const uist = useMemo(() => new ShelfState(p), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    runInAction(() => Object.assign(uist.props, p))

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.end, [])

    const isHorizontal = uist.isHorizontal()
    const isFloating = p.floating ?? false

    return (
        <Frame
            className={p.className}
            tw={[
                // Feels hacky, makes sure the resize handle takes up the whole screen when dragging to not cause cursor flickering.
                !uist.dragging && 'relative',
                'flex-none',
                isFloating && '!absolute !bg-transparent',
                `${p.anchor}-0 ${isHorizontal ? 'top-0' : 'left-0'}`,
            ]}
            // base={{ contrast: 0.1 }}
            style={{
                width: isHorizontal ? uist.size : 'unset',
                height: !isHorizontal ? uist.size : 'unset',
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
