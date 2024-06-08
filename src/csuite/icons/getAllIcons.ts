import * as icons from '@mdi/js'

import { IconName } from './icons'

export function getAllIcons(): IconName[] {
    return Object.keys(icons) as (keyof typeof icons)[]
}

export function getIconName(ix: number): IconName {
    return getAllIcons()[ix] as IconName
}
