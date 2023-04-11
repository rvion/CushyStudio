import type { Branded } from '../utils/types'

export type RelativePath = Branded<string, 'WorkspaceRelativePath'>
export type AbsolutePath = Branded<string, 'Absolute'>
