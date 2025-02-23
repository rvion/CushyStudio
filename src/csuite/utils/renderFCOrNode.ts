import { createElement, type ReactNode } from 'react'

export type FCOrNode<P extends object> = React.FunctionComponent<P> | React.ReactNode

/** render */
export const renderFCOrNode = <T extends object>(x: FCOrNode<T>, props: NoInfer<T>): React.ReactNode => {
   if (_isFC<T>(x)) return createElement(x, props)
   return x
}

/** render with wrapper */
export const renderFCOrNodeWithWrapper = <
   //
   T extends object,
   U extends object,
>(
   //
   x: FCOrNode<T>,
   props: NoInfer<T>,
   wrapper: Maybe<FCOrNode<U>>,
   wrapperProps: NoInfer<U>,
): ReactNode => {
   // if wrapper is already rendered, let's skip the content
   if (!_isFC<U>(wrapper) && wrapper != null) return wrapper

   const inner = _isFC<T>(x) ? createElement(x, props) : x
   if (inner == null) return null
   if (wrapper == null) return inner

   // if (!isValidElement(inner)) {
   //     console.error(`[💄] inner is not valid element:`, inner)
   //     return createElement('div', {}, '💄 inner is not valid element')
   // }
   return createElement(wrapper, wrapperProps, inner)
}

export const _isFC = <T extends object>(x: any): x is React.FunctionComponent<T> => {
   // if it's a simple function , it's probably some FC
   if (typeof x === 'function') return true

   // if it's a memo (x[$$typeof]=== Symbol(react.memo))), it's probably some FC
   if (
      //
      typeof x === 'object' &&
      x &&
      '$$typeof' in x &&
      x['$$typeof'] === Symbol.for('react.memo')
   )
      return true

   return false
}
