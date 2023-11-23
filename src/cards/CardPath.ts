import { pathe } from 'src/utils/fs/pathUtils'
import { ActionExtensions, hasValidActionExtension } from '../back/ActionExtensions'

export type AppPath = Branded<string, { ActionPath: true; RelativePath: true }>

export const asAppPath = (path: string): AppPath => {
    if (pathe.isAbsolute(path)) throw new Error(`card path (${path}) must be relative`)
    if (!(path.startsWith('library/') || path.startsWith('library\\')))
        throw new Error(`card path (${path}) must start with 'library/'`)
    if (!hasValidActionExtension(path)) throw new Error(`card path (${path}) must end with ${ActionExtensions.join(' or ')}`)

    return path as AppPath
}
