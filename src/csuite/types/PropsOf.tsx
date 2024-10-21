import type { FC } from 'react'

/**
 * this type allows to extract the props of a component
 */
export type PropsOf<T> = T extends FC<infer Props> ? Props : '❌'
