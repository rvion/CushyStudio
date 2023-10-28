import { pathe } from 'src/utils/fs/pathUtils'
import { ActionExtensions, hasValidActionExtension } from '../back/ActionExtensions'

export type CardPath = Branded<string, { ActionPath: true; RelativePath: true }>

export const asCardPath = (path: string): CardPath => {
    if (pathe.isAbsolute(path)) throw new Error(`action path (${path}) must be relative`)
    if (!(path.startsWith('actions/') || path.startsWith('actions\\')))
        throw new Error(`action path (${path}) must start with 'actions/'`)
    if (!hasValidActionExtension(path)) throw new Error(`action path (${path}) must end with ${ActionExtensions.join(' or ')}`)

    return path as CardPath
}
