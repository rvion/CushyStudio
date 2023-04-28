import type { Branded } from '../types'

export type RelativePath = Branded<string, 'WorkspaceRelativePath'>
export type AbsolutePath = Branded<string, 'Absolute'>
