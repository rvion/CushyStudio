// ---------------------------------------------------------------------

import { command } from '../Command'
import { ctx_global } from '../contexts/ctx_global'
import { menuWithoutProps, type MenuWithoutProps } from '../menu/Menu'
import { Trigger } from '../RET'

export const menu_utils: MenuWithoutProps = menuWithoutProps({
    title: 'Utils',
    entries: () => [
        //
        cmd_nav_openGallery1,
        cmd_nav_openGallery2,
        cmd_nav_openGallery3,
        cmd_nav_openCivitaiPanel,
        menu_utils.bind({}),
    ],
})

const cmd_nav_openGallery = (ix?: number) => {
    return command({
        id: `nav.openGallery${ix ?? ''}`,
        label: `Open Gallery ${ix ?? ''}`,
        ctx: ctx_global,
        combos: ['mod+g mod+g mod+' + (ix ?? 1)],
        action: (p) => {
            cushy.layout.FOCUS_OR_CREATE('Gallery', { uid: ix })
            return Trigger.Success
        },
    })
}

export const cmd_nav_openIcons = command({
    id: `nav.openIcons`,
    label: `Open Icons`,
    ctx: ctx_global,
    combos: ['mod+i'],
    action: (p) => {
        cushy.layout.FOCUS_OR_CREATE('Icons', {})
        return Trigger.Success
    },
})

export const cmd_nav_openGallery1 = cmd_nav_openGallery()
export const cmd_nav_openGallery2 = cmd_nav_openGallery(2)
export const cmd_nav_openGallery3 = cmd_nav_openGallery(3)
export const cmd_nav_openCivitaiPanel = command({
    id: 'nav.openCivitaiPanel',
    label: 'Open Civitai Panel',
    ctx: ctx_global,
    action: () => {
        cushy.layout.FOCUS_OR_CREATE('Models', {})
        return Trigger.Success
    },
})
