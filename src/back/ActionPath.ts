import { pathe } from 'src/utils/fs/pathUtils'

export type ActionPath = Branded<string, 'ActionPath'>

export const asActionPath = (path: string): ActionPath => {
    if (pathe.isAbsolute(path)) throw new Error(`action path (${path}) must be relative`)
    if (!(path.startsWith('actions/') || path.startsWith('actions\\')))
        throw new Error(`action path (${path}) must start with 'actions/'`)
    if (!path.endsWith('.ts')) throw new Error(`action path (${path}) must end with '.ts'`)

    return path as ActionPath
}
