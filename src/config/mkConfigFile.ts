import { resolve } from 'pathe'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { JsonFile } from '../core/JsonFile'
import { ConfigFile } from './ConfigFile'
import { vIRTUAL_HOST_ID__BASE } from './ComfyHostDef'

export const mkConfigFile = (): JsonFile<ConfigFile> => {
    return new JsonFile<ConfigFile>({
        path: asAbsolutePath(resolve('CONFIG.json')),
        maxLevel: 3,
        init: (): ConfigFile => ({
            mainComfyHostID: vIRTUAL_HOST_ID__BASE,
            galleryImageSize: 48,
            theme: 'dark',
        }),
    })
}
