import { pathe } from 'src/utils/fs/pathUtils'
import { ActionExtensions, hasValidActionExtension } from '../back/ActionExtensions'

export type CardPath = Branded<string, { ActionPath: true; RelativePath: true }>

export const asCardPath = (path: string): CardPath => {
    if (pathe.isAbsolute(path)) throw new Error(`card path (${path}) must be relative`)
    if (!(path.startsWith('library/') || path.startsWith('library\\')))
        throw new Error(`card path (${path}) must start with 'library/'`)
    if (!hasValidActionExtension(path)) throw new Error(`card path (${path}) must end with ${ActionExtensions.join(' or ')}`)

    return path as CardPath
}
