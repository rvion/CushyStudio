import type { NO_PROPS } from '../types/NO_PROPS'
import type { FC } from 'react'

const FCNull_: FC<NO_PROPS> = () => null
export const FCNull = <P extends any>(): FC<P> => FCNull_ as FC<P>
