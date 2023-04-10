import type { Branded } from '../utils/types'

export * as pathe from 'pathe'
import * as pathe from 'pathe'

export type RelativePath = Branded<string, 'WorkspaceRelativePath'>
export type AbsolutePath = Branded<string, 'Absolute'>

/** brand a path as an absolute path after basic checks */
export const asAbsolutePath = (path: string): AbsolutePath => {
    const isAbsolute = pathe.isAbsolute(path)
    if (!isAbsolute) throw new Error(`path is not absolute: ${path}`)
    return path as AbsolutePath
}

/** brand a path as a workspace relative pathpath after basic checks */
export const asRelativePath = (path: string): RelativePath => {
    const isAbsolute = pathe.isAbsolute(path)
    if (isAbsolute) throw new Error(`path is absolute: ${path}`)
    return path as RelativePath
}
