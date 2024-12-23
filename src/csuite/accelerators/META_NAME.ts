import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react'

import { getOS } from '../environment/getOS'

const platform = getOS() // process.platform

export const MOD_KEY = (platform === 'Mac' ? 'cmd' : 'ctrl') as 'cmd' | 'ctrl'
export const META_NAME = (platform === 'Mac' ? 'cmd' : 'win') as 'cmd' | 'win'

export const hasMod = (ev: MouseEvent<any, any> | KeyboardEvent | ReactKeyboardEvent<any>): boolean => {
   if (platform === 'Mac') return ev.metaKey
   return ev.ctrlKey
}
