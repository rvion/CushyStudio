import { type IObserverOptions, observer } from 'mobx-react-lite'

/** same as observer, but accept a second parameter to set nested sub-components */
export const observerWC = <
   /** component props */
   P extends object,
   /** nested components */
   Sub extends Record<string, React.FunctionComponent<any>>,
>(
   baseComponent: React.FunctionComponent<P>,
   subComponents?: Sub,
   options?: IObserverOptions,
): React.FunctionComponent<P> & Sub => {
   return Object.assign(observer(baseComponent, options), subComponents)
}
