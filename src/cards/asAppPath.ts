import { ActionExtensions, hasValidActionExtension } from '../back/ActionExtensions'
import { pathe } from 'src/utils/fs/pathUtils'

export const isAppPath = (path: string): path is RelativePath => {
    if (pathe.isAbsolute(path)) return false
    if (!(path.startsWith('library/') || path.startsWith('library\\'))) return false
    if (!hasValidActionExtension(path)) return false

    return true
}
export const asAppPath = (path: string): RelativePath => {
    if (pathe.isAbsolute(path)) throw new Error(`card path (${path}) must be relative`)
    if (!(path.startsWith('library/') || path.startsWith('library\\')))
        throw new Error(`card path (${path}) must start with 'library/'`)
    if (!hasValidActionExtension(path)) throw new Error(`card path (${path}) must end with ${ActionExtensions.join(' or ')}`)

    return path as RelativePath
}
