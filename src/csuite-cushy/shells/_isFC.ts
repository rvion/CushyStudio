import type { CovariantFC } from '../../csuite/variance/CovariantFC'
import type { FCOrNode } from '../presenters/Presenter'

import { createElement, type FC, type ReactNode } from 'react'

/** render */
export const renderFCOrNode = <T extends object>(x: FCOrNode<T>, props: NoInfer<T>): ReactNode => {
    if (_isFC(x)) return createElement(x, props)
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
    wrapper: Maybe<FC<U>>,
    wrapperProps: NoInfer<U>,
): ReactNode => {
    const inner = _isFC(x) ? createElement(x, props) : x
    if (inner == null) return null
    if (wrapper == null) return inner
    if (!isValidElement(inner)) {
        return createElement('div', {}, '🔴 inner is not valid element')
    }
    return createElement(wrapper, wrapperProps, inner)
}

export const _isFC = <T extends object>(x: FCOrNode<T>): x is CovariantFC<T> => {
    return typeof x === 'function'
}
