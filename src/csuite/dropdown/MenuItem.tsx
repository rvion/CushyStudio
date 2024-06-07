import type { CushyShortcut } from '../../app/accelerators/CommandManager'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { ComboUI } from '../../app/accelerators/ComboUI'
import { Frame } from '../frame/Frame'

export const MenuItem = observer(function DropdownItem_(p: {
    onClick?: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => void
    /** ⚠️ unused for now */
    size?: 'sm' | 'xs' | 'md' | 'lg'
    icon?: Maybe<ReactNode>
    disabled?: boolean
    active?: boolean
    className?: string
    children?: ReactNode
    label?: ReactNode
    shortcut?: CushyShortcut
}) {
    const { size, label, disabled, icon, children, active, onClick, ...rest } = p
    return (
        <Frame
            text={{ contrast: disabled ? 0.5 : 1 }}
            base={{
                contrast: active ? 0.1 : 0,
                chroma: active ? 0.1 : undefined,
            }}
            hover
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                p.onClick?.(ev)
            }}
            style={{ lineHeight: '1.6rem' }}
            tw={['_MenuItem', 'px-2 py-0.5 flex items-center gap-2 whitespace-nowrap cursor-pointer']}
            {...rest}
        >
            {icon}
            {label}
            {children}
            {p.shortcut ? <div tw='ml-auto pl-2 text-xs italic'>{p.shortcut && <ComboUI combo={p.shortcut} />}</div> : null}
        </Frame>
    )
})