import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ReactNode, useMemo } from 'react'

import { IkonOf } from '../../../icons/iconHelpers'
import { PanelHeaderUI } from '../../../panels/PanelHeader'
import { Frame, type FrameProps } from '../../../rsuite/frame/Frame'

/* Used once per widget since they should not conflict. */
let startValue = 0
let offset = 0

type ResizableFrameProps = {
    /** The size of the container content */
    currentSize: number

    /** Returns an absolute value by default, use `relative` to make it return the mouse's movement */
    onResize: (val: number) => void

    header?: ReactNode
    footer?: ReactNode

    /** When true, return relative mouse movement (e.movementY), else return the starting value + offset */
    relative?: boolean

    /**
     * Pixel interval to snap to.
     * Ignored for relative movement
     * */
    snap?: number // TODO(bird_d): This should snap by h-input's height when undefined
} & FrameProps

class ResizableFrameStableState {
    constructor(public props: ResizableFrameProps) {
        makeAutoObservable(this)
    }

    start = (val: number) => {
        startValue = val
        offset = 0
        window.addEventListener('mousemove', this.resize, true)
        window.addEventListener('pointerup', this.stop, true)
    }

    stop = () => {
        window.removeEventListener('mousemove', this.resize, true)
        window.removeEventListener('pointerup', this.stop, true)
    }

    resize = (e: MouseEvent) => {
        if (this.props.relative) {
            return this.props.onResize(e.movementY)
        }

        offset += e.movementY
        let next = startValue + offset

        if (this.props.snap) {
            next = Math.round(next / this.props.snap) * this.props.snap
        }
        this.props.onResize(next)
    }
}

export const ResizableFrame = observer(function ResizableFrame_(p: ResizableFrameProps) {
    // create stable state, that we can programmatically mutate witout caring about stale references
    const uist = useMemo(() => new ResizableFrameStableState(p), [])

    return (
        <Frame hover tw='flex flex-col !p-0' {...p} style={{ gap: '0px' }}>
            {p.header && <PanelHeaderUI>{p.header}</PanelHeaderUI>}
            <Frame // Content
                tw='w-full overflow-clip'
                style={{
                    height: `${p.currentSize}px`,
                    borderBottomLeftRadius: '0px',
                    borderBottomRightRadius: '0px',
                    padding: '0px !important',
                }}
            >
                {p.children}
            </Frame>
            <Frame
                //
                tw='w-full'
                base={{ contrast: 0.2 }}
                style={{ borderRadius: '0px', height: '1px' }}
            ></Frame>
            <Frame // Footer
                className='h-input w-full relative'
                // hover
            >
                <div tw='absolute w-full h-full'>
                    <Frame
                        hover
                        tw='!flex w-full h-full items-center justify-center cursor-ns-resize'
                        onMouseDown={() => uist.start(p.currentSize)}
                    >
                        <IkonOf name='mdiDragHorizontalVariant'></IkonOf>
                    </Frame>
                </div>
                <div tw='z-10 px-1 h-full items-center justify-center'>{p.footer}</div>
            </Frame>
        </Frame>
    )
})
