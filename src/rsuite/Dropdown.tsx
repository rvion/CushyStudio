import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'
import { RSAppearance, RSSize } from './RsuiteTypes'
import { RevealUI } from './reveal/RevealUI'
import { ComboUI } from 'src/app/shortcuts/ComboUI'
import { CushyShortcut } from 'src/app/shortcuts/ShortcutManager'

export const Dropdown = (p: {
    className?: string
    startIcon?: Maybe<ReactNode>
    title: ReactNode
    appearance?: Maybe<RSAppearance>
    children: ReactNode
    enableRightClick?: boolean
}) => (
    <RevealUI enableRightClick={p.enableRightClick} disableHover className='dropdown' tw={[p.className]}>
        <label
            // style={{
            //     minHeight: '1.5rem',
            //     height: '1.5rem',
            // }}
            tabIndex={0}
            tw={[`flex-nowrap btn btn-ghost btn-sm px-2`]}
        >
            <span tw='hidden lg:inline-block'>{p.startIcon}</span>
            {p.title}
        </label>
        <ul tabIndex={0} tw='shadow menu dropdown-content z-[1] bg-base-100 rounded-box'>
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
            <div className='flex items-center gap-2'>
                {icon ?? null /*<span className='material-symbols-outlined'>spa</span>*/}
                {label}
                {children}
                {p.shortcut ? <div tw='ml-auto pl-2 text-xs italic'>{p.shortcut && <ComboUI combo={p.shortcut} />}</div> : null}
            </div>
        </li>
    )
})
