import type { IconProps } from '@mdi/react/dist/IconProps.d.ts'
import type { FC } from 'react'

import * as IconImport from '@mdi/react'

import { allIcons, type IconName, type IconNameReal } from './icons'

const Icon = IconImport.Icon

type RawIconProps = IconProps
type MyIconProps = Omit<RawIconProps, 'path'>

/**
 * Automagical component you can use like that
 * <Ikon.mdiCancel />
 * <Ikon.mdiAlert size=' />
 */

export const Ikon: {
   [Name in IconNameReal]: FC<MyIconProps>
} = new Proxy({} as any, {
   get(target, key) {
      if (key in target) return target[key]
      return (target[key] = (p: any) => <Icon path={(allIcons as any)[key]} size='1.1em' {...p} />)
   },
}) as any

/** reexport Icon from `@mdi/react` and add siz='1.1em' */
export const IkonOf = function IkonOf_({
   name,
   size,
   ...p
}: { name: IconName } & MyIconProps): React.JSX.Element {
   return (
      <Icon //
         path={(allIcons as any)[name]}
         size={size ?? '1.1em'}
         {...p}
      />
   )
}
