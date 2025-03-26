// import type { WidgetsCatalogProps } from '../../csuite-cushy/presenters/RenderCatalog'
import type { CovariantFn } from '../variance/BivariantHack'

import React, { createElement, isValidElement, type ReactNode } from 'react'

// legacy type:
// export type FCOrNode<P extends object> = React.FunctionComponent<P> | React.ReactNode

// this explicity avoid strings, to allow for foture magic
// prettier-ignore
export type SimpleReactNode =
   | React.JSX.Element
   | number
   | boolean
   | null
   | undefined
// | string <--- ❌  disabled so we reserve string for named components

export type SimpleReactComponent<P> = CovariantFn<[props: P], ReactNode | Promise<ReactNode>>
// export type SimpleReactComponent<P> = CovariantFn<[props: P], React.JSX.Element>
// export type SimpleReactComponent<P> = React.FunctionComponent<P>

// prettier-ignore
export type FCOrNode<P extends object> =
    | SimpleReactComponent<P>
    | SimpleReactNode

// prettier-ignore
export type FCOrNode__<P extends object> =
   | SimpleReactComponent<P>
   | ReactNode

// prettier-ignore
// export type FCOrNodeOrNamed<
//    P extends object,
//    SUBCATALOG,
// > =
//    | SimpleReactComponent<P>
//    | SimpleReactNode
//    | keyof SUBCATALOG
//    | SimpleNamedComponentWithPropsOverride<SUBCATALOG>

// export type SimpleNamedComponentWithPropsOverride<SUBCATALOG> = {
//    [K in keyof SUBCATALOG]?: Partial<PropsOf<SUBCATALOG[K]>>
// }
// export function isNamed<NAME extends keyof CATALOG.widgets>(x: FCOrJSXOrNamed<any, NAME>): x is NAME {
//    return typeof x === 'string'
// }

/** render */
export const renderFCOrNode = <T extends object>(
   //
   x: FCOrNode__<T>,
   props: NoInfer<T>,
   ...children: ReactNode[]
): ReactNode => {
   if (_isFC<T>(x)) return createElement(x, props, ...children)
   return x
}

// 💬 2025-03-26 rvion:
// this was very cool, compatible with locomotive uiui notation, but way faster
// at the type-level... BUT why? the component.with syntax is just better.
//
// | export const renderFCOrNodeOrNamed = <T extends object>(
// |    //
// |    x: FCOrNode__<T> | object,
// |    props: NoInfer<T>,
// |    subcatalog: any,
// |    ...children: ReactNode[]
// | ): ReactNode => {
// |    // 1. regular FC
// |    if (_isFC<T>(x)) return createElement(x, props, ...children)
// |
// |    // 2. either JSX, or the notations existing in Loco
// |    if (typeof x === 'object' && x != null) {
// |       if (isValidElement(x)) return x
// |       const keys = Object.keys(x)[0]
// |       if (keys == null) return null
// |       const propsOverride = (x as any)[keys]
// |       return createElement(subcatalog[keys] as any, { ...props, ...propsOverride }, ...children)
// |    }
// |    // 3. a string
// |    if (typeof x === 'string') {
// |       const keys = x
// |       const namedComp = subcatalog[keys]
// |       if (namedComp == null) return x
// |       return createElement(namedComp as any, props, ...children)
// |    }
// |
// |    // some other react node
// |    return x
// | }

/** render with wrapper */
// TODO: remove that, just use `renderFCOrNode`
export const renderFCOrNodeWithWrapper = <
   //
   T extends object,
   U extends object,
>(
   // content
   content: FCOrNode<T>,
   contentProps: NoInfer<T>,
   // wrapper
   wrapper: Maybe<FCOrNode<U>>,
   wrapperProps: NoInfer<U>,
): SimpleReactNode => {
   // if wrapper is already rendered, let's skip the content
   if (/* wrapper != null && */ _isSimpleReactNode(wrapper)) return wrapper

   const inner = _isFC<T>(content) ? createElement(content, contentProps) : content
   // if (inner == null) return null
   // if (wrapper == null) return null

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
