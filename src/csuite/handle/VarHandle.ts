import type { IReactionDisposer } from 'mobx'

export type VarHandle<X extends any> = {
   get: () => Maybe<X>
   set: (x: X) => void
   setNull?: () => void
   /** default value */
   default?: X
   disposer?: Maybe<IReactionDisposer>
}
