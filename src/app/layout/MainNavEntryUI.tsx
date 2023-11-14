import { observer } from 'mobx-react-lite'
import React, { ReactNode } from 'react'
import { Dropdown } from 'rsuite'
import { TypeAttributes } from 'rsuite/esm/@types/common'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    className?: string
    color?: TypeAttributes.Color
    size?: TypeAttributes.Size
    appearance?: TypeAttributes.Appearance
    ix: string
    icon: React.ReactElement
    soon?: boolean
    label: string
    tooltip?: ReactNode
}) {
    const btn = (
        <Dropdown.Item //
            className={p.className}
            color={p.color}
            // appearance={p.appearance ?? 'subtle'}
            // size={p.size ?? 'sm'}
            // startIcon={p.icon}
            onClick={p.onClick}
        >
            <div className='flex items-center gap-2'>
                {p.icon}
                {p.label}
            </div>
        </Dropdown.Item>
    )
    // if (p.tooltip)
    //     return (
    //         <Whisper delay={0} delayClose={0} delayOpen={0} placement='bottomStart' speaker={<Tooltip>{p.tooltip}</Tooltip>}>
    //             {btn}
    //         </Whisper>
    //     )
    return btn
})
