import { ctx_global } from '../csuite/command-topic/ctx_global'
import { command } from '../csuite/commands/Command'
import { menuWithoutProps, menuWithProps } from '../csuite/menu/Menu'
import { Trigger } from '../csuite/trigger/Trigger'

const helpCommands = [
    command({
        id: 'help.openGithub',
        description: 'Open Github in your default web browser',
        label: 'Open Github',
        combos: 'mod+shift+h 1',
        ctx: ctx_global,
        icon: 'mdiGithub',
        action: () => {
            void window.require('electron').shell.openExternal('https://github.com/rvion/CushyStudio#readme')
            return Trigger.Success
        },
    }),
    command({
        id: 'help.openWebsite',
        description: 'Open CushyStudio Website in your default web browser',
        label: 'Open Website',
        combos: 'mod+shift+h 2',
        icon: 'mdiGithub',
        ctx: ctx_global,
        action: () => {
            void window.require('electron').shell.openExternal('https://www.CushyStudio.com')
            return Trigger.Success
        },
    }),
    command({
        id: 'help.openBlog',
        description: 'Open CushyStudio blog in your default web browser',
        label: 'Open blog',
        combos: 'mod+shift+h 3',
        icon: 'mdiPost',
        ctx: ctx_global,
        action: () => {
            void window.require('electron').shell.openExternal('https://www.CushyStudio.com/blog')
            return Trigger.Success
        },
    }),
]

export const MenuHelpV2 = menuWithoutProps({
    title: 'Help',
    entries: () => helpCommands,
})
