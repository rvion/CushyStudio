import { observer } from 'mobx-react-lite'

export type FunctionComponentPlus<T> = React.FunctionComponent<T> & {
   with(p: Partial<T> | ((t: T) => Partial<T>)): React.FunctionComponent<T>
}
export const observer2 = <T extends object>(fn: React.FunctionComponent<T>): FunctionComponentPlus<T> => {
   const ObsFn = observer(fn as any)
   Object.assign(ObsFn, {
      with(args: any) {
         return (p: any) => <ObsFn {...{ ...p, ...args }} />
      },
   })
   return ObsFn
}
