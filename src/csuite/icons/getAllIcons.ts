import type { IconName } from './IconName'
import type { IconNameReal } from './icons'

import * as icons from '@mdi/js'

let _icons: string[] | undefined

export function getAllIcons(): IconName[] {
   return (_icons ??= Object.keys(icons)) as any as IconName[]
}

export function getNthIconName(ix: number): IconName {
   return getAllIcons()[ix] as IconName
}
