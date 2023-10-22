// import type { CSSObject } from '@emotion/react'
// import type { JSXInternal } from 'react/jsx-runtime'

// declare module './jsx-runtime.ts' {
//     type MergeWithClassName<P> = Omit<P, 'cls'> & { cls?: string; className?: string; css?: CSSObject }

//     export function jsx<P extends JSXInternal.DOMAttributes<T>, T extends HTMLElement>(
//         type: JSXInternal.IntrinsicElementsKeys,
//         props: MergeWithClassName<P>,
//         ...children: JSXInternal.ReactNode[]
//     ): JSXInternal.Element

//     export function jsxDEV<P extends JSXInternal.DOMAttributes<T>, T extends HTMLElement>(
//         type: JSXInternal.IntrinsicElementsKeys,
//         props: MergeWithClassName<P>,
//         ...children: JSXInternal.ReactNode[]
//     ): JSXInternal.Element
// }
