import type { Branded } from '../core/ComfyUtils'

export * as pathe from 'pathe'
import * as pathe from 'pathe'

export type WorkspaceRelativePath = Branded<string, 'WorkspaceRelativePath'>
export type AbsolutePath = Branded<string, 'Absolute'>
export type MonacoPath = Branded<string, 'Monaco'>

/** brand a path as an absolute path after basic checks */
export const asAbsolutePath = (path: string): AbsolutePath => {
    const isAbsolute = pathe.isAbsolute(path)
    if (!isAbsolute) throw new Error(`path is not absolute: ${path}`)
    return path as AbsolutePath
}

/** brand a path as a workspace relative pathpath after basic checks */
export const asRelativePath = (path: string): WorkspaceRelativePath => {
    const isAbsolute = pathe.isAbsolute(path)
    if (isAbsolute) throw new Error(`path is absolute: ${path}`)
    return path as WorkspaceRelativePath
}

/** brand a path as a monaco URI path after basic checks */
export const asMonacoPath = (path: string): MonacoPath => {
    if (path.startsWith('file:////')) throw new Error(`❌ URI path component should not start with //`)
    if (path.startsWith('file:///')) return path as MonacoPath
    throw new Error(`❌ monaco path should start with file:///`)
}
