import { observer } from 'mobx-react-lite'
import React, { ReactNode } from 'react'
import { DropdownItem, TypeAttributes } from 'src/rsuite/shims'

export const MainNavEntryUI = observer(function UI_(p: {
    onClick: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    className?: string
    color?: TypeAttributes['Color']
    size?: TypeAttributes['Size']
    appearance?: TypeAttributes['Appearance']
    icon: React.ReactElement
    soon?: boolean
    label: string
    tooltip?: ReactNode
}) {
    return (
        <DropdownItem //
            className={p.className}
            color={p.color}
            onClick={p.onClick}
        >
            <div className='flex items-center gap-2'>
                {/* {p.onClick ? '🟢' : '❌'} */}
                {p.icon}
                {p.label}
            </div>
        </DropdownItem>
    )
    // if (p.tooltip)
    //     return (
    //         <Whisper delay={0} delayClose={0} delayOpen={0} placement='bottomStart' speaker={<Tooltip>{p.tooltip}</Tooltip>}>
    //             {btn}
    //         </Whisper>
    //     )
    // return btn
})
