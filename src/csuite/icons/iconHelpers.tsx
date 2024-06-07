import type { FC, MouseEventHandler } from 'react'

import IconA from '@mdi/react'

import { allIcons, type IconName } from './icons'

const Icon = IconA ?? (((await import('@mdi/react')) as any).default.Icon as typeof import('@mdi/react').Icon)

type RawIconProps = import('@mdi/react/dist/IconProps.d.ts').IconProps
type MyIconProps = Omit<RawIconProps, 'path'>

/**
 * Automagical component you can use like that
 * <Ikon.mdiCancel />
 * <Ikon.mdiAlert size=' />
 *
 */
export const Ikon: {
    [key in keyof typeof allIcons]: FC<MyIconProps>
} = new Proxy({} as any, {
    get(target, key) {
        if (key in target) return target[key]
        return (target[key] = (p: any) => <Icon path={(allIcons as any)[key]} size='1.1em' {...p} />)
    },
}) as any

/** reexport Icon from `@mdi/react` and add siz='1.1em' */
export const IkonOf = function IkonOf_({ name, ...p }: { name: IconName } & MyIconProps) {
    return (
        <Icon //
            path={(allIcons as any)[name]}
            size='1.1em'
            {...p}
        />
    )
}