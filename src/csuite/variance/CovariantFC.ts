import type { ReactNode } from 'react'

export type CovariantFC<out P> = { covarianceHack(_: P): ReactNode }['covarianceHack']
