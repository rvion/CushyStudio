import type { IconName } from '../icons/icons'
import type { Tint } from '../kolor/Tint'

import { observer } from 'mobx-react-lite'
import { ReactNode } from 'react'

import { Button } from '../button/Button'
import { Frame } from '../frame/Frame'
import { RevealUI } from '../reveal/RevealUI'
import { MenuDivider, MenuItem } from './MenuItem'

export type DropdownProps = {
    title: ReactNode
    className?: string
    startIcon?: Maybe<IconName>
    theme?: Tint
    content?: () => ReactNode
    button?: ReactNode
    expand?: boolean
}

/**
 * dropdown are just a pre-configured Reveal with a bunch of associated components that make it easy
 * to build menus
 * see modules like `src/appbar/MenuDebugUI.tsx`
 */
export const _Dropdown = observer(function Dropdown(p: DropdownProps): JSX.Element {
    return (
        <RevealUI
            tw={[p.className]}
            hideTriggers={{ shellClick: true, backdropClick: true, escapeKey: true }}
            content={() => <Frame tabIndex={0} tw='flex flex-col z-[1]' children={p.content?.()} />}
            children={
                p.button ?? <Button borderless subtle icon={p.startIcon} tabIndex={0} expand={p.expand} children={p.title} />
            }
        />
    )
})

export const Dropdown = Object.assign(_Dropdown, {
    // name: 'BasicShelfUI',
    Divider: MenuDivider,
    Item: MenuItem,
})
