import type { any_TsEfficient } from './objectAssignTsEfficient'
import type { CSSProperties } from 'react'

export const mergeStylesTsEfficient = (
    //
    target: CSSProperties,
    source?: CSSProperties | undefined,
): CSSProperties => Object.assign(target as any_TsEfficient, source as any_TsEfficient)

export const mergeStylesTsEfficientInNew = (
    //
    target: CSSProperties,
    source?: CSSProperties | undefined,
): CSSProperties => Object.assign({}, target as any_TsEfficient, source as any_TsEfficient)
