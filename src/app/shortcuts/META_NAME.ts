import type { KeyName } from './CommandManager'
import type { MouseEvent } from 'react'

const platform = process.platform

export const MOD_KEY = (platform === 'darwin' ? 'cmd' : 'ctrl') as KeyName

export const META_NAME = (platform === 'darwin' ? 'cmd' : 'win') as KeyName

export const hasMod = (ev: MouseEvent<any, any> | KeyboardEvent): boolean => {
    if (platform === 'darwin') return ev.metaKey
    return ev.ctrlKey
}
