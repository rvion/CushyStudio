import type { Tint } from '../kolor/Tint'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'

import { Frame, type FrameProps } from '../frame/Frame'
import { ShelfState } from './ShelfState'
import { useCSuite } from '../ctx/useCSuite'

export type ShelfProps = FrameProps & OwnShelfProps

export type OwnShelfProps = {
    anchor: 'left' | 'right' | 'top' | 'bottom'
    defaultSize?: number
    floating?: boolean
}

//TODO(bird_d): Use the activity system for resizing, request a way to change the cursor on the fly for activities.
export const _BasicShelfUI = observer(function BasicShelf({
    // own props
    anchor,
    defaultSize,
    floating = false,

    // children and size need to not be passed since we'll add an extra children and modify the style
    children,
    style,

    // remaining props
    ...rest
}: ShelfProps) {
    // ShelfState has some makeAutoObserable in it; let's make sure we're not passing jsx element or heaving objects
    const uist = useMemo(() => new ShelfState({ anchor, defaultSize, floating }), [])

    // ensure new properties that could change during lifetime of the component stays up-to-date in the stable state.
    useEffect(() => uist.syncProps({ anchor, defaultSize, floating }), [anchor, defaultSize, floating])

    // ensure any unmounting of this component will properly clean-up
    useEffect(() => uist.end, [])

    const isHorizontal = uist.isHorizontal()

    return (
        <Frame
            {...rest}
            style={{
                width: isHorizontal ? uist.size : 'unset',
                height: !isHorizontal ? uist.size : 'unset',
                ...style,
            }}
            // tw is always overridable because of the magic in src/csuite/custom-jsx/jsx-dev-runtime.js
            tw={[
                // Feels hacky, makes sure the resize handle takes up the whole screen when dragging to not cause cursor flickering.
                !uist.dragging && 'relative',
                'flex-none',
                floating && '!absolute !bg-transparent',
                `${anchor}-0 ${isHorizontal ? 'top-0' : 'left-0'}`,
            ]}
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
            {children}
        </Frame>
    )
})

const BasicShelf_ColumnUI = observer(function BasicShelf_Column(
    //
    p: React.HTMLAttributes<HTMLDivElement>,
) {
    return <div tw='flex flex-col p-2 gap' {...p}></div>
})

const BasicShelf_GroupUI = observer(function BasicShelf_Group({
    align,
    children,
    ...tint
}: { align?: boolean; children?: ReactNode } & Tint) {
    const csuite = useCSuite()
    const dropShadow = cushy.theme.value.inputShadow

    return (
        <Frame
            col
            base={tint}
            border
            roundness={csuite.inputRoundness}
            dropShadow={dropShadow}
            tw={[
                // bird_d: Maybe should be aligned by default?
                align && 'overflow-clip flex [&>*]:!rounded-none [&>*]:!border-0 !gap-0 [&>*]:h-input',
                '[&>*]:!border-none',
            ]}
        >
            {children}
        </Frame>
    )
})

export const BasicShelfContentUI = observer(function BasicShelfContentUI_(p: React.HTMLAttributes<HTMLDivElement>) {
    return <div tw='flex flex-1 p-2 overflow-auto' {...p} />
})

export const BasicShelfUI = Object.assign(_BasicShelfUI, {
    // name: 'BasicShelfUI',
    Group: BasicShelf_GroupUI,
    Column: BasicShelf_ColumnUI,
    Content: BasicShelfContentUI,
})

// let XXX = <BasicShelfUI />
// console.log(`[🤠] `, BasicShelfUI, XXX?.type?.name, XXX?.type?.type?.name)
// debugger
