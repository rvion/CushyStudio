import React, { createElement, isValidElement, type ReactNode } from 'react'

// legacy type:
// export type FCOrNode<P extends object> = React.FunctionComponent<P> | React.ReactNode

// this explicity avoid strings, to allow for foture magic
// prettier-ignore
export type SimpleReactNode =
   | React.JSX.Element
   | string
   | number
   | boolean
   | null
   | undefined

export type SimpleReactComponent<P> = React.FunctionComponent<P>
// export type SimpleReactComponent<P> = CovariantFn<[props: P], React.JSX.Element>

// prettier-ignore
export type FCOrNode<P extends object> =
    | SimpleReactComponent<P>
    | SimpleReactNode

// prettier-ignore
export type FCOrNode__<P extends object> =
   | SimpleReactComponent<P>
   | ReactNode

export type FCOrJSXOrNamed<P extends object, Named extends string> =
   | SimpleReactComponent<P>
   | SimpleReactNode
   | Named

/** render */
export const renderFCOrNode = <T extends object>(
   //
   x: FCOrNode__<T>,
   props: NoInfer<T>,
): ReactNode => {
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
): SimpleReactNode => {
   // if wrapper is already rendered, let's skip the content
   if (wrapper != null && _isSimpleReactNode(wrapper)) return wrapper

   const inner = _isFC<T>(x) ? createElement(x, props) : x
   if (inner == null) return null
   if (wrapper == null) return inner

   // if (!isValidElement(inner)) {
   //     console.error(`[💄] inner is not valid element:`, inner)
   //     return createElement('div', {}, '💄 inner is not valid element')
   // }
   return createElement(wrapper, wrapperProps, inner)
}

export const _isSimpleReactNode = (x: any): x is SimpleReactNode => {
   if (x == null) return true
   if (typeof x === 'string' || typeof x === 'number' || typeof x === 'boolean') return true
   if (isValidElement(x)) return true
   return false
}

export const _isFC = <T extends object>(x: any): x is SimpleReactComponent<T> => {
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
