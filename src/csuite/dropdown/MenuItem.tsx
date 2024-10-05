import type { CushyShortcut } from '../commands/CommandManager'
import type { IconName } from '../icons/icons'
import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'

import { ComboUI } from '../accelerators/ComboUI'
import { Frame } from '../frame/Frame'
import { IkonOf } from '../icons/iconHelpers'

export const _MenuItem = observer(function DropdownItem_(p: {
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
    loading?: boolean
    /** right before the (menu shortcust) */
    localShortcut?: CushyShortcut
    globalShortcut?: CushyShortcut
    beforeShortcut?: ReactNode
    afterShortcut?: ReactNode
    stopPropagation?: boolean
}) {
    // prettier-ignore
    const {
        //
        stopPropagation,
        size, label, disabled, icon, children, active,
        localShortcut, globalShortcut, beforeShortcut, afterShortcut,
        onClick,
        ...rest
    } = p
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
                // ev.preventDefault()
                if (stopPropagation) ev.stopPropagation()
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
                {beforeShortcut}
                {localShortcut ? (
                    <div tw='ml-auto pl-2 text-xs italic'>{localShortcut && <ComboUI combo={localShortcut} />}</div>
                ) : null}
                {globalShortcut ? (
                    <div tw='ml-auto pl-2 text-xs italic'>{globalShortcut && <ComboUI combo={globalShortcut} />}</div>
                ) : null}
                {afterShortcut}
            </div>
        </Frame>
    )
})

export const MenuDivider = observer(function Divider_(p: { children?: ReactNode }) {
    return <div className='divider px-2 !h-input my-2 text-sm'>{p.children ?? <></>}</div>
})

export const MenuItem = Object.assign(_MenuItem, {
    // name: 'BasicShelfUI',
    Divider: MenuDivider,
})
