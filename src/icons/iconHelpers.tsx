import type { FC } from 'react'

import * as icons from '@mdi/js'
import { Icon } from '@mdi/react'

import { allIcons } from './icons'

type RawIconProps = import('@mdi/react/dist/IconProps.d.ts').IconProps
type MyIconProps = Omit<RawIconProps, 'path'>

export const Ikon: {
    [key in keyof typeof allIcons]: FC<MyIconProps>
} = new Proxy({} as any, {
    get(target, key) {
        if (key in target) return target[key]
        return (target[key] = (p: any) => <Icon path={(allIcons as any)[key]} size={1} {...p} />)
    },
}) as any

export const getAllIcons = () => Object.keys(icons) as (keyof typeof icons)[]
