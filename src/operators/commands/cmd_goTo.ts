// ---------------------------------------------------------------------

import { ctx_global } from '../../csuite/command-topic/ctx_global'
import { command, type Command } from '../../csuite/commands/Command'
import { defineMenu, type Menu } from '../../csuite/menu/Menu'
import { Trigger } from '../../csuite/trigger/Trigger'

export const menu_utils: Menu = defineMenu({
    title: 'Utils',
    entries: () => [
        //
        cmd_nav_openGallery1,
        cmd_nav_openGallery2,
        cmd_nav_openGallery3,
        cmd_nav_openCivitaiPanel,
        menu_utils,
    ],
})

const cmd_nav_openGallery = (ix?: number): Command<null> => {
    return command({
        id: `nav.openGallery${ix ?? ''}`,
        label: `Open Gallery ${ix ?? ''}`,
        ctx: ctx_global,
        combos: ['mod+g mod+g mod+' + (ix ?? 1)],
        action: (p) => {
            cushy.layout.open('Gallery', { uid: ix })
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
        cushy.layout.open('Icons', {})
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
        cushy.layout.open('Models', {})
        return Trigger.Success
    },
})
