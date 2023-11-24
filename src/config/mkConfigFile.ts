import { JsonFile } from '../core/JsonFile'
import { asAbsolutePath } from 'src/utils/fs/pathUtils'
import { resolve } from 'pathe'
import { DEFAULT_COMFYUI_INSTANCE_ID, mkDefaultHost } from './ComfyHostDef'
import { ConfigFile } from './ConfigFile'

export const mkConfigFile = (): JsonFile<ConfigFile> => {
    return new JsonFile<ConfigFile>({
        path: asAbsolutePath(resolve('CONFIG.json')),
        maxLevel: 3,
        init: (): ConfigFile => ({
            mainComfyHostID: DEFAULT_COMFYUI_INSTANCE_ID,
            comfyUIHosts: [],
            galleryImageSize: 48,
            theme: 'dark',
        }),
        fixup: (self) => {
            // 2023-11-24 ensure we have a default host
            self.update((x) => {
                if (x.comfyUIHosts == null) {
                    x.comfyUIHosts = [mkDefaultHost()]
                }
                if (x.comfyUIHosts.find((x) => x.id === DEFAULT_COMFYUI_INSTANCE_ID) == null) {
                    x.comfyUIHosts.push(mkDefaultHost())
                }
                if (x.mainComfyHostID == null) {
                    x.mainComfyHostID = DEFAULT_COMFYUI_INSTANCE_ID
                }
            })
        },
    })
}
