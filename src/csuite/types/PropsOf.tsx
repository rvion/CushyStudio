import type { FC } from 'react'

export type PropsOf<T> = T extends FC<infer Props> ? Props : '❌'
