import type { IconNameReal } from './icons'

import * as icons from '@mdi/js'

let _icons: string[] | undefined

export function getAllIcons(): IconNameReal[] {
   return (_icons ??= Object.keys(icons)) as IconNameReal[]
}

export function getNthIconName(ix: number): IconNameReal {
   return getAllIcons()[ix] as IconNameReal
}
