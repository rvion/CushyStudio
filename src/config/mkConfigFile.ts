import { resolve } from 'pathe'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { JsonFile } from '../core/JsonFile'
import { ConfigFile } from './ConfigFile'
import { DEFAULT_COMFYUI_INSTANCE_ID } from './ComfyHostDef'

export const mkConfigFile = (): JsonFile<ConfigFile> => {
    return new JsonFile<ConfigFile>({
        path: asAbsolutePath(resolve('CONFIG.json')),
        maxLevel: 3,
        init: (): ConfigFile => ({
            mainComfyHostID: DEFAULT_COMFYUI_INSTANCE_ID,
            galleryImageSize: 48,
            theme: 'dark',
        }),
    })
}
