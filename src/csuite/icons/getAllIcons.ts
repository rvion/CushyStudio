import * as icons from '@mdi/js'

import { IconName } from './icons'

let _icons
export function getAllIcons(): IconName[] {
    return (_icons ??= Object.keys(icons)) as (keyof typeof icons)[]
}

export function getNthIconName(ix: number): IconName {
    return getAllIcons()[ix] as IconName
}
