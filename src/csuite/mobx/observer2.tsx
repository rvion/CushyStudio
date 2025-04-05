import type { PropsOf } from '../types/PropsOf'
import type React from 'react'

// eslint-disable-next-line no-restricted-imports
import { observer } from 'mobx-react-lite'

export type FC_<P> = React.FunctionComponent<P> & {
   with(p: Partial<P> | ((t: P) => Partial<P>)): React.FunctionComponent<P>
}

export function obs<P extends object>(
   baseComponent: React.FunctionComponent<P>,
): React.FunctionComponent<P> & {
   with(p: Partial<P> | ((t: P) => Partial<P>)): React.FunctionComponent<P>
}

export function obs<C extends React.FunctionComponent<any>>(
   baseComponent: C,
): C & {
   displayName: string
   with(p: Partial<PropsOf<C>> | ((t: PropsOf<C>) => Partial<PropsOf<C>>)): C
}

export function obs(fn: any): any {
   const ObsFn = observer(fn as any)
   Object.assign(ObsFn, {
      with(args: any) {
         return (p: any): React.JSX.Element => <ObsFn {...{ ...p, ...args }} />
      },
   })
   return ObsFn
}
