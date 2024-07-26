import type { CSSProperties } from 'react'

import { observer } from 'mobx-react-lite'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'

export type ModalShellSize = 'xs' | 'sm' | 'lg' | 'xl'

export const ModalShellUI = observer(function ModalShellUI_(p: {
    size?: ModalShellSize
    title?: React.ReactNode
    className?: string
    style?: CSSProperties
    children?: React.ReactNode
    footer?: React.ReactNode | undefined
    onClick?: (ev: React.MouseEvent<unknown, MouseEvent>) => void
    close: () => void
}) {
    return (
        <Frame
            border
            style={p.style}
            className={p.className}
            tw={['animate-in fade-in', 'p-4 shadow-xl']}
            onClick={(ev) => p.onClick?.(ev)}
        >
            {/* HEADER */}
            <div tw='flex'>
                <div tw='text-xl'>{p.title}</div>
                <div tw='flex-1'></div>
                <Button
                    look='subtle'
                    square
                    icon='mdiClose'
                    onClick={(ev) => {
                        ev.stopPropagation()
                        ev.preventDefault()
                        p.close()
                    }}
                ></Button>
            </div>
            <div className='divider my-0'></div>
            {/* BODY */}
            <div tw='_ModalBody'>{p.children}</div>
            {/* DOOTER */}
            <div tw='_ModalFooter'>{p.footer}</div>
        </Frame>
    )
})
