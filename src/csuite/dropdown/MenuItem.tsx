import type { CushyShortcut } from '../commands/CommandManager'
import type { IconName } from '../icons/icons'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { ComboUI } from '../accelerators/ComboUI'
import { Frame } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'

export const MenuItem = observer(function DropdownItem_(p: {
    onClick?: (ev: React.MouseEvent<HTMLElement, MouseEvent>) => unknown
    /** ⚠️ unused for now */
    size?: 'sm' | 'xs' | 'md' | 'lg'
    icon?: Maybe<IconName>
    iconClassName?: Maybe<string>
    disabled?: boolean
    active?: boolean
    className?: string
    children?: ReactNode
    label?: ReactNode
    localShortcut?: CushyShortcut
    globalShortcut?: CushyShortcut
    loading?: boolean
    /** right before the (menu shortcust) */
    beforeShortcut?: ReactNode
    afterShortcut?: ReactNode
}) {
    const { size, label, disabled, icon, children, active, onClick, ...rest } = p
    return (
        <Frame
            loading={p.loading}
            text={{ contrast: disabled ? 0.5 : 1 }}
            base={{
                contrast: active ? 0.1 : 0,
                chroma: active ? 0.1 : undefined,
            }}
            // hover={{ contrast: 0.15, chroma: 0.2, hueShift: 180 }}
            hover={15}
            onClick={(ev) => {
                ev.preventDefault()
                ev.stopPropagation()
                return p.onClick?.(ev)
            }}
            style={{ lineHeight: '1.6rem' }}
            tw={[
                //
                '_MenuItem ',
                'px-2 py-0.5 flex items-center gap-2 whitespace-nowrap cursor-pointer',
                // Grid this so we have a consistent icon width and every label lines up
                'grid grid-cols-[18px_1fr]',
            ]}
            {...rest}
        >
            {icon ? ( //
                <IkonOf name={icon /* ?? '_' */} className={p.iconClassName ?? undefined} />
            ) : (
                <div />
            )}
            {/* <div tw='flex h-full items-center'>{icon}</div> */}
            {/* {icon} */}
            <div tw='flex items-center'>
                {label}
                {children}
                {p.beforeShortcut}
                {p.localShortcut ? (
                    <div tw='ml-auto pl-2 text-xs italic'>{p.localShortcut && <ComboUI combo={p.localShortcut} />}</div>
                ) : null}
                {p.globalShortcut ? (
                    <div tw='ml-auto pl-2 text-xs italic'>{p.globalShortcut && <ComboUI combo={p.globalShortcut} />}</div>
                ) : null}
                {p.afterShortcut}
            </div>
        </Frame>
    )
})

export const MenuDivider = observer(function Divider_(p: { children?: ReactNode }) {
    return <div className='divider px-2 !h-input my-2 text-sm'>{p.children ?? <></>}</div>
})
// Can we do subcomponents somehow?
// MenuItem.Divider = Divider
