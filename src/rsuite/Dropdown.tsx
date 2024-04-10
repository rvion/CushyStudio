import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { ComboUI } from '../app/shortcuts/ComboUI'
import { CushyShortcut } from '../app/shortcuts/CommandManager'
import { RevealUI } from './reveal/RevealUI'

export const Dropdown = (p: {
    //
    className?: string
    startIcon?: Maybe<ReactNode>
    title: ReactNode
    content?: () => ReactNode
}) => (
    <RevealUI
        className='dropdown'
        tw={[p.className]}
        content={() => (
            <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
                {p.content?.()}
            </ul>
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
        <li
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                p.onClick?.(ev)
            }}
            tw={[
                //
                '_MenuItem',
                active && 'bg-primary text-primary-content',
                disabled && 'text-neutral-content',
            ]}
            {...rest}
        >
            <div className='flex items-center gap-2 whitespace-nowrap'>
                {icon ?? null /*<span className='material-symbols-outlined'>spa</span>*/}
                {label}
                {children}
                {p.shortcut ? <div tw='ml-auto pl-2 text-xs italic'>{p.shortcut && <ComboUI combo={p.shortcut} />}</div> : null}
            </div>
        </li>
    )
})
