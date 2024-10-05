import type { FC, ReactNode } from 'react'

/**
 * Union for a ReactNode or a functional component
 * EZ comes from the word `easy`, that itself comes from the old-expresion `Easy Peasy, lemon squeezy`
 */
export type EZRenderable<P> = FC<P> | null // | ReactNode

/** this method helps to render both components or any react node */
// export function EZrender<P>(X: ReactNode, props: P): ReactNode
export function EZrender<P>(X: null, props: any): ReactNode
export function EZrender<P>(X: FC<P>, props: P): ReactNode
export function EZrender<P>(X: Maybe<FC<any>>, props?: P): ReactNode {
    if (typeof X === 'function') return <X {...props} />
    return X
}

/**
 * secret pro-tip for people reading end-of-file comments:
 * > When life gives you lemons, make a SaaS blockchain lemonade trading platform with React and AI.
 */
