import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { RSAppearance, RSSize } from './shims'
import { RevealUI } from './RevealUI'

export const Dropdown = (p: {
    className?: string
    startIcon?: Maybe<ReactNode>
    title: ReactNode
    appearance?: Maybe<RSAppearance>
    size?: Maybe<RSSize>
    children: ReactNode
    enableRightClick?: boolean
}) => (
    <RevealUI
        //
        enableRightClick={p.enableRightClick}
        disableHover
        showDelay={300}
        hideDelay={300}
        className='dropdown'
        tw={[p.className]}
    >
        <label tabIndex={0} tw={[`flex-nowrap btn btn-ghost btn-${p.size ?? 'sm'} px-2`]}>
            <span tw='hidden lg:inline-block'>{p.startIcon}</span>
            {p.title}
        </label>
        <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52'>
            {p.children}
        </ul>
    </RevealUI>
)

export const MenuItem = observer(function DropdownItem_(p: {
    onClick?: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => void
    size?: RSSize
    icon?: Maybe<ReactNode>
    disabled?: boolean
    active?: boolean
    className?: string
    children?: ReactNode
    label?: ReactNode
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
                active && 'bg-accent text-accent-content',
                disabled && 'text-neutral-content',
            ]}
            {...rest}
        >
            <div className='flex items-center gap-2'>
                {icon ?? null /*<span className='material-symbols-outlined'>spa</span>*/}
                {label}
                {children}
            </div>
        </li>
    )
})
