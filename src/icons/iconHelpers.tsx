import type { FC } from 'react'

import * as icons from '@mdi/js'
import { Icon } from '@mdi/react'

type RawIconProps = import('@mdi/react/dist/IconProps.d.ts').IconProps
type MyIconProps = Omit<RawIconProps, 'path'>

export const Ikon: {
    [key in keyof typeof icons]: FC<MyIconProps>
} = new Proxy({} as any, {
    get(target, key) {
        if (key in target) return target[key]
        return (target[key] = (p: any) => <Icon path={(icons as any)[key]} size={1} {...p} />)
    },
}) as any
