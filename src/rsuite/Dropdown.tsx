import type { CushyShortcut } from '../app/shortcuts/CommandManager'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { ComboUI } from '../app/shortcuts/ComboUI'
import { Box } from '../theme/colorEngine/Box'
import { RevealUI } from './reveal/RevealUI'

export const Dropdown = (p: {
    //
    className?: string
    startIcon?: Maybe<ReactNode>
    title: ReactNode
    content?: () => ReactNode
}) => (
    <RevealUI
        tw={[p.className]}
        content={() => (
            <Box base={-5} tabIndex={0} tw='shadow z-[1] bg-base-100 rounded-box'>
                {p.content?.()}
            </Box>
        )}
    >
        <label tabIndex={0} tw={[`flex-nowrap btn btn-ghost btn-sm gap-1 py-0 px-1.5`]}>
            {p.startIcon && <span tw='hidden lg:inline-block'>{p.startIcon}</span>}
            {p.title}
        </label>
    </RevealUI>
)

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
    // const active2 = Math.random() > 0.5
    return (
        <Box
            text={{ contrast: disabled ? 0.5 : 1 }}
            base={{
                contrast: active ? 0.9 : 0.05,
                chroma: active ? 0.5 : undefined,
            }}
            hover
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                p.onClick?.(ev)
            }}
            style={{ lineHeight: '1.6rem' }}
            tw={['_MenuItem', 'px-1 flex items-center gap-2 whitespace-nowrap cursor-pointer']}
            {...rest}
        >
            {icon}
            {label}
            {children}
            {p.shortcut ? <div tw='ml-auto pl-2 text-xs italic'>{p.shortcut && <ComboUI combo={p.shortcut} />}</div> : null}
        </Box>
    )
})
