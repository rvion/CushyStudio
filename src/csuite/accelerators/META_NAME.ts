import type { KeyName } from '../commands/CommandManager'
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react'

import { getOS } from '../environment/getOS'

const platform = getOS() // process.platform

export const MOD_KEY = (platform === 'Mac' ? 'cmd' : 'ctrl') as KeyName

export const META_NAME = (platform === 'Mac' ? 'cmd' : 'win') as KeyName

export const hasMod = (ev: MouseEvent<any, any> | KeyboardEvent | ReactKeyboardEvent<any>): boolean => {
    if (platform === 'Mac') return ev.metaKey
    return ev.ctrlKey
}
